// Call Out My Cells shop: sells access to the full web build via PayOS (VietQR).
//
// Flow:
//   POST /api/orders            {email}        -> create PayOS payment link, return checkoutUrl
//   GET  /api/orders/:code?email=               -> check payment with PayOS; when PAID return an access token
//   GET  /play/?token=...                       -> validate token, set cookie, serve the full game from R2 (prefix "full/")
//   GET  /admin?month=YYYY-MM  (+ /admin.csv)   -> monthly sales report, HTTP Basic auth (ADMIN_PASSWORD)
//   cron every 10 min                           -> reconcile pending orders with PayOS (buyer may close the tab after paying)
//
// Payment is confirmed by asking PayOS directly (server to server), never by trusting the browser redirect.
// Refund = revoke access manually, see worker/README.md.

export interface Env {
  DB: D1Database;
  GAME: R2Bucket;
  SITE_URL: string; // landing page, PayOS returns here after paying
  SITE_ORIGIN: string; // allowed CORS origin
  PRICE: string; // VND
  PAYOS_CLIENT_ID: string;
  PAYOS_API_KEY: string;
  PAYOS_CHECKSUM_KEY: string;
  ADMIN_PASSWORD: string;
  MOCK_PAYMENTS?: string; // "1" only in local .dev.vars: every order counts as paid, no real money
}

const PAYOS = "https://api-merchant.payos.vn/v2/payment-requests";
const COOKIE = "comc_play";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    try {
      if (url.pathname.startsWith("/api/")) {
        if (req.method === "OPTIONS") return cors(env, new Response(null, { status: 204 }), req.headers.get("Origin"));
        return cors(env, await api(req, url, env), req.headers.get("Origin"));
      }
      if (url.pathname === "/play") return Response.redirect(url.origin + "/play/" + url.search, 302);
      if (url.pathname.startsWith("/play/")) return play(req, url, env);
      if (url.pathname === "/admin" || url.pathname === "/admin.csv") return admin(req, url, env);
      return new Response("Not found", { status: 404 });
    } catch (e) {
      console.error(e);
      const res = json({ error: "Lỗi máy chủ, vui lòng thử lại sau." }, 500);
      return url.pathname.startsWith("/api/") ? cors(env, res, req.headers.get("Origin")) : res;
    }
  },

  // Reconcile recent pending orders so reports are right even if the buyer never came back to the site.
  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE status = 'pending' AND created_at > ? ORDER BY created_at DESC LIMIT 40",
    )
      .bind(Date.now() - 2 * 3600_000)
      .all<Order>();
    for (const o of results) {
      if (await isPaid(o, env)) await markPaid(o, env);
      else if (o.created_at < Date.now() - LINK_TTL_MS - 5 * 60_000)
        await env.DB.prepare("UPDATE orders SET status = 'expired' WHERE order_code = ? AND status = 'pending'").bind(o.order_code).run();
    }
  },
};

const LINK_TTL_MS = 30 * 60_000; // PayOS payment link lifetime

// ---------- API ----------

