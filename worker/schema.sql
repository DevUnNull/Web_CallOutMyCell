CREATE TABLE IF NOT EXISTS orders (
  order_code INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL, -- pending | paid | expired | refunded
  token TEXT UNIQUE, -- access token, set once paid
  created_at INTEGER NOT NULL,
  paid_at INTEGER
);
CREATE INDEX IF NOT EXISTS orders_token ON orders (token);
