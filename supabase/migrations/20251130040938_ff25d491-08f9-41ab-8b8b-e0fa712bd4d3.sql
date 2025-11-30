-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create saved_items table (for individual products)
CREATE TABLE public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT,
  product_category TEXT,
  product_image_url TEXT,
  product_price DECIMAL(10,2),
  product_discounted_price DECIMAL(10,2),
  product_store TEXT,
  product_store_url TEXT,
  product_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable RLS on saved_items
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Saved items policies
CREATE POLICY "Users can view own saved items" ON public.saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items" ON public.saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items" ON public.saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create saved_outfits table
CREATE TABLE public.saved_outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  outfit_id TEXT NOT NULL,
  outfit_name TEXT NOT NULL,
  outfit_description TEXT,
  outfit_why_it_suits TEXT,
  outfit_color_palette JSONB,
  outfit_occasion JSONB,
  outfit_products JSONB NOT NULL,
  outfit_total_price DECIMAL(10,2),
  outfit_discounted_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, outfit_id)
);

-- Enable RLS on saved_outfits
ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;

-- Saved outfits policies
CREATE POLICY "Users can view own saved outfits" ON public.saved_outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved outfits" ON public.saved_outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved outfits" ON public.saved_outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();