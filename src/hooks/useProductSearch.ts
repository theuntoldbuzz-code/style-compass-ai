import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OutfitRecommendation } from "@/types/outfit";
import { StyleReport } from "@/types/styleReport";
import { toast } from "@/hooks/use-toast";

export const useProductSearch = () => {
  const [outfits, setOutfits] = useState<OutfitRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchProducts = async (
    report: StyleReport,
    budgetMin: number,
    budgetMax: number,
    gender: string,
    occasion: string,
    season: string,
  ): Promise<OutfitRecommendation[]> => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const { data, error } = await supabase.functions.invoke("search-products", {
        body: {
          signatureLooks: report.signatureLooks,
          budgetMin,
          budgetMax,
          gender,
          occasion,
          season,
        },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;
        if (status === 429) {
          throw new Error("Search is busy. Please wait a moment and try again.");
        }
        if (status === 402) {
          throw new Error("Search credits exhausted. Please try again later.");
        }
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const results: OutfitRecommendation[] = (data?.outfits || []).map((o: any) => ({
        id: o.id,
        name: o.name,
        description: o.description,
        whyItSuits: o.whyItSuits,
        colorPalette: o.colorPalette || report.bestColors?.slice(0, 4).map((c) => c.hex) || [],
        occasion: o.occasion,
        season: o.season,
        products: o.products.map((p: any) => ({
          ...p,
          imageUrl: p.imageUrl || "/placeholder.svg",
        })),
        totalOriginalPrice: o.totalOriginalPrice,
        totalDiscountedPrice: o.totalDiscountedPrice,
      }));

      setOutfits(results);

      if (results.length === 0) {
        toast({
          title: "No products found",
          description: "Try adjusting your budget or preferences.",
          variant: "destructive",
        });
      }

      return results;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to search products";
      setSearchError(msg);
      toast({
        title: "Product search error",
        description: msg,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return { outfits, isSearching, searchError, searchProducts };
};
