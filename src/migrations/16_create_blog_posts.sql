-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  image TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  slug TEXT UNIQUE
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies (public read, authenticated full access)
CREATE POLICY "Public can view visible blog posts" 
ON blog_posts FOR SELECT 
USING (is_visible = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog posts" 
ON blog_posts FOR ALL 
USING (auth.role() = 'authenticated');
