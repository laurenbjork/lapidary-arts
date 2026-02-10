-- Add secondary_description to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS secondary_description TEXT;
