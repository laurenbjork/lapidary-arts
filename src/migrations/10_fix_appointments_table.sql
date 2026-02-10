-- Ensure appointments table exists with correct schema
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  stock_number TEXT,
  preferred_time TEXT,
  status TEXT DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Re-apply policies to be safe (drop first to avoid errors if they exist)
DROP POLICY IF EXISTS "Allow public insert appointments" ON appointments;
CREATE POLICY "Allow public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow auth view appointments" ON appointments;
CREATE POLICY "Allow auth view appointments" ON appointments FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow auth update appointments" ON appointments;
CREATE POLICY "Allow auth update appointments" ON appointments FOR UPDATE USING (auth.role() = 'authenticated');

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
