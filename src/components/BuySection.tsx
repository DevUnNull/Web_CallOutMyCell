import { useEffect, useState, type FormEvent } from "react";
import { Check, Gamepad2, Loader2, QrCode } from "lucide-react";
import { FACEBOOK_URL, PLAY_URL, SHOP_API, plans } from "../content";

// Per-browser memory of the purchase. Payment truth always lives on the server.
const KEY = "comc-purchase";
type Saved = { orderCode: string; email: string; token?: string };

function load(): Saved | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}
function save(v: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* private mode: purchase still works, just not remembered */
  }
}

type Phase =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "waiting" } // back from PayOS, confirming with the server
  | { kind: "owned"; token: string }
  | { kind: "error"; msg: string };

// fetch() throws TypeError ("Failed to fetch") when the server cannot be reached at all.
function errorText(err: unknown): string {
  if (err instanceof TypeError) return "Không kết nối được máy chủ thanh toán. Hãy kiểm tra mạng, tắt trình chặn quảng cáo (nếu có) rồi thử lại.";
  return err instanceof Error ? err.message : "Có lỗi xảy ra.";
}

async function checkOrder(orderCode: string, email: string) {
  const res = await fetch(`${SHOP_API}/api/orders/${encodeURIComponent(orderCode)}?email=${encodeURIComponent(email)}`);
  const data = (await res.json()) as { status?: string; token?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Không kiểm tra được đơn hàng.");
  return data;
}

export default function BuySection() {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const [restore, setRestore] = useState({ orderCode: "", email: "" });
  const saved = load();

  // On load: already owned? Or just returned from the PayOS checkout page?
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const returned = params.get("orderCode");
    const s = load();
    if (returned) {
      history.replaceState(null, "", location.pathname + "#mua");
      document.getElementById("mua")?.scrollIntoView({ behavior: "instant" });
    }
    if (s?.token) return setPhase({ kind: "owned", token: s.token });
    // Paid earlier but closed the tab before returning: one quiet re-check on a normal visit.
    if (!returned && s) {
      checkOrder(s.orderCode, s.email)
        .then((r) => {
          if (r.status === "paid" && r.token) {
            save({ ...s, token: r.token });
            setPhase({ kind: "owned", token: r.token });
          }
        })
        .catch(() => {});
      return;
    }
    if (!returned || !s || s.orderCode !== returned) return;
    if (params.get("cancel") === "true") return setPhase({ kind: "error", msg: "Bạn đã hủy thanh toán. Có thể mua lại bất cứ lúc nào." });

    // Bank transfers can take a few seconds to reach PayOS: poll for up to ~2 minutes.
    setPhase({ kind: "waiting" });
    let tries = 0;
    let stop = false;
    const tick = async () => {
      if (stop) return;
      try {
        const r = await checkOrder(s.orderCode, s.email);
        if (r.status === "paid" && r.token) {
          save({ ...s, token: r.token });
          return setPhase({ kind: "owned", token: r.token });
        }
      } catch {
        /* retry */
      }
      if (++tries < 40) setTimeout(tick, 3000);
      else setPhase({ kind: "error", msg: `Chưa xác nhận được thanh toán. Nếu bạn đã chuyển tiền, hãy dùng mục "Đã mua rồi?" với mã đơn ${s.orderCode}.` });
    };
    tick();
    return () => {
      stop = true;
    };
  }, []);

  const buy = async (e: FormEvent) => {
    e.preventDefault();
    setPhase({ kind: "busy" });
    try {
      const res = await fetch(`${SHOP_API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { orderCode?: number; checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error ?? "Không tạo được đơn hàng.");
      save({ orderCode: String(data.orderCode), email: email.trim().toLowerCase() });
      location.href = data.checkoutUrl;
    } catch (err) {
      setPhase({ kind: "error", msg: errorText(err) });
    }
  };

  const doRestore = async (e: FormEvent) => {
    e.preventDefault();
    setPhase({ kind: "busy" });
    try {
      const r = await checkOrder(restore.orderCode.trim(), restore.email.trim().toLowerCase());
      if (r.status !== "paid" || !r.token) throw new Error("Đơn hàng này chưa được thanh toán.");
      save({ orderCode: restore.orderCode.trim(), email: restore.email.trim().toLowerCase(), token: r.token });
      setPhase({ kind: "owned", token: r.token });
    } catch (err) {
      setPhase({ kind: "error", msg: errorText(err) });
    }
  };

  const busy = phase.kind === "busy" || phase.kind === "waiting";
  const support = FACEBOOK_URL ? (
    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
      fanpage Facebook
    </a>
  ) : (
    "fanpage Facebook (sắp cập nhật)"
  );

  return (
    <section id="mua" className="section buy">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Mua game</p>
          <h2>Chơi thử miễn phí, thích thì mở khóa bản đầy đủ!</h2>
        </header>

        <div className="buy__plans">
          <article className="plan plan--demo" data-reveal>
            <h3>{plans.demo.name}</h3>
            <p className="plan__price">{plans.demo.price}</p>
            <ul className="plan__perks">
              {plans.demo.perks.map((p) => (
                <li key={p}>
                  <Check size={18} aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            {PLAY_URL && (
              <a href={PLAY_URL} className="btn btn--cream" target="_blank" rel="noopener noreferrer">
                <Gamepad2 size={20} aria-hidden="true" /> Chơi demo
              </a>
            )}
          </article>

          <article className="plan plan--full" data-reveal>
            <span className="plan__ribbon">Khuyên dùng</span>
            <h3>{plans.full.name}</h3>
            <p className="plan__price">{plans.full.price}</p>
            <ul className="plan__perks">
              {plans.full.perks.map((p) => (
                <li key={p}>
                  <Check size={18} aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>

            {phase.kind === "owned" ? (
              <div className="buy__owned" role="status">
                <p>🎉 Bạn đã sở hữu bản đầy đủ!</p>
                {saved?.orderCode && (
                  <p className="buy__code">
                    Mã đơn của bạn: <b>{saved.orderCode}</b> — hãy lưu lại để chơi trên thiết bị khác.
                  </p>
                )}
                <a href={`${SHOP_API}/play/?token=${phase.token}`} className="btn btn--pink btn--lg">
                  <Gamepad2 size={22} aria-hidden="true" /> Chơi bản đầy đủ
                </a>
              </div>
            ) : !SHOP_API ? (
              <span className="btn btn--pink is-soon" role="status">
                Sắp mở bán
              </span>
            ) : (
              <form className="buy__form" onSubmit={buy}>
                <label htmlFor="buy-email">Email nhận mã đơn</label>
                <input
                  id="buy-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ban@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn--pink" disabled={busy}>
                  {busy ? <Loader2 size={20} className="spin" aria-hidden="true" /> : <QrCode size={20} aria-hidden="true" />}
                  {phase.kind === "waiting" ? "Đang xác nhận thanh toán…" : "Thanh toán bằng VietQR"}
                </button>
              </form>
            )}
          </article>
        </div>

        {phase.kind === "error" && (
          <p className="buy__error" role="alert">
            {phase.msg}
          </p>
        )}

        {SHOP_API && phase.kind !== "owned" && (
          <details className="buy__restore" data-reveal>
            <summary>Đã mua rồi? Chơi tiếp trên thiết bị này</summary>
            <form onSubmit={doRestore}>
              <input
                aria-label="Mã đơn hàng"
                placeholder="Mã đơn hàng"
                inputMode="numeric"
                required
                value={restore.orderCode}
                onChange={(e) => setRestore({ ...restore, orderCode: e.target.value })}
              />
              <input
                aria-label="Email đã dùng khi mua"
                type="email"
                placeholder="Email đã dùng khi mua"
                required
                value={restore.email}
                onChange={(e) => setRestore({ ...restore, email: e.target.value })}
              />
              <button type="submit" className="btn btn--cream btn--sm" disabled={busy}>
                Mở khóa
              </button>
            </form>
          </details>
        )}

        <p className="buy__note" data-reveal>
          Thanh toán an toàn qua VietQR (PayOS) — quét mã bằng app ngân hàng bất kỳ. Không phù hợp trong 2 giờ chơi
          đầu? Nhắn {support} kèm mã đơn để được hoàn tiền.
        </p>
      </div>
    </section>
  );
}
