
-- Fix saved_items: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view own saved items" ON public.saved_items;
DROP POLICY IF EXISTS "Users can insert own saved items" ON public.saved_items;
DROP POLICY IF EXISTS "Users can delete own saved items" ON public.saved_items;

CREATE POLICY "Users can view own saved items" ON public.saved_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items" ON public.saved_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items" ON public.saved_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix saved_outfits: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view own saved outfits" ON public.saved_outfits;
DROP POLICY IF EXISTS "Users can insert own saved outfits" ON public.saved_outfits;
DROP POLICY IF EXISTS "Users can delete own saved outfits" ON public.saved_outfits;

CREATE POLICY "Users can view own saved outfits" ON public.saved_outfits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved outfits" ON public.saved_outfits
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved outfits" ON public.saved_outfits
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
