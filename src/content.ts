// All page copy and asset references live here so content can change without touching layout.

// Set to the real store / itch.io link once the game is published. null = "Sắp ra mắt".
export const PLAY_URL: string | null = "https://devunnull.itch.io/call-out-my-cell";

export const images = {
  gameplay: {
    src: "images/8_UI3J.webp",
    width: 1920,
    height: 1070,
    alt: "Màn chơi thủ thành: chiến trường sinh học màu hồng chia ô theo làn, thanh chọn tế bào ở dưới, bộ đếm máu 10/10 và chỉ báo Wave 0/17",
  },
  lifestyle: {
    src: "images/NZAtfi.webp",
    width: 1920,
    height: 1071,
    alt: "Cảnh lựa chọn lối sống: cô bé chibi trong phòng ngủ ấm cúng với ba lựa chọn buổi sáng và khung hội thoại màu kem",
  },
  map: {
    src: "images/8WZZH7.webp",
    width: 1920,
    height: 1014,
    alt: "Bản đồ hành trình dạng sổ tay minh họa với các chặng từ Ngày 1 đến Ngày 9 nối bằng đường nét đứt, cây cối, sông và núi",
  },
} as const;

export type ImageKey = keyof typeof images;

export const navLinks = [
  { href: "#trang-chu", label: "Trang chủ" },
  { href: "#gioi-thieu", label: "Giới thiệu" },
  { href: "#gameplay", label: "Gameplay" },
  { href: "#the-gioi", label: "Thế giới" },
  { href: "#thu-vien", label: "Thư viện" },
  { href: "#mua", label: "Mua game" },
];

// ---- Full version sales (backend: worker/) ----
// Worker URL; empty = sales closed ("Sắp mở bán"). Set in .env.development / .env.production.
export const SHOP_API: string = import.meta.env.VITE_SHOP_API ?? "";
export const PRICE_LABEL = "59.000đ";

// TODO: điền link fanpage Facebook khi có (dùng cho hỗ trợ + yêu cầu hoàn tiền). null = ẩn link, chỉ hiện chữ.
export const FACEBOOK_URL: string | null = null;

export const plans = {
  demo: {
    name: "Bản demo",
    price: "Miễn phí",
    perks: ["Chơi trên trình duyệt qua itch.io", "Trải nghiệm 1 ngày trong game", "Làm quen lối chơi trước khi mua"],
  },
  full: {
    name: "Bản đầy đủ",
    price: PRICE_LABEL,
    perks: [
      "Có sẵn 3 ngày chơi",
      "Liên tục cập nhật thêm ngày mới",
      "Chơi ngay trên trình duyệt, mua một lần",
      "Hoàn tiền nếu không phù hợp trong 2 giờ chơi đầu",
    ],
  },
};

export const aboutCards = [
  {
    icon: "shield",
    title: "Bảo vệ cơ thể",
    text: "Bạn là chỉ huy hệ miễn dịch. Virus, vi khuẩn kéo đến từng đợt — nhiệm vụ của bạn là giữ cho cơ thể bình yên.",
    color: "pink",
  },
  {
    icon: "strategy",
    title: "Xây dựng chiến thuật",
    text: "Mỗi tế bào có vai trò riêng. Chọn đúng đơn vị, đặt đúng làn và kết hợp đội hình để vượt qua thử thách.",
    color: "green",
  },
  {
    icon: "choice",
    title: "Mỗi lựa chọn đều quan trọng",
    text: "Ngủ sớm hay thức khuya? Những quyết định trước trận sẽ theo bạn vào chiến trường.",
    color: "blue",
  },
] as const;

export type Trend = "up" | "down";

