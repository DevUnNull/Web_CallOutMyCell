import { Swords, Sun, Users, Map, Pill } from "lucide-react";
import { features, statusLabel } from "../content";

const icons = { swords: Swords, sun: Sun, cells: Users, map: Map, pill: Pill };

export default function FeaturesSection() {
  return (
    <section id="tinh-nang" className="section features">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Tính năng nổi bật</p>
          <h2>Điều gì khiến Call Out My Cells đặc biệt?</h2>
        </header>

        <ul className="bento">
          {features.map((f, i) => {
            const Icon = icons[f.icon];
            return (
              <li key={f.title} className={`bento__cell bento__cell--${i + 1}`} data-reveal>
                <div className={`bento__card bento__card--${i + 1}`}>
                  <div className="bento__top">
                    <span className="bento__icon" aria-hidden="true">
                      <Icon size={28} strokeWidth={2.5} />
                    </span>
                    <span className={`badge badge--${f.status}`}>{statusLabel[f.status]}</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
