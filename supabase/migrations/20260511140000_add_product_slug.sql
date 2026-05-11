-- Add a human-friendly slug column for products so shop URLs can use names instead of raw IDs
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.products
SET slug = lower(trim(both '-' FROM regexp_replace(name, '[^a-z0-9]+', '-', 'g')))
WHERE slug IS NULL OR slug = '';

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