// Website-only illustration: qualitative directions, no real in-game numbers.
export const lifestyleChoices: {
  id: string;
  label: string;
  line: string;
  effects: { stat: string; trend: Trend; good: boolean }[];
  note: string;
}[] = [
  {
    id: "exercise",
    label: "Bật dậy, vặn người tập vài động tác",
    line: "Ui, người nhẹ hẳn! Hôm nay chắc chắn sẽ ổn thôi.",
    effects: [
      { stat: "Năng lượng", trend: "up", good: true },
      { stat: "Miễn dịch", trend: "up", good: true },
    ],
    note: "Đội tế bào bước vào trận với tinh thần sung sức hơn.",
  },
  {
    id: "snooze",
    label: "Trùm chăn ngủ thêm “10 phút nữa thôi…”",
    line: "Ấm quá… nhưng hình như mình sắp trễ rồi thì phải?",
    effects: [
      { stat: "Hồi phục", trend: "up", good: true },
      { stat: "Năng lượng", trend: "down", good: false },
    ],
    note: "Được nghỉ thêm một chút, đổi lại phải chạy nước rút cả ngày.",
  },
  {
    id: "allnighter",
    label: "Cả đêm cày deadline, giờ không ngủ nổi nữa",
    line: "Mắt díp lại rồi… mà deadline vẫn chưa xong…",
    effects: [
      { stat: "Năng lượng", trend: "down", good: false },
      { stat: "Độc tố", trend: "up", good: false },
    ],
    note: "Cơ thể mệt mỏi, trận chiến sắp tới sẽ khó nhằn hơn nhiều.",
  },
];

export const lifestyleExamples = ["Ngủ đủ giấc", "Tập thể dục", "Thức khuya", "Thói quen ăn uống"];

export const gameplayPoints = [
  {
    title: "Đặt tế bào phòng thủ",
    text: "Chọn tế bào từ thanh triệu hồi và đặt lên các ô trong làn.",
  },
  {
    title: "Ngăn chặn các đợt mầm bệnh",
    text: "Mầm bệnh ùa tới theo từng wave — đừng để chúng lọt qua phòng tuyến.",
  },
  {
    title: "Kết hợp chiến thuật",
    text: "Phối hợp đơn vị tấn công và phòng thủ để khắc chế từng loại kẻ địch.",
  },
  {
    title: "Nâng cấp đội hình",
    text: "Mở khóa và nâng cấp tế bào để chuẩn bị cho những chặng khó hơn.",
  },
];

export type FeatureStatus = "live" | "dev" | "planned";

export const statusLabel: Record<FeatureStatus, string> = {
  live: "Có trong bản thử nghiệm",
  dev: "Đang phát triển",
  planned: "Dự kiến",
};

export const features: {
  title: string;
  text: string;
  status: FeatureStatus;
  icon: "swords" | "sun" | "cells" | "map" | "pill";
}[] = [
  {
    title: "Tower Defense chiến thuật",
    text: "Thủ thành theo làn quen thuộc, dễ làm quen nhưng đủ chiều sâu cho người thích tính toán. Mỗi trận ngắn gọn, vừa vặn cho giờ giải lao.",
    status: "live",
    icon: "swords",
  },
  {
    title: "Lựa chọn lối sống",
    text: "Trước mỗi trận là một ngày sinh hoạt. Thói quen ngủ, ăn, vận động ảnh hưởng trực tiếp tới thể trạng và sức chiến đấu.",
    status: "live",
    icon: "sun",
  },
  {
    title: "Đội quân tế bào",
    text: "Những tế bào miễn dịch được nhân hóa, mỗi bé một kỹ năng lấy cảm hứng từ chức năng sinh học thật. Sưu tầm và nâng cấp dần.",
    status: "dev",
    icon: "cells",
  },
  {
    title: "Chiến dịch khám phá cơ thể",
    text: "Phổi, tim, dạ dày, não, da… mỗi cơ quan là một thế giới riêng với địa hình và kẻ địch đặc trưng.",
    status: "planned",
    icon: "map",
  },
  {
    title: "Hệ thống thẻ thuốc",
    text: "Mang theo bộ thẻ thuốc để xoay chuyển trận đấu — nhưng lạm dụng sẽ kéo theo tác dụng phụ. Rủi ro và phần thưởng luôn đi cùng nhau.",
    status: "planned",
    icon: "pill",
  },
];

export const gallery: { key: ImageKey; caption: string }[] = [
  { key: "lifestyle", caption: "Một buổi sáng, ba lựa chọn — bạn sẽ bắt đầu ngày mới thế nào?" },
  { key: "map", caption: "Cuốn sổ hành trình: mỗi ngày là một chặng phiêu lưu mới." },
  { key: "gameplay", caption: "Chiến trường bên trong cơ thể, nơi đội quân tế bào trấn giữ." },
];
