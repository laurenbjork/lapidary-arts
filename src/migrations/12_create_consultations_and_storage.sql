-- 1. Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  preferred_time TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'new'
);

-- 2. Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Allow public insert
DROP POLICY IF EXISTS "Allow public insert consultations" ON consultations;
CREATE POLICY "Allow public insert consultations" ON consultations FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) all access
DROP POLICY IF EXISTS "Allow auth all consultations" ON consultations;
CREATE POLICY "Allow auth all consultations" ON consultations FOR ALL USING (auth.role() = 'authenticated');

-- 4. Storage Policies for 'product-images' bucket
-- Note: Supabase storage policies are on storage.objects

-- Allow public to upload images (INSERT) to product-images bucket
-- This is required for the consultation image upload feature
DROP POLICY IF EXISTS "Allow public uploads product-images" ON storage.objects;
CREATE POLICY "Allow public uploads product-images" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow public to view images (SELECT)
DROP POLICY IF EXISTS "Allow public view product-images" ON storage.objects;
CREATE POLICY "Allow public view product-images" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- 5. Notify to reload schema
NOTIFY pgrst, 'reload schema';
