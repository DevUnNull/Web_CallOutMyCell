import { Gamepad2, Clock } from "lucide-react";
import { PLAY_URL, PRICE_LABEL } from "../content";
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
            {PLAY_URL
              ? "Đội quân tế bào đang chờ người chỉ huy! Chơi thử bản demo miễn phí trên itch.io, thấy hợp thì mở khóa bản đầy đủ để chiến đấu nhiều ngày hơn."
              : "Đội quân tế bào đang chờ người chỉ huy! Call Out My Cells đang được phát triển cho di động (Android & iOS). Hãy theo dõi để là một trong những người đầu tiên bước vào trận chiến."}
          </p>

          <div className="cta__actions">
            {PLAY_URL ? (
              <a href={PLAY_URL} className="btn btn--pink btn--lg" target="_blank" rel="noopener noreferrer">
                <Gamepad2 size={22} aria-hidden="true" /> Chơi demo miễn phí
              </a>
            ) : (
              <span className="btn btn--pink btn--lg is-soon" role="status">
                <Clock size={22} aria-hidden="true" /> Sắp ra mắt
              </span>
            )}
            <a href="#mua" className="btn btn--cream">
              Mua bản đầy đủ · {PRICE_LABEL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
