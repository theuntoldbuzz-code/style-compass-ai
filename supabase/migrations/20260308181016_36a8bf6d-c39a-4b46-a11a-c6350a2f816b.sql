
-- Fix CRITICAL: products_catalog "Service role can manage products" policy is on public role
-- Drop the misconfigured policy and recreate for service_role only
DROP POLICY IF EXISTS "Service role can manage products" ON public.products_catalog;
CREATE POLICY "Service role can manage products"
  ON public.products_catalog
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix CRITICAL: affiliate_clicks "Service role can manage affiliate clicks" policy is on public role
DROP POLICY IF EXISTS "Service role can manage affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Service role can manage affiliate clicks"
  ON public.affiliate_clicks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert affiliate clicks (needed for tracking)
CREATE POLICY "Authenticated users can insert affiliate clicks"
  ON public.affiliate_clicks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add index for performance on high-traffic queries
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_outfits_user_id ON public.saved_outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_generations_user_id ON public.outfit_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_users_email ON public.premium_users(email);
CREATE INDEX IF NOT EXISTS idx_products_catalog_occasion ON public.products_catalog USING gin(occasion);
CREATE INDEX IF NOT EXISTS idx_products_catalog_category ON public.products_catalog(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON public.affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_photo_analyses_user_id ON public.photo_analyses(user_id);
