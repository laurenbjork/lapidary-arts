-- Add styling options for blog post titles and subtitles
ALTER TABLE blog_posts
ADD COLUMN title_font_family TEXT,
ADD COLUMN title_font_size TEXT,
ADD COLUMN title_color TEXT,
ADD COLUMN subtitle_font_family TEXT,
ADD COLUMN subtitle_font_size TEXT,
ADD COLUMN subtitle_color TEXT;