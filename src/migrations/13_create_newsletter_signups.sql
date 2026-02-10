-- 1. Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'US'
);

-- 2. Enable RLS
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Allow public insert (guests can sign up)
DROP POLICY IF EXISTS "Allow public insert newsletter" ON newsletter_signups;
CREATE POLICY "Allow public insert newsletter" ON newsletter_signups FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) all access
DROP POLICY IF EXISTS "Allow auth all newsletter" ON newsletter_signups;
CREATE POLICY "Allow auth all newsletter" ON newsletter_signups FOR ALL USING (auth.role() = 'authenticated');

-- 4. Reload schema
NOTIFY pgrst, 'reload schema';
