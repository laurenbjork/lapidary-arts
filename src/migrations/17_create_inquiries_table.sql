
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    type VARCHAR(100) NOT NULL, -- 'appointment', 'contact', 'newsletter'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'archived'
    notes TEXT,
    image_url TEXT,
    preferred_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON inquiries
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for anyone"
ON inquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON inquiries
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON inquiries
FOR DELETE
TO authenticated
USING (true);
