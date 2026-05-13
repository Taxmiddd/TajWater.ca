-- Add taxable flag to products table
-- Default TRUE so existing products are taxable (no behaviour change)
ALTER TABLE products ADD COLUMN IF NOT EXISTS taxable BOOLEAN NOT NULL DEFAULT TRUE;
