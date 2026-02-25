-- 1) Table + schema grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.inquiries TO anon, authenticated;

-- 2) Policy: allow anonymous/public inserts
DO $do$
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
END
$do$ LANGUAGE plpgsql;

-- 3) Policy: allow authenticated users full access
DO $do$
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
END
$do$ LANGUAGE plpgsql;

-- 4) Cleanup old policy if present
DO $do$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inquiries'
      AND policyname = 'Enable insert for public anonymous users'
  ) THEN
    EXECUTE 'DROP POLICY "Enable insert for public anonymous users" ON public.inquiries';
  END IF;
END
$do$ LANGUAGE plpgsql;

-- 5) Ensure RLS is enabled
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
