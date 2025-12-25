-- Fix 1: Make user-photos bucket private and update storage policies
UPDATE storage.buckets SET public = false WHERE id = 'user-photos';

-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;

-- Create secure user-scoped storage policies
CREATE POLICY "Authenticated users can upload own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service role can manage all photos"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'user-photos')
WITH CHECK (bucket_id = 'user-photos');

-- Fix 2: Update handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  clean_full_name TEXT;
  clean_avatar_url TEXT;
BEGIN
  -- Validate and sanitize full_name (limit length, trim whitespace)
  clean_full_name := TRIM(new.raw_user_meta_data ->> 'full_name');
  IF clean_full_name IS NOT NULL AND LENGTH(clean_full_name) > 100 THEN
    clean_full_name := SUBSTRING(clean_full_name, 1, 100);
  END IF;
  
  -- Validate avatar_url - only accept HTTPS URLs from trusted sources
  clean_avatar_url := new.raw_user_meta_data ->> 'avatar_url';
  IF clean_avatar_url IS NOT NULL THEN
    -- Only accept https URLs
    IF NOT (clean_avatar_url ~ '^https://') THEN
      clean_avatar_url := NULL;
    END IF;
    -- Block localhost, private IPs, and cloud metadata endpoints
    IF clean_avatar_url ~ 'localhost|127\.0\.0\.1|169\.254\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|0\.0\.0\.0' THEN
      clean_avatar_url := NULL;
    END IF;
    -- Limit URL length
    IF LENGTH(clean_avatar_url) > 500 THEN
      clean_avatar_url := NULL;
    END IF;
  END IF;
  
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, clean_full_name, clean_avatar_url);
  RETURN new;
END;
$$;