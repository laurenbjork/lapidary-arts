-- 1. Create customers table if missing (Fixes 'Could not find table public.customers')
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  description TEXT
);

-- 2. Enable RLS on customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 3. Customers Policies
-- Allow public to INSERT (Important if we add public signup later, harmless now)
DROP POLICY IF EXISTS "Allow public insert customers" ON customers;
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT WITH CHECK (true);

-- Allow admin to SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "Allow auth all customers" ON customers;
CREATE POLICY "Allow auth all customers" ON customers FOR ALL USING (auth.role() = 'authenticated');


-- 4. Fix Appointments Table (Fixes 'new row violates row-level security policy')
-- Ensure table exists
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

-- 5. Appointments Policies (The Core Fix)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT appointments (CRITICAL FOR BOOKING)
-- This allows unauthenticated users (guests) to book appointments
DROP POLICY IF EXISTS "Allow public insert appointments" ON appointments;
CREATE POLICY "Allow public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Allow admin to view/manage appointments
DROP POLICY IF EXISTS "Allow auth all appointments" ON appointments;
CREATE POLICY "Allow auth all appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');

-- 6. Reload Schema to ensure API picks up changes immediately
NOTIFY pgrst, 'reload schema';
