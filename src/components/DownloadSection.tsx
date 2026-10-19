import { Gamepad2, Clock } from "lucide-react";
import { PLAY_URL } from "../content";
import Sticker from "./Sticker";

export default function DownloadSection() {
  return (
    <section id="choi-ngay" className="section cta">
      <div className="container">
        <div className="cta__card" data-reveal>
          <Sticker kind="cell" size={72} className="cta__s1" />
          <Sticker kind="virus" size={60} className="cta__s2" />
          <Sticker kind="star" size={42} className="cta__s3" />
          <Sticker kind="heart" size={38} className="cta__s4" />

          <h2>Bạn đã sẵn sàng bảo vệ cơ thể chưa?</h2>
          <p>
            Đội quân tế bào đang chờ người chỉ huy! Call Out My Cells đang được phát triển cho di động (Android &amp;
            iOS). Hãy theo dõi để là một trong những người đầu tiên bước vào trận chiến.
          </p>

          <div className="cta__actions">
            {PLAY_URL ? (
              <a href={PLAY_URL} className="btn btn--pink btn--lg" target="_blank" rel="noopener noreferrer">
                <Gamepad2 size={22} aria-hidden="true" /> Chơi ngay
              </a>
            ) : (
              <span className="btn btn--pink btn--lg is-soon" role="status">
                <Clock size={22} aria-hidden="true" /> Sắp ra mắt
              </span>
            )}
            <a href="#gameplay" className="btn btn--cream">
              Xem lại gameplay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
