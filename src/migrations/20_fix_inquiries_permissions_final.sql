-- Final, corrected script for a UUID primary key.
-- Based on the user's debug assistant analysis.

-- 1) Table + schema grants
GRANT SELECT, INSERT ON public.inquiries TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 2) Policy: allow anonymous/public inserts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inquiries'
      AND policyname = 'Allow public insert inquiries'
  ) THEN
    EXECUTE 'DROP POLICY "Allow public insert inquiries" ON public.inquiries';
  END IF;

  EXECUTE $pol$
    CREATE POLICY "Allow public insert inquiries" ON public.inquiries
      FOR INSERT TO anon
      WITH CHECK (true);
  $pol$;
END $$;

-- 3) Policy: allow authenticated users full access
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inquiries'
      AND policyname = 'Allow auth all inquiries'
  ) THEN
    EXECUTE 'DROP POLICY "Allow auth all inquiries" ON public.inquiries';
  END IF;

  EXECUTE $pol$
    CREATE POLICY "Allow auth all inquiries" ON public.inquiries
      FOR ALL TO authenticated
      USING (true)
      WITH CHECK (true);
  $pol$;
END $$;

-- 4) Cleanup old policy if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inquiries'
      AND policyname = 'Enable insert for public anonymous users'
  ) THEN
    EXECUTE 'DROP POLICY "Enable insert for public anonymous users" ON public.inquiries';
  END IF;
END $$;

-- 5) Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
