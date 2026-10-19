import { navLinks } from "../content";
import Sticker from "./Sticker";

export default function Footer() {
  return (
    <footer className="footer">
      <svg className="wave wave--top" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0V0H0z" fill="var(--paper)" />
      </svg>
      <div className="container footer__grid">
        <div className="footer__brand">
          <p className="footer__title">
            <Sticker kind="cell" size={40} float={false} /> Call Out My Cells
          </p>
          <p>
            Game thủ thành theo làn kết hợp mô phỏng lối sống, nơi đội quân tế bào miễn dịch nhỏ bé bảo vệ cơ thể
            khỏi mầm bệnh.
          </p>
        </div>

        <nav aria-label="Liên kết chân trang">
          <p className="footer__heading">Khám phá</p>
          <ul className="footer__links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#choi-ngay">Chơi ngay</a>
            </li>
          </ul>
        </nav>

        <div>
          <p className="footer__heading">Đội ngũ</p>
          <p>Phát triển bởi Nhóm 4 — dự án EXE.</p>
          {/* TODO: thêm link mạng xã hội chính thức (TikTok, Facebook, Discord…) khi có */}
          <p className="footer__muted">Kênh cộng đồng chính thức sẽ được cập nhật sớm.</p>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Call Out My Cells. Mọi quyền được bảo lưu.</p>
    </footer>
  );
}
