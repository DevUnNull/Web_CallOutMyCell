// Call Out My Cells shop: sells access to the full web build via PayOS (VietQR).
//
// Flow:
//   POST /api/orders            {email}        -> create PayOS payment link, return checkoutUrl
//   GET  /api/orders/:code?email=               -> check payment with PayOS; when PAID return an access token
//   GET  /play/?token=...                       -> validate token, set cookie, serve the full game from R2 (prefix "full/")
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
      return new Response("Not found", { status: 404 });
    } catch (e) {
      console.error(e);
      const res = json({ error: "Lỗi máy chủ, vui lòng thử lại sau." }, 500);
      return url.pathname.startsWith("/api/") ? cors(env, res, req.headers.get("Origin")) : res;
    }
  },
};

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
      body: JSON.stringify({ ...link, signature }),
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

    if (order.status === "pending" && (await isPaid(order, env))) {
      const token = randomHex(32);
      await env.DB.prepare("UPDATE orders SET status = 'paid', token = ?, paid_at = ? WHERE order_code = ? AND status = 'pending'")
        .bind(token, Date.now(), order.order_code)
        .run();
      order.status = "paid";
      order.token = token;
    }
    if (order.status === "paid") return json({ status: "paid", token: order.token });
    return json({ status: order.status });
  }

  return json({ error: "Not found" }, 404);
}

type Order = { order_code: number; email: string; amount: number; status: string; token: string | null };

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
