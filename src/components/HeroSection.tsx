import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Sparkles } from "lucide-react";
import GameImage from "./GameImage";
import Sticker from "./Sticker";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "back.out(1.6)" } })
          .from(".hero__kicker", { y: 20, autoAlpha: 0, duration: 0.5 })
          .from(".hero__title span", { y: 60, autoAlpha: 0, rotate: -6, stagger: 0.12, duration: 0.7 }, "-=0.2")
          .from(".hero__tagline, .hero__lead", { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }, "-=0.35")
          .from(".hero__cta", { y: 20, autoAlpha: 0, duration: 0.5 }, "-=0.3")
          .from(".hero__frame", { scale: 0.92, autoAlpha: 0, rotate: 3, duration: 0.9, ease: "power3.out" }, 0.25)
          .from(".hero__stickers .sticker", { scale: 0, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, 0.7);
      });
    },
    { scope: root },
  );

  return (
    <section id="trang-chu" className="hero" ref={root}>
      <div className="hero__blob hero__blob--a" aria-hidden="true" />
      <div className="hero__blob hero__blob--b" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__text">
          <p className="hero__kicker">
            <Sparkles size={16} aria-hidden="true" /> Game thủ thành × Mô phỏng lối sống
          </p>
          <h1 className="hero__title">
            <span>Call Out</span> <span>My Cells</span>
          </h1>
          <p className="hero__tagline">Đội quân tế bào nhỏ bé. Cuộc chiến bảo vệ cơ thể!</p>
          <p className="hero__lead">
            Xây dựng đội quân tế bào miễn dịch, chống lại những đợt tấn công của mầm bệnh và khám phá cách mỗi
            lựa chọn của bạn có thể thay đổi trận chiến.
          </p>
          <div className="hero__cta">
            <a href="#gioi-thieu" className="btn btn--pink">
              Khám phá trò chơi
            </a>
            <a href="#gameplay" className="btn btn--cream">
              <Play size={18} aria-hidden="true" /> Xem Gameplay
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__frame frame">
            <span className="tape tape--tl" aria-hidden="true" />
            <span className="tape tape--br" aria-hidden="true" />
            <GameImage name="gameplay" eager />
            <span className="frame__label">Ảnh chụp trong game</span>
          </div>
          <div className="hero__stickers" aria-hidden="true">
            <Sticker kind="virus" size={64} style={{ top: "-6%", left: "-4%" }} />
            <Sticker kind="star" size={44} style={{ top: "-9%", right: "18%" }} />
            <Sticker kind="cell" size={70} style={{ bottom: "-12%", right: "-3%" }} />
            <Sticker kind="heart" size={40} style={{ bottom: "-9%", right: "26%" }} />
            <Sticker kind="bubble" size={34} style={{ top: "38%", right: "-5%" }} />
            <Sticker kind="flower" size={46} style={{ top: "44%", left: "-6%" }} />
          </div>
        </div>
      </div>

      <svg className="wave wave--bottom" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40c120 30 240 30 360 0s240-30 360 0 240 30 360 0 240-30 360 0v40H0z" fill="var(--paper)" />
      </svg>
    </section>
  );
}
