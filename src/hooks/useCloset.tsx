import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Product, OutfitRecommendation } from '@/types/outfit';
import { toast } from './use-toast';
import { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';

export interface SavedItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_brand: string | null;
  product_category: string | null;
  product_image_url: string | null;
  product_price: number | null;
  product_discounted_price: number | null;
  product_store: string | null;
  product_store_url: string | null;
  product_color: string | null;
  created_at: string;
}

export interface SavedOutfit {
  id: string;
  user_id: string;
  outfit_id: string;
  outfit_name: string;
  outfit_description: string | null;
  outfit_why_it_suits: string | null;
  outfit_color_palette: string[] | null;
  outfit_occasion: string[] | null;
  outfit_products: Product[];
  outfit_total_price: number | null;
  outfit_discounted_price: number | null;
  created_at: string;
}

export const useCloset = () => {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedItems = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('saved_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved items:', error);
    } else {
      setSavedItems(data || []);
    }
  };

  const fetchSavedOutfits = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('saved_outfits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved outfits:', error);
    } else {
      setSavedOutfits((data || []).map(outfit => ({
        ...outfit,
        outfit_color_palette: outfit.outfit_color_palette as string[] | null,
        outfit_occasion: outfit.outfit_occasion as string[] | null,
        outfit_products: outfit.outfit_products as unknown as Product[],
      })));
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchSavedItems(), fetchSavedOutfits()]).finally(() => {
        setLoading(false);
      });
    } else {
      setSavedItems([]);
      setSavedOutfits([]);
      setLoading(false);
    }
  }, [user]);

  const saveItem = async (product: Product) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save items to your closet',
        variant: 'destructive',
      });
      return false;
    }

    const { error } = await supabase.from('saved_items').insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      product_brand: product.brand,
      product_category: product.category,
      product_image_url: product.imageUrl,
      product_price: product.originalPrice,
      product_discounted_price: product.discountedPrice,
      product_store: product.store,
      product_store_url: product.storeUrl,
      product_color: product.color,
    });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already saved',
          description: 'This item is already in your closet',
        });
      } else {
        console.error('Error saving item:', error);
        toast({
          title: 'Error',
          description: 'Failed to save item',
          variant: 'destructive',
        });
      }
      return false;
    }

    toast({
      title: '❤️ Saved!',
      description: 'Item added to your closet',
      action: (
        <Button variant="outline" size="sm" onClick={() => removeItem(product.id)}>
          Undo
        </Button>
      ),
    });
    await fetchSavedItems();
    return true;
  };

  const removeItem = async (productId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Removed',
      description: 'Item removed from your closet',
    });
    await fetchSavedItems();
    return true;
  };

  const saveOutfit = async (outfit: OutfitRecommendation) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save outfits to your closet',
        variant: 'destructive',
      });
      return false;
    }

    const { error } = await supabase.from('saved_outfits').insert([{
      user_id: user.id,
      outfit_id: outfit.id,
      outfit_name: outfit.name,
      outfit_description: outfit.description,
      outfit_why_it_suits: outfit.whyItSuits,
      outfit_color_palette: outfit.colorPalette as Json,
      outfit_occasion: outfit.occasion as Json,
      outfit_products: outfit.products as unknown as Json,
      outfit_total_price: outfit.totalOriginalPrice,
      outfit_discounted_price: outfit.totalDiscountedPrice,
    }]);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already saved',
          description: 'This outfit is already in your closet',
        });
      } else {
        console.error('Error saving outfit:', error);
        toast({
          title: 'Error',
          description: 'Failed to save outfit',
          variant: 'destructive',
        });
      }
      return false;
    }

    toast({
      title: '❤️ Saved!',
      description: 'Outfit added to your closet',
      action: (
        <Button variant="outline" size="sm" onClick={() => removeOutfit(outfit.id)}>
          Undo
        </Button>
      ),
    });
    await fetchSavedOutfits();
    return true;
  };

  const removeOutfit = async (outfitId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('saved_outfits')
      .delete()
      .eq('outfit_id', outfitId);

    if (error) {
      console.error('Error removing outfit:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove outfit',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Removed',
      description: 'Outfit removed from your closet',
    });
    await fetchSavedOutfits();
    return true;
  };

  const isItemSaved = (productId: string) => {
    return savedItems.some(item => item.product_id === productId);
  };

  const isOutfitSaved = (outfitId: string) => {
    return savedOutfits.some(outfit => outfit.outfit_id === outfitId);
  };

  return {
    savedItems,
    savedOutfits,
    loading,
    saveItem,
    removeItem,
    saveOutfit,
    removeOutfit,
    isItemSaved,
    isOutfitSaved,
    refreshCloset: () => Promise.all([fetchSavedItems(), fetchSavedOutfits()]),
  };
};