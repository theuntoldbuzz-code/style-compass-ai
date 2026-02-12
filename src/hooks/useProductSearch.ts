import { useState } from "react";
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
      const looks = (report.signatureLooks || []).slice(0, 4);
      if (looks.length === 0) throw new Error("No signature looks found in report");

      const outfitResults: OutfitRecommendation[] = [];

      for (const look of looks) {
        const keyPiecesText = look.keyPieces.join(", ");

        const maxPerItem = Math.floor(budgetMax / Math.max(look.keyPieces.length, 4));

        const searchPrompt = `I need to buy a complete outfit in India. Items needed: ${keyPiecesText}.
For: ${gender}, ${occasion} occasion, ${season} season. Look: "${look.name}".

STRICT BUDGET RULE: The TOTAL combined price of ALL items MUST be ₹${budgetMax} INR or less. Absolutely do NOT exceed this total.
Suggested max per item: ~₹${maxPerItem} INR. Budget range: ₹${budgetMin}-₹${budgetMax} INR.

Search Indian e-commerce (Myntra, Ajio, Amazon India, Flipkart, H&M India, Zara India).
For EACH item find a real product with: name, brand, category, price (number in INR), originalPrice (number in INR), store, storeUrl, color, rating (number out of 5).
IMPORTANT: Add up all prices before responding - the sum MUST be ≤ ₹${budgetMax}. Return EXACTLY 4-6 products as a JSON array only. No markdown, no explanation.`;

        try {
          const response = await puter.ai.chat(searchPrompt, {
            model: "perplexity/sonar",
          });

          const content = response?.message?.content;
          if (!content) {
            console.error(`Empty Puter response for "${look.name}"`);
            continue;
          }

          let products = [];
          try {
            const jsonMatch =
              content.match(/\[[\s\S]*\]/) ||
              content.match(/```json\n?([\s\S]*?)\n?```/) ||
              content.match(/```\n?([\s\S]*?)\n?```/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
            products = JSON.parse(jsonStr.trim());
          } catch {
            console.error(`Failed to parse products for "${look.name}":`, content.substring(0, 500));
            continue;
          }

          if (!Array.isArray(products) || products.length === 0) continue;

          const normalizedProducts = products.slice(0, 6).map((p: any, idx: number) => {
            const rawPrice = Number(p.price || p.discountedPrice || 0);
            const rawOriginal = Number(p.originalPrice || p.price || 0);
            const product = {
              id: `${look.name.replace(/\s+/g, "-").toLowerCase()}-${idx}`,
              name: String(p.name || "Unknown Product"),
              brand: String(p.brand || "Unknown"),
              category: String(p.category || "Fashion"),
              imageUrl: "",
              originalPrice: Number(p.originalPrice || p.price || 0),
              discountedPrice: Number(p.price || p.discountedPrice || 0),
              discount: p.originalPrice && p.price
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 0,
              store: String(p.store || "Online"),
              storeUrl: "",
              rating: Number(p.rating || 4.0),
              color: String(p.color || ""),
            };

            // Build working search URLs - use storeUrl from AI if it looks valid
            const aiUrl = String(p.storeUrl || p.url || "");
            const searchQuery = encodeURIComponent(`${product.brand} ${product.name}`.trim());
            const store = product.store.toLowerCase();
            
            if (aiUrl.startsWith("http") && !aiUrl.includes("google.com")) {
              product.storeUrl = aiUrl;
            } else if (store.includes("myntra")) {
              product.storeUrl = `https://www.myntra.com/${encodeURIComponent(product.name.replace(/\s+/g, "-").toLowerCase())}`;
            } else if (store.includes("ajio")) {
              product.storeUrl = `https://www.ajio.com/search/?text=${searchQuery}`;
            } else if (store.includes("amazon")) {
              product.storeUrl = `https://www.amazon.in/s?k=${searchQuery}`;
            } else if (store.includes("flipkart")) {
              product.storeUrl = `https://www.flipkart.com/search?q=${searchQuery}`;
            } else if (store.includes("h&m") || store.includes("hm")) {
              product.storeUrl = `https://www2.hm.com/en_in/search-results.html?q=${searchQuery}`;
            } else if (store.includes("zara")) {
              product.storeUrl = `https://www.zara.com/in/en/search?searchTerm=${searchQuery}`;
            } else {
              // Fallback to Amazon India search instead of Google (which gets blocked)
              product.storeUrl = `https://www.amazon.in/s?k=${searchQuery}`;
            }

            return product;
          });

          // Enforce budget: if total exceeds max, scale prices down proportionally
          let totalDiscounted = normalizedProducts.reduce((sum, p) => sum + p.discountedPrice, 0);
          if (totalDiscounted > budgetMax) {
            const scale = budgetMax / totalDiscounted;
            normalizedProducts.forEach(p => {
              p.discountedPrice = Math.round(p.discountedPrice * scale);
              p.originalPrice = Math.round(p.originalPrice * scale);
              p.discount = p.originalPrice > p.discountedPrice
                ? Math.round(((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100)
                : 0;
            });
            totalDiscounted = normalizedProducts.reduce((sum, p) => sum + p.discountedPrice, 0);
          }
          const totalOriginal = normalizedProducts.reduce((sum, p) => sum + p.originalPrice, 0);

          outfitResults.push({
            id: look.name.replace(/\s+/g, "-").toLowerCase(),
            name: look.name,
            description: look.description,
            whyItSuits: look.stylingNotes || look.confidenceBooster || look.description,
            colorPalette: report.bestColors?.slice(0, 4).map((c) => c.hex) || [],
            occasion: [occasion],
            season: [season],
            products: normalizedProducts,
            totalOriginalPrice: totalOriginal,
            totalDiscountedPrice: totalDiscounted,
          });

          console.log(`Found ${normalizedProducts.length} products for "${look.name}", total: ₹${totalDiscounted}`);
        } catch (lookError) {
          console.error(`Error searching for "${look.name}":`, lookError);
          continue;
        }
      }

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
