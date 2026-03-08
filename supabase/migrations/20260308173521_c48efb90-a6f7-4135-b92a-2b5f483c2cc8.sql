
-- Drop the broken policy that references auth.users
DROP POLICY IF EXISTS "Users can check their own premium status" ON public.premium_users;

-- Create a fixed policy using auth.jwt() instead of querying auth.users
CREATE POLICY "Users can check their own premium status"
  ON public.premium_users
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email')::text);
