-- Add in_store, stock_number, and gallery to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_store BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_number TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES products(id),
  product_name TEXT, -- Store name in case product is deleted
  stock_number TEXT,
  preferred_time TEXT, -- 'morning', 'afternoon', 'evening'
  status TEXT DEFAULT 'new' -- 'new', 'contacted', 'closed'
);

-- Enable RLS for appointments (optional but good practice)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public to insert appointments (for the booking form)
CREATE POLICY "Allow public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) to view/update appointments
CREATE POLICY "Allow auth view appointments" ON appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update appointments" ON appointments FOR UPDATE USING (auth.role() = 'authenticated');