async function api(req: Request, url: URL, env: Env): Promise<Response> {
  if (url.pathname === "/api/orders" && req.method === "POST") {
    const body = (await req.json().catch(() => ({}))) as { email?: unknown };
    const email = normalizeEmail(body.email);
    if (!email) return json({ error: "Email không hợp lệ." }, 400);

    const amount = Number(env.PRICE);
    // PayOS needs a unique positive integer order code.
    const orderCode = Number(String(Date.now()).slice(-10)) * 1000 + Math.floor(Math.random() * 1000);
    await env.DB.prepare("INSERT INTO orders (order_code, email, amount, status, created_at) VALUES (?, ?, ?, 'pending', ?)")
      .bind(orderCode, email, amount, Date.now())
      .run();

    if (env.MOCK_PAYMENTS === "1") {
      return json({ orderCode, checkoutUrl: `${env.SITE_URL}?orderCode=${orderCode}&status=PAID` });
    }

    const link = {
      orderCode,
      amount,
      description: "Mua game COMC",
      returnUrl: env.SITE_URL,
      cancelUrl: env.SITE_URL,
      buyerEmail: email,
    };
    const signature = await hmacHex(
      env.PAYOS_CHECKSUM_KEY,
      `amount=${link.amount}&cancelUrl=${link.cancelUrl}&description=${link.description}&orderCode=${link.orderCode}&returnUrl=${link.returnUrl}`,
    );
    const res = await fetch(PAYOS, {
      method: "POST",
      headers: payosHeaders(env),
      body: JSON.stringify({ ...link, signature, expiredAt: Math.floor((Date.now() + LINK_TTL_MS) / 1000) }),
    });
    const data = (await res.json()) as { code: string; desc: string; data?: { checkoutUrl: string } };
    if (data.code !== "00" || !data.data) {
      console.error("PayOS create failed", data.code, data.desc);
      return json({ error: "Không tạo được mã thanh toán, vui lòng thử lại." }, 502);
    }
    return json({ orderCode, checkoutUrl: data.data.checkoutUrl });
  }

  const m = url.pathname.match(/^\/api\/orders\/(\d{1,16})$/);
  if (m && req.method === "GET") {
    const email = normalizeEmail(url.searchParams.get("email"));
    const order = await env.DB.prepare("SELECT * FROM orders WHERE order_code = ?").bind(Number(m[1])).first<Order>();
    // Same answer for "no such order" and "wrong email" so order codes can't be probed.
    if (!order || !email || order.email !== email) return json({ error: "Không tìm thấy đơn hàng với mã và email này." }, 404);

    if (order.status === "pending" && (await isPaid(order, env))) await markPaid(order, env);
    // The cron may have marked it paid with its own token: re-read so both paths agree.
    if (order.status !== "paid") Object.assign(order, await env.DB.prepare("SELECT * FROM orders WHERE order_code = ?").bind(order.order_code).first<Order>());
    if (order.status === "paid") return json({ status: "paid", token: order.token });
    return json({ status: order.status });
  }

  return json({ error: "Not found" }, 404);
}

type Order = {
  order_code: number;
  email: string;
  amount: number;
  status: string; // pending | paid | expired | refunded
  token: string | null;
  created_at: number;
  paid_at: number | null;
};

async function markPaid(order: Order, env: Env): Promise<void> {
  const token = randomHex(32);
  const now = Date.now();
  // "AND status = pending" makes this idempotent if the cron and the buyer confirm at the same moment.
  const r = await env.DB.prepare("UPDATE orders SET status = 'paid', token = ?, paid_at = ? WHERE order_code = ? AND status = 'pending'")
    .bind(token, now, order.order_code)
    .run();
  if (r.meta.changes) Object.assign(order, { status: "paid", token, paid_at: now });
}

async function isPaid(order: Order, env: Env): Promise<boolean> {
  if (env.MOCK_PAYMENTS === "1") return true;
  const res = await fetch(`${PAYOS}/${order.order_code}`, { headers: payosHeaders(env) });
  const data = (await res.json()) as { code: string; data?: { status: string; amountPaid: number } };
  return data.code === "00" && data.data?.status === "PAID" && data.data.amountPaid >= order.amount;
}

// ---------- Game files ----------

