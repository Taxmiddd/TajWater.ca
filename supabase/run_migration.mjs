// Run this once to create the wallet_transactions table via Supabase REST API
// Usage: node supabase/run_migration.mjs

const SUPABASE_URL = 'https://mdsidfkfsddagsvkecba.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_ybuqkYRxNFaMnwnU-SugEA_NOQT2K65'

const sql = `
-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transaction_type TEXT NOT NULL,
    reason TEXT,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_by TEXT DEFAULT 'System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
DROP POLICY IF EXISTS "Users can view their own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view their own wallet transactions"
    ON public.wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins have full access
DROP POLICY IF EXISTS "Admins can manage all wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Admins can manage all wallet transactions"
    ON public.wallet_transactions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Service role bypass (for server-side inserts)
DROP POLICY IF EXISTS "Service role bypass" ON public.wallet_transactions;
CREATE POLICY "Service role bypass"
    ON public.wallet_transactions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Upsert wallet settings in site_content
INSERT INTO public.site_content (key, value)
VALUES 
    ('wallet_min_topup', '20'),
    ('wallet_presets', '50,100,150,200')
ON CONFLICT (key) DO NOTHING;
`

const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  },
  body: JSON.stringify({ sql }),
})

if (response.ok) {
  console.log('✅ Migration applied successfully!')
} else {
  // Try alternative approach via pg
  console.log('exec_sql not available, trying via pg_query...')
  const r2 = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  })
  
  const text2 = await r2.text()
  console.log(r2.status, text2)
}
