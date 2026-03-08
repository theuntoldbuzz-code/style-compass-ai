import { useState } from "react";
import { OutfitRecommendation } from "@/types/outfit";
import { StyleReport } from "@/types/styleReport";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const looks = (report.signatureLooks || []).slice(0, 4);
      if (looks.length === 0) throw new Error("No signature looks found in report");

      const response = await supabase.functions.invoke("search-products", {
        body: {
          signatureLooks: looks,
          budgetMin,
          budgetMax,
          gender,
          occasion,
          season,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Product search failed");
      }

      const data = response.data;
      if (!data?.success || !data?.outfits) {
        throw new Error(data?.error || "No products returned");
      }

      const outfitResults: OutfitRecommendation[] = data.outfits.map((outfit: any) => ({
        ...outfit,
        colorPalette: report.bestColors?.slice(0, 4).map((c) => c.hex) || outfit.colorPalette || [],
      }));

      setOutfits(outfitResults);

      if (outfitResults.length === 0) {
        toast({
          title: "No products found",
          description: "Try adjusting your budget or preferences.",
          variant: "destructive",
        });
      }

      return outfitResults;
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
