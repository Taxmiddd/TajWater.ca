ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_cycle TEXT NOT NULL DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS charge_start_date DATE,
  ADD COLUMN IF NOT EXISTS plan_link_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS plan_link_status TEXT NOT NULL DEFAULT 'pending_card';
