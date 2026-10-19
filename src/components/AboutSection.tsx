import { Shield, LayoutGrid, Split } from "lucide-react";
import { aboutCards } from "../content";
import Sticker, { type StickerKind } from "./Sticker";

const icons = { shield: Shield, strategy: LayoutGrid, choice: Split };
const buddies: StickerKind[] = ["cell", "virus", "heart"];

export default function AboutSection() {
  return (
    <section id="gioi-thieu" className="section about">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Giới thiệu</p>
          <h2>Một thế giới tí hon bên trong cơ thể!</h2>
          <p className="section-head__lead">
            Mỗi ngày, hàng tỉ tế bào âm thầm canh gác cho bạn. Trong <b>Call Out My Cells</b>, bạn trở thành người
            chỉ huy của đội quân bé xíu ấy — sắp xếp đội hình, chặn đứng mầm bệnh và giữ cho cơ thể luôn khỏe mạnh.
          </p>
        </header>

        <ol className="about__cards">
          {aboutCards.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <li key={c.title} data-reveal>
                <div className={`about-card about-card--${c.color}`}>
                  <span className="about-card__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="about-card__icon" aria-hidden="true">
                    <Icon size={30} strokeWidth={2.5} />
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <Sticker kind={buddies[i]} size={52} className="about-card__buddy" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
