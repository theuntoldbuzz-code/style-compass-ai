-- Add user_id column to photo_analyses table
ALTER TABLE public.photo_analyses 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role can manage photo analyses" ON public.photo_analyses;

-- Create proper RLS policies for photo_analyses
CREATE POLICY "Users can view own photo analyses"
ON public.photo_analyses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photo analyses"
ON public.photo_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photo analyses"
ON public.photo_analyses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photo analyses"
ON public.photo_analyses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Service role policy for edge functions
CREATE POLICY "Service role can manage photo analyses"
ON public.photo_analyses
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);