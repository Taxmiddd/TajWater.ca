-- 1. Add proof_url to wallet_transactions for delivery pictures
ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS proof_url text;

-- 2. CRM Customer Notes already exists as customer_notes in profiles
-- 3. Create delivery-proofs storage bucket (if you prefer SQL, otherwise create via Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('delivery-proofs', 'delivery-proofs', true) ON CONFLICT DO NOTHING;
-- (Note: It is usually easier to create the bucket manually in the Supabase Dashboard -> Storage -> New Bucket "delivery-proofs" and set it to Public)

-- 4. Create leads table for CRM
CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  contact_info text,
  notes text,
  status text DEFAULT 'new',
  created_by text,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  amount numeric NOT NULL,
  category text NOT NULL,
  description text,
  logged_by text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email text NOT NULL,
  amount numeric NOT NULL,
  description text,
  status text DEFAULT 'unpaid',
  created_at timestamp with time zone DEFAULT now()
);

-- 7. Add Telegram self-registration columns to profiles
-- telegram_chat_id: the user's Telegram numeric chat ID (auto-set on /register)
-- telegram_role: 'driver' or 'admin' — set 'admin' manually in Supabase Dashboard for admins
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_chat_id bigint UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_role text CHECK (telegram_role IN ('driver', 'admin'));

