-- This script grants the required permissions for public (anonymous) users to submit forms to the 'inquiries' table.
-- It is idempotent and safe to run multiple times.

-- 1. Grant the fundamental INSERT privilege to the public 'anon' role.
-- This allows the 'anon' role to attempt to insert rows.
GRANT INSERT ON TABLE public.inquiries TO anon;

-- 2. Grant the USAGE privilege on the public schema to the 'anon' role.
-- This is a general best practice and ensures the 'anon' role can see objects within the schema.
GRANT USAGE ON SCHEMA public TO anon;

-- 3. Create or replace the Row Level Security (RLS) policy.
-- This policy defines the rule that allows the INSERT operation to succeed.
-- It safely drops the policy if it already exists to prevent errors on re-running.
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

  EXECUTE $pol$
    CREATE POLICY "Enable insert for public anonymous users"
    ON public.inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);
  $pol$;
END $$;

-- 4. Ensure Row Level Security is enabled on the table.
-- This is a safe check to make sure the policies are actually being enforced.
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
