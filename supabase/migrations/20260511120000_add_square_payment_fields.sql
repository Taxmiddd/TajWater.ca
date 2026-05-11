-- Add Square customer/card fields needed for recurring subscription billing
alter table public.profiles
  add column if not exists square_customer_id text,
  add column if not exists square_card_id text,
  add column if not exists square_card_brand text,
  add column if not exists square_card_last4 text,
  add column if not exists square_card_exp_month int,
  add column if not exists square_card_exp_year int;

alter table public.subscriptions
  add column if not exists square_customer_id text,
  add column if not exists square_card_id text,
  add column if not exists payment_card_brand text,
  add column if not exists payment_card_last4 text,
  add column if not exists last_billed_at timestamptz,
  add column if not exists next_payment_at timestamptz;
