-- Drop the old, incorrect policy
DROP POLICY "Enable insert for anyone" ON inquiries;

-- Create a new policy that correctly enables insert for the public 'anon' role
CREATE POLICY "Enable insert for public anonymous users" 
ON inquiries 
FOR INSERT 
TO anon 
WITH CHECK (true);
