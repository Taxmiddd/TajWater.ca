CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(10, 2) NOT NULL,
    transaction_type TEXT NOT NULL,
    reason TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_by TEXT DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallet transactions"
    ON public.wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallet transactions"
    ON public.wallet_transactions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Seed site content
INSERT INTO public.site_content (key, value)
VALUES 
    ('wallet_min_topup', '20'),
    ('wallet_presets', '50,100,150,200')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;
