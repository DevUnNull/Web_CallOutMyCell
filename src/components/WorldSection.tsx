import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GameImage from "./GameImage";
import Sticker from "./Sticker";

const steps = [
  { day: "Ngày 1", text: "Mở cuốn sổ, bắt đầu một ngày mới cùng cô bạn nhỏ." },
  { day: "Mỗi ngày", text: "Đưa ra lựa chọn sinh hoạt, rồi bước vào trận chiến bên trong cơ thể." },
  { day: "Chặng tiếp", text: "Vượt qua thử thách để mở khóa ngày tiếp theo trên bản đồ." },
];

export default function WorldSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // A solid mask path "draws" the dashed trail as you scroll (dashes stay intact).
        gsap.fromTo(
          ".world__trail-mask",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
          },
        );
        gsap.from(".world__step", {
          x: -30,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".world__steps", start: "top 80%", once: true },
        });
        gsap.to(".world__deco", {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="the-gioi" className="section world" ref={root}>
      <svg className="world__trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id="trail-mask" maskUnits="userSpaceOnUse">
            <path
              className="world__trail-mask"
              d="M6 4 C 30 14, 70 6, 88 22 S 20 46, 30 62 S 90 70, 80 96"
              pathLength="1"
              strokeDasharray="1"
            />
          </mask>
        </defs>
        <path
          className="world__trail-line"
          d="M6 4 C 30 14, 70 6, 88 22 S 20 46, 30 62 S 90 70, 80 96"
          mask="url(#trail-mask)"
        />
      </svg>

      <div className="container">
        <div className="notebook" data-reveal>
          <div className="notebook__rings" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="notebook__page">
            <header className="section-head section-head--left">
              <p className="eyebrow">Thế giới &amp; Chiến dịch</p>
              <h2>Hành trình khám phá thế giới bên trong bạn!</h2>
              <p className="section-head__lead">
                Bản đồ hành trình là một cuốn sổ tay phiêu lưu. Mỗi “Ngày” là một chặng mới, nối với nhau bằng con
                đường nét đứt xuyên qua rừng cây, dòng sông và những ngọn núi phủ tuyết.
              </p>
            </header>

            <div className="world__grid">
              <figure className="world__map polaroid polaroid--tilt">
                <span className="tape tape--tl" aria-hidden="true" />
                <span className="tape tape--tr" aria-hidden="true" />
                <GameImage name="map" />
                <figcaption>Bản đồ hành trình trong game</figcaption>
              </figure>

              <div className="world__side">
                <ol className="world__steps">
                  {steps.map((s) => (
                    <li key={s.day} className="world__step">
                      <span className="world__day">{s.day}</span>
                      <p>{s.text}</p>
                    </li>
                  ))}
                </ol>

                <aside className="sticky-note">
                  <p className="sticky-note__title">📌 Đang phát triển</p>
                  <p>
                    Các thế giới theo từng cơ quan — phổi, tim, dạ dày, não, da… — với địa hình và kẻ địch riêng sẽ
                    được bổ sung dần trong những bản cập nhật sau.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="world__deco" aria-hidden="true">
        <Sticker kind="flower" size={54} style={{ top: "12%", left: "3%" }} />
        <Sticker kind="star" size={38} style={{ top: "30%", right: "4%" }} />
        <Sticker kind="heart" size={36} style={{ bottom: "18%", left: "6%" }} />
        <Sticker kind="sparkle" size={40} style={{ bottom: "8%", right: "8%" }} />
      </div>
    </section>
  );
}
