CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  position SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
