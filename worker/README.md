# Shop Worker — bán bản đầy đủ Call Out My Cells

Backend nhỏ trên Cloudflare Workers: tạo đơn PayOS (VietQR), xác nhận thanh toán, cấp mã truy cập và phát file game bản đầy đủ từ R2.
Toàn bộ code nằm trong `src/index.ts`.

## Cài đặt lần đầu (chỉ làm 1 lần)

```bash
cd worker
npm install
npx wrangler login                              # mở trình duyệt, bấm Allow
npx wrangler d1 create callout-orders           # copy database_id in ra -> dán vào wrangler.toml
npx wrangler d1 execute callout-orders --remote --file schema.sql
npx wrangler r2 bucket create callout-game
npx wrangler secret bulk .dev.vars              # đẩy 3 key PayOS lên (file .dev.vars KHÔNG commit)
npx wrangler deploy                             # in ra URL dạng https://callout-shop.<ten>.workers.dev
```

Sau khi deploy: dán URL Worker vào `VITE_SHOP_API` trong `../.env.production`, commit + push để web bật nút mua.

## Cập nhật bản game

Thay thư mục `game/` bằng thư mục build Unity WebGL (có `index.html` + `Build/`), rồi:

```bash
node scripts/upload-game.mjs game --remote
```

Người đã mua tự được chơi bản mới, không cần làm gì thêm.
Lưu ý Unity: nếu build nén Brotli/Gzip, Worker tự gửi đúng header — không cần bật "Decompression Fallback".

## Hoàn tiền (thu hồi quyền chơi)

Sau khi đã chuyển trả tiền cho người mua (thủ công qua app ngân hàng):

```bash
npx wrangler d1 execute callout-orders --remote --command "UPDATE orders SET status='refunded' WHERE order_code=<MÃ_ĐƠN>"
```

Xem các đơn gần nhất:

```bash
npx wrangler d1 execute callout-orders --remote --command "SELECT order_code, email, status, datetime(created_at/1000,'unixepoch','+7 hours') AS tao_luc FROM orders ORDER BY created_at DESC LIMIT 20"
```

## Chạy thử ở máy (không mất tiền thật)

```bash
npx wrangler d1 execute callout-orders --local --file schema.sql
node scripts/upload-game.mjs game --local
npx wrangler dev --var MOCK_PAYMENTS:1 --var SITE_URL:http://localhost:5173/ --var SITE_ORIGIN:http://localhost:5173
```

Rồi chạy `npm run dev` ở thư mục gốc. `MOCK_PAYMENTS:1` coi mọi đơn là đã trả tiền — **chỉ dùng ở máy, không bao giờ đặt trên production**.

## Đổi giá

Sửa `PRICE` trong `wrangler.toml` (số tiền thật thu) **và** `PRICE_LABEL` trong `../src/content.ts` (chữ hiển thị), rồi `npx wrangler deploy` + push web.
