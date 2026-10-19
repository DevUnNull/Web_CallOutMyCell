import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { gameplayPoints } from "../content";
import GameImage from "./GameImage";
import Sticker from "./Sticker";

export default function GameplaySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // Marching-ants outline around the frame: small SVG stroke, cheap to animate.
        gsap.to(".gp__ants rect", { strokeDashoffset: -48, duration: 1.6, ease: "none", repeat: -1 });
        gsap.from(".gp__cell", {
          y: 40,
          autoAlpha: 0,
          rotate: (i) => (i % 2 ? 4 : -4),
          stagger: 0.12,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".gp__tiles", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="gameplay" className="section gameplay" ref={root}>
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Gameplay</p>
          <h2>Triệu hồi tế bào. Bảo vệ cơ thể!</h2>
          <p className="section-head__lead">
            Chiến trường được chia thành các làn ô vuông. Kéo tế bào từ thanh triệu hồi, đặt vào đúng vị trí và giữ
            vững phòng tuyến trước từng đợt mầm bệnh. Gọi wave sớm để nhận thêm ATP — nếu bạn đủ tự tin!
          </p>
        </header>

        <div className="gp__stage" data-reveal>
          <svg className="gp__ants" aria-hidden="true">
            <rect width="100%" height="100%" rx="34" ry="34" pathLength="480" />
          </svg>
          <div className="gp__frame frame frame--jelly">
            <GameImage name="gameplay" />
          </div>
          <Sticker kind="virus" size={58} className="gp__s1" />
          <Sticker kind="bacteria" size={58} className="gp__s2" />
          <Sticker kind="star" size={40} className="gp__s3" />
        </div>

        <ol className="gp__tiles">
          {gameplayPoints.map((p, i) => (
            <li key={p.title} className="gp__cell">
              <div className={`gp__tile ${i % 2 ? "gp__tile--dark" : ""}`}>
                <span className="gp__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
