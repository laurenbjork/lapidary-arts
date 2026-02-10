-- Add availability_status to products table
-- Valid values: 'available', 'special_order', 'out_of_stock'
-- We default to 'available' for now, or we can infer from existing in_store if needed.
-- But the user wants a toggle, so we'll just add the column.

ALTER TABLE products ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';

-- Optional: Update existing rows based on in_store if you wanted to migrate data, 
-- but since we are just adding the feature, default 'available' is fine.
-- If in_store was false, maybe it should be 'special_order'?
-- Let's do a smart update:
UPDATE products SET availability_status = 'available' WHERE in_store = true;
UPDATE products SET availability_status = 'special_order' WHERE in_store = false;
