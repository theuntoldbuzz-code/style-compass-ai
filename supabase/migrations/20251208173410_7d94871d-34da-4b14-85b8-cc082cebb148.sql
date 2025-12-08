-- Create storage bucket for photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user photos
CREATE POLICY "Anyone can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-photos');

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-photos');

-- Table to store photo analysis results
CREATE TABLE public.photo_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id TEXT NOT NULL UNIQUE,
  photo_url TEXT NOT NULL,
  body_type TEXT,
  skin_tone TEXT,
  hair_color TEXT,
  measurements JSONB,
  recommended_colors JSONB,
  avoid_colors JSONB,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table to track affiliate redirects
CREATE TABLE public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for product catalog (seeded from CSV)
CREATE TABLE public.products_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  discounted_price NUMERIC,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  store TEXT,
  color TEXT,
  occasion JSONB,
  body_types JSONB,
  rating NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for these tables (edge functions use service role)
ALTER TABLE public.photo_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_catalog ENABLE ROW LEVEL SECURITY;

-- Public read access for products catalog
CREATE POLICY "Anyone can view products"
ON public.products_catalog FOR SELECT
USING (true);

-- Service role can manage all tables (edge functions)
CREATE POLICY "Service role can manage photo analyses"
ON public.photo_analyses FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage affiliate clicks"
ON public.affiliate_clicks FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can manage products"
ON public.products_catalog FOR ALL
USING (true)
WITH CHECK (true);