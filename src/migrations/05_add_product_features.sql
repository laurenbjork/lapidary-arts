-- Add columns for new product features
ALTER TABLE products ADD COLUMN IF NOT EXISTS hide_price BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '[]'::jsonb;
