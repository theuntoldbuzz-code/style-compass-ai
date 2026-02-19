
-- Create premium_users table
CREATE TABLE public.premium_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to check their own premium status
CREATE POLICY "Users can check their own premium status"
ON public.premium_users
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Insert the premium user
INSERT INTO public.premium_users (email) VALUES ('anishbis45@gmail.com');
