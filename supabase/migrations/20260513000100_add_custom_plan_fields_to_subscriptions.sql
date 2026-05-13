-- Add custom plan fields to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS custom_plan BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS custom_delivery_address TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS admin_notes TEXT;
