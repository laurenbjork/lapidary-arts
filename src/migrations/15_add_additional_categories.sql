-- Add additional_categories column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS additional_categories JSONB DEFAULT '[]'::jsonb;
