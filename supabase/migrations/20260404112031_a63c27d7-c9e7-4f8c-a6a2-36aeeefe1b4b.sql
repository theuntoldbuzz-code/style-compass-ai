BEGIN;

ALTER TABLE public.premium_users
ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.premium_users pu
SET user_id = au.id
FROM auth.users au
WHERE pu.user_id IS NULL
  AND au.email IS NOT NULL
  AND lower(pu.email) = lower(au.email);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.premium_users
    WHERE user_id IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot secure premium_users: some rows could not be matched to a user account';
  END IF;
END $$;

ALTER TABLE public.premium_users
ALTER COLUMN user_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS premium_users_user_id_key
ON public.premium_users (user_id);

DROP POLICY IF EXISTS "Users can check their own premium status" ON public.premium_users;
CREATE POLICY "Users can check their own premium status"
ON public.premium_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

ALTER TABLE public.photo_analyses
ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
CREATE POLICY "Users can update own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'user-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

COMMIT;