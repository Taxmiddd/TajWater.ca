-- SQL command to add unit_label column to products table in Supabase

ALTER TABLE products
ADD COLUMN IF NOT EXISTS unit_label TEXT DEFAULT 'unit';

-- Update existing records to have 'unit' as label
UPDATE products SET unit_label = 'unit' WHERE unit_label IS NULL;
