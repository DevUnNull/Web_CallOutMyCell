import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import { lifestyleChoices, lifestyleExamples } from "../content";
import GameImage from "./GameImage";
import Sticker from "./Sticker";

export default function LifestyleSection() {
  const root = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const choice = lifestyleChoices.find((c) => c.id === picked);

  // Pop the result card in whenever a new choice is made.
  useGSAP(
    () => {
      if (!choice) return;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".vn-result", { y: 16, autoAlpha: 0, duration: 0.45, ease: "back.out(1.8)" });
        gsap.from(".vn-result .stat", { scale: 0.5, autoAlpha: 0, stagger: 0.08, duration: 0.35, delay: 0.15 });
      });
    },
    { scope: root, dependencies: [picked], revertOnUpdate: true },
  );

  return (
    <section id="loi-song" className="section lifestyle" ref={root}>
      <div className="container">
        <header className="section-head section-head--light" data-reveal>
          <p className="eyebrow">Lựa chọn lối sống</p>
          <h2>Một lựa chọn nhỏ, một thay đổi lớn!</h2>
          <p className="section-head__lead">
            Trước mỗi trận chiến là một ngày bình thường. Ngủ đủ hay thức khuya, vận động hay nằm lì, ăn gì cho bữa
            trưa… mọi quyết định đều tác động tới thể trạng cơ thể — và đội quân tế bào sẽ mang thể trạng ấy vào
            chiến trường.
          </p>
          <ul className="chip-row">
            {lifestyleExamples.map((e) => (
              <li key={e} className="chip">
                {e}
              </li>
            ))}
          </ul>
        </header>

        <div className="lifestyle__grid">
          <figure className="lifestyle__shot polaroid" data-reveal>
            <span className="tape tape--top" aria-hidden="true" />
            <GameImage name="lifestyle" />
            <figcaption>Cảnh lựa chọn buổi sáng trong game</figcaption>
          </figure>

          <div className="vn" data-reveal>
            <p className="vn__demo-tag">
              <Info size={16} aria-hidden="true" /> Bản minh họa trên website — không phải mô phỏng thật của game
            </p>

            <div className="vn__choices" role="group" aria-label="Chọn cách bắt đầu buổi sáng">
              {lifestyleChoices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="vn__choice"
                  aria-pressed={picked === c.id}
                  onClick={() => setPicked(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="vn__box">
              <span className="vn__name">Tôi</span>
              <p className="vn__line" aria-live="polite">
                {choice ? choice.line : "Mới 6 rưỡi thôi á? Đầu nặng như đeo đá… Giờ làm gì đây ta?"}
              </p>
              <Sticker kind="sparkle" size={34} className="vn__spark" />
            </div>

            {choice ? (
              <div className="vn-result" key={choice.id}>
                <p className="vn-result__title">Ảnh hưởng có thể xảy ra:</p>
                <ul className="vn-result__stats">
                  {choice.effects.map((e) => (
                    <li key={e.stat} className={`stat ${e.good ? "stat--good" : "stat--bad"}`}>
                      {e.trend === "up" ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
                      {e.stat} <span className="sr-only">{e.trend === "up" ? "tăng" : "giảm"}</span>
                    </li>
                  ))}
                </ul>
                <p className="vn-result__note">{choice.note}</p>
              </div>
            ) : (
              <p className="vn-hint">👆 Thử chọn một hành động để xem nó có thể ảnh hưởng tới trận đấu ra sao!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
