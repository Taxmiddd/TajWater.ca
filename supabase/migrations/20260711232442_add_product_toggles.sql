-- Migration: Add wallet_eligible and call_for_price toggles to products
-- Run this in the Supabase SQL Editor

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS wallet_eligible BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS call_for_price BOOLEAN DEFAULT false;

-- To verify:
-- SELECT id, name, wallet_eligible, call_for_price FROM products LIMIT 5;
