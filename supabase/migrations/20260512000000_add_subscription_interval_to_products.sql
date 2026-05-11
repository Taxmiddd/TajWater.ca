-- Add subscription_interval column to products table
-- This stores the fixed delivery interval for subscription-type products
-- and is set by the admin at product creation time.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subscription_interval TEXT
  CHECK (subscription_interval IN ('daily', 'weekly', 'biweekly', 'monthly'));

COMMENT ON COLUMN public.products.subscription_interval IS
  'For subscription products only: the fixed delivery interval set by admin.';
