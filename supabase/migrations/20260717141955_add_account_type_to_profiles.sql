ALTER TABLE public.profiles ADD COLUMN account_type TEXT DEFAULT 'customer' CHECK (account_type IN ('customer', 'business'));