async function play(req: Request, url: URL, env: Env): Promise<Response> {
  const fromQuery = url.searchParams.get("token");
  if (fromQuery) {
    if (!(await validToken(fromQuery, env))) return accessDenied(env);
    // Move the token into a cookie so every game file request is authorised, then drop it from the URL.
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.origin + "/play/",
        "Set-Cookie": `${COOKIE}=${fromQuery}; Path=/play; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  const token = cookie(req, COOKIE);
  if (!token || !(await validToken(token, env))) return accessDenied(env);

  const path = url.pathname.slice("/play/".length) || "index.html";
  const obj = await env.GAME.get("full/" + path);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers({ "Cache-Control": "private, max-age=3600" });
  // Unity WebGL ships pre-compressed files (.br / .gz): serve them as-is with the right encoding.
  let name = path;
  if (name.endsWith(".br")) {
    headers.set("Content-Encoding", "br");
    name = name.slice(0, -3);
  } else if (name.endsWith(".gz")) {
    headers.set("Content-Encoding", "gzip");
    name = name.slice(0, -3);
  }
  headers.set("Content-Type", contentType(name));
  return new Response(obj.body, { headers, encodeBody: headers.has("Content-Encoding") ? "manual" : "automatic" });
}

async function validToken(token: string, env: Env): Promise<boolean> {
  if (!/^[0-9a-f]{64}$/.test(token)) return false;
  return !!(await env.DB.prepare("SELECT 1 FROM orders WHERE token = ? AND status = 'paid'").bind(token).first());
}

function accessDenied(env: Env): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Cần mã truy cập</title>
<body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#57362F;background:#FFF7EA">
<h1>Bạn chưa có quyền chơi bản đầy đủ</h1>
<p>Hãy mua game hoặc nhập lại mã đơn hàng trên trang chủ.</p>
<p><a href="${env.SITE_URL}#mua">Về trang mua game</a></p></body>`,
    { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

// ---------- Admin report ----------

const VN_OFFSET = 7 * 3600_000; // report months in Vietnam time (UTC+7)

async function admin(req: Request, url: URL, env: Env): Promise<Response> {
  if (!(await isAdmin(req, env))) {
    return new Response("Cần đăng nhập", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="COMC admin", charset="UTF-8"' } });
  }

  const now = new Date(Date.now() + VN_OFFSET);
  const month = /^\d{4}-\d{2}$/.test(url.searchParams.get("month") ?? "")
    ? url.searchParams.get("month")!
    : `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const [y, m] = month.split("-").map(Number);
  const from = Date.UTC(y, m - 1, 1) - VN_OFFSET;
  const to = Date.UTC(y, m, 1) - VN_OFFSET;

  // Sales are counted by payment time; refunded orders keep their paid_at.
  const { results: rows } = await env.DB.prepare(
    "SELECT * FROM orders WHERE paid_at >= ? AND paid_at < ? AND status IN ('paid', 'refunded') ORDER BY paid_at DESC",
  )
    .bind(from, to)
    .all<Order>();

  if (url.pathname === "/admin.csv") {
    const csv = [
      "Thoi gian thanh toan,Ma don,Email,So tien,Trang thai",
      ...rows.map((o) => [vnTime(o.paid_at!), o.order_code, o.email, o.amount, o.status].join(",")),
    ].join("\r\n");
    return new Response("﻿" + csv, {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="don-hang-${month}.csv"` },
    });
  }

  const paid = rows.filter((o) => o.status === "paid");
  const refunded = rows.filter((o) => o.status === "refunded");
  const revenue = paid.reduce((s, o) => s + o.amount, 0);
  const abandoned = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM orders WHERE created_at >= ? AND created_at < ? AND status IN ('pending', 'expired')",
  )
    .bind(from, to)
    .first<number>("n");
  const weeks = await weeklySales(env, 12);

  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
  const html = `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Báo cáo bán hàng ${month}</title>
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:24px 16px;background:#FFF7EA;color:#57362F}
main{max-width:960px;margin:0 auto}h1{margin:0 0 16px}
form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:20px}
input,button,a.btn{font:inherit;padding:6px 12px;border:2px solid #57362F;border-radius:10px;background:#fff;color:#57362F;text-decoration:none}
button,a.btn{background:#F6A5B5;font-weight:700;cursor:pointer}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:24px}
.card{background:#fff;border:2px solid #57362F;border-radius:14px;padding:14px}.card b{display:block;font-size:28px}
table{width:100%;border-collapse:collapse;background:#fff;margin-bottom:28px}th,td{padding:8px;border-bottom:1px solid #eadbc8;text-align:left;font-size:14px}
th{background:#FDE9ED}
.chart{background:#fff;border:2px solid #57362F;border-radius:14px;padding:12px 8px 4px;margin-bottom:12px;overflow-x:auto}
.chart svg{display:block;width:100%;min-width:620px;height:auto}.chart text{font:12px system-ui,sans-serif;fill:#8A6157}
.chart .grid{stroke:#F1E6D8}.chart .base{stroke:#C9B8A6}.chart .bar{fill:#D4637A}.chart .val{fill:#57362F;font-weight:700;opacity:0}
.chart .col:hover .bar{fill:#B44B62}.chart .col:hover .val,.chart .val.keep{opacity:1}.chart .hit{fill:transparent}
details{margin-bottom:28px}summary{cursor:pointer;font-weight:700;margin-bottom:8px}.refunded{color:#a33;text-decoration:line-through}.wrap{overflow-x:auto}
</style><main>
<h1>Báo cáo bán hàng</h1>
<form><label>Tháng <input type="month" name="month" value="${month}"></label><button>Xem</button>
<a class="btn" href="/admin.csv?month=${month}">Tải Excel (CSV)</a></form>
<div class="cards">
<div class="card">Người mua<b>${paid.length}</b></div>
<div class="card">Doanh thu<b>${vnd(revenue)}</b></div>
<div class="card">Đã hoàn tiền<b>${refunded.length}</b></div>
<div class="card">Đơn tạo nhưng không trả<b>${abandoned ?? 0}</b></div>
</div>
<h2>Đơn đã thanh toán tháng ${month}</h2>
<div class="wrap"><table><tr><th>Thời gian</th><th>Mã đơn</th><th>Email</th><th>Số tiền</th><th>Trạng thái</th></tr>
${rows.map((o) => `<tr class="${o.status}"><td>${vnTime(o.paid_at!)}</td><td>${o.order_code}</td><td>${esc(o.email)}</td><td>${vnd(o.amount)}</td><td>${o.status === "paid" ? "Đã thanh toán" : "Đã hoàn tiền"}</td></tr>`).join("") || `<tr><td colspan="5">Chưa có đơn nào.</td></tr>`}
</table></div>
<h2>Người mua theo tuần (12 tuần gần nhất)</h2>
${weekChart(weeks)}
<details><summary>Xem dạng bảng</summary><div class="wrap"><table><tr><th>Tuần</th><th>Người mua</th><th>Doanh thu</th></tr>
${weeks.map((w) => `<tr><td>${w.label}</td><td>${w.buyers}</td><td>${vnd(w.revenue)}</td></tr>`).join("")}
</table></div></details>
<p>Hoàn tiền: xem hướng dẫn trong worker/README.md. Số liệu "người mua" không tính đơn đã hoàn tiền.</p>
</main></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

type Week = { label: string; buyers: number; revenue: number };

// Monday-based weeks in Vietnam time, oldest first.
async function weeklySales(env: Env, count: number): Promise<Week[]> {
  const DAY = 86400_000;
  const nowVn = Date.now() + VN_OFFSET;
  const todayVn = nowVn - (nowVn % DAY);
  const mondayVn = todayVn - ((new Date(todayVn).getUTCDay() + 6) % 7) * DAY;
  const startVn = mondayVn - (count - 1) * 7 * DAY;
  const { results } = await env.DB.prepare("SELECT paid_at, amount FROM orders WHERE status = 'paid' AND paid_at >= ?")
    .bind(startVn - VN_OFFSET)
    .all<{ paid_at: number; amount: number }>();
  const fmt = (ms: number) => new Date(ms).toISOString().slice(5, 10).split("-").reverse().join("/");
  const weeks: Week[] = Array.from({ length: count }, (_, i) => {
    const s = startVn + i * 7 * DAY;
    return { label: `${fmt(s)}–${fmt(s + 6 * DAY)}`, buyers: 0, revenue: 0 };
  });
  for (const r of results) {
    const w = weeks[Math.floor((r.paid_at + VN_OFFSET - startVn) / (7 * DAY))];
    if (w) {
      w.buyers++;
      w.revenue += r.amount;
    }
  }
  return weeks;
}

// Single-series bar chart as inline SVG: rounded bar tops, recessive grid, hover shows the value + native tooltip.
function weekChart(weeks: Week[]): string {
  const W = 900, H = 260, L = 36, R = 8, T = 22, B = 34;
  const max = Math.max(...weeks.map((w) => w.buyers));
  const step = Math.max(1, Math.ceil(max / 4));
  const top = step * 4;
  const y = (v: number) => T + (H - T - B) * (1 - v / top);
  const band = (W - L - R) / weeks.length;
  const bw = Math.min(44, band - 6);
  const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
  const grid = [0, 1, 2, 3, 4]
    .map((i) => `<line class="${i ? "grid" : "base"}" x1="${L}" x2="${W - R}" y1="${y(i * step)}" y2="${y(i * step)}"/><text x="${L - 6}" y="${y(i * step) + 4}" text-anchor="end">${i * step}</text>`)
    .join("");
  const cols = weeks
    .map((w, i) => {
      const cx = L + band * i + band / 2;
      const by = y(w.buyers);
      const h = H - B - by;
      const r = Math.min(4, h);
      // Bar anchored to the baseline, only the top corners rounded.
      const bar = h > 0
        ? `<path class="bar" d="M${cx - bw / 2},${H - B}V${by + r}Q${cx - bw / 2},${by} ${cx - bw / 2 + r},${by}H${cx + bw / 2 - r}Q${cx + bw / 2},${by} ${cx + bw / 2},${by + r}V${H - B}Z"/>`
        : "";
      const keep = w.buyers > 0 && (w.buyers === max || i === weeks.length - 1) ? " keep" : "";
      const tick = i % 2 === weeks.length % 2 || i === weeks.length - 1 ? `<text x="${cx}" y="${H - B + 18}" text-anchor="middle">${w.label.split("–")[0]}</text>` : "";
      return `<g class="col"><title>Tuần ${w.label}: ${w.buyers} người mua · ${vnd(w.revenue)}</title>${bar}<text class="val${keep}" x="${cx}" y="${by - 6}" text-anchor="middle">${w.buyers}</text>${tick}<rect class="hit" x="${cx - band / 2}" y="${T}" width="${band}" height="${H - T - B}"/></g>`;
    })
    .join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Số người mua mỗi tuần trong 12 tuần gần nhất">${grid}${cols}</svg></div>`;
}

async function isAdmin(req: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false; // no password configured = admin disabled
  const m = (req.headers.get("Authorization") ?? "").match(/^Basic (.+)$/);
  if (!m) return false;
  let pass = "";
  try {
    pass = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0))).split(":").slice(1).join(":");
  } catch {
    return false;
  }
  const a = new TextEncoder().encode(pass);
  const b = new TextEncoder().encode(env.ADMIN_PASSWORD);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

function vnTime(ms: number): string {
  return new Date(ms + VN_OFFSET).toISOString().slice(0, 16).replace("T", " ");
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

// ---------- helpers ----------

export function contentType(name: string): string {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  const types: Record<string, string> = {
    html: "text/html; charset=utf-8",
    js: "application/javascript",
    css: "text/css",
    json: "application/json",
    wasm: "application/wasm",
    data: "application/octet-stream",
    png: "image/png",
    jpg: "image/jpeg",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    webp: "image/webp",
  };
  return types[ext] ?? "application/octet-stream";
}

function normalizeEmail(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const e = v.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

function payosHeaders(env: Env): HeadersInit {
  return { "x-client-id": env.PAYOS_CLIENT_ID, "x-api-key": env.PAYOS_API_KEY, "Content-Type": "application/json" };
}

async function hmacHex(key: string, data: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes: number): string {
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function cookie(req: Request, name: string): string | null {
  const m = (req.headers.get("Cookie") ?? "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

function cors(env: Env, res: Response, origin: string | null): Response {
  const r = new Response(res.body, res);
  // SITE_ORIGIN may list several origins, comma-separated (live site + local dev).
  const allowed = env.SITE_ORIGIN.split(",").map((s) => s.trim());
  r.headers.set("Access-Control-Allow-Origin", origin && allowed.includes(origin) ? origin : allowed[0]);
  r.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  r.headers.set("Access-Control-Allow-Headers", "Content-Type");
  r.headers.set("Vary", "Origin");
  return r;
}
