import { useState } from "react";
import { OutfitRecommendation } from "@/types/outfit";
import { StyleReport } from "@/types/styleReport";
import { toast } from "@/hooks/use-toast";

function buildSearchUrl(product: { name: string; brand: string; store: string }): string {
  const searchQuery = encodeURIComponent(`${product.brand} ${product.name}`.trim());
  const store = (product.store || "").toLowerCase();
  if (store.includes("myntra")) return `https://www.myntra.com/${encodeURIComponent(product.name.replace(/\s+/g, "-").toLowerCase())}`;
  if (store.includes("ajio")) return `https://www.ajio.com/search/?text=${searchQuery}`;
  if (store.includes("amazon")) return `https://www.amazon.in/s?k=${searchQuery}`;
  if (store.includes("flipkart")) return `https://www.flipkart.com/search?q=${searchQuery}`;
  if (store.includes("tata") || store.includes("cliq")) return `https://www.tatacliq.com/search/?searchCategory=all&text=${searchQuery}`;
  if (store.includes("nykaa")) return `https://www.nykaafashion.com/search/result/?q=${searchQuery}`;
  if (store.includes("h&m") || store.includes("hm")) return `https://www2.hm.com/en_in/search-results.html?q=${searchQuery}`;
  if (store.includes("zara")) return `https://www.zara.com/in/en/search?searchTerm=${searchQuery}`;
  return `https://www.google.com/search?tbm=shop&q=${searchQuery}`;
}

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

      const allOutfits: OutfitRecommendation[] = [];

      for (const look of looks) {
        const keyPiecesText = (look.keyPieces || []).join(", ");

        const prompt = `You are a fashion product search assistant for Indian e-commerce. Find REAL products available on Indian stores.

I need a complete outfit with these items: ${keyPiecesText}

Details:
- Gender: ${gender}
- Occasion: ${occasion}
- Season: ${season}
- Look name: "${look.name}"
- TOTAL budget for ALL items: ₹${budgetMin} to ₹${budgetMax} INR

Search across: Myntra, Ajio, Amazon India, Flipkart, Tata CLiQ, Nykaa Fashion, H&M India, Zara India.

Return EXACTLY a JSON array of 4-6 product objects. Each object must have:
- name (string): specific product name
- brand (string): brand name
- category (string): Shirt/Top/Pants/Shoes/Accessory/Dress/Kurta/Jacket etc.
- price (number): current price in INR
- originalPrice (number): MRP in INR
- store (string): store name (Myntra/Ajio/Amazon/Flipkart/etc.)
- color (string): color of the product
- rating (number): rating out of 5

CRITICAL: Return ONLY a valid JSON array. No markdown, no explanation, no code blocks. Just the raw JSON array starting with [ and ending with ].
The total of all prices must be within ₹${budgetMin}-₹${budgetMax}.`;

        try {
          if (typeof puter === "undefined" || !puter?.ai?.chat) {
            throw new Error("Puter.js is not loaded. Please refresh the page.");
          }
          const response = await puter.ai.chat(prompt, {
            model: "gpt-4o",
          });

          const content = response?.message?.content || "";
          
          let products: any[] = [];
          try {
            const jsonMatch =
              content.match(/\[[\s\S]*\]/) ||
              content.match(/```json\n?([\s\S]*?)\n?```/) ||
              content.match(/```\n?([\s\S]*?)\n?```/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
            products = JSON.parse(jsonStr.trim());
          } catch {
            console.error(`Failed to parse products for "${look.name}":`, content.substring(0, 300));
            continue;
          }

          if (!Array.isArray(products) || products.length === 0) continue;

          const normalizedProducts = products.slice(0, 6).map((p: any, idx: number) => ({
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
            storeUrl: buildSearchUrl({ name: String(p.name || ""), brand: String(p.brand || ""), store: String(p.store || "") }),
            rating: Number(p.rating || 4.0),
            color: String(p.color || ""),
          }));

          const totalOriginal = normalizedProducts.reduce((sum, p) => sum + p.originalPrice, 0);
          const totalDiscounted = normalizedProducts.reduce((sum, p) => sum + p.discountedPrice, 0);

          allOutfits.push({
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
        } catch (lookError) {
          console.error(`Error searching for "${look.name}":`, lookError);
          continue;
        }
      }

      setOutfits(allOutfits);

      if (allOutfits.length === 0) {
        toast({
          title: "No products found",
          description: "Try adjusting your budget or preferences.",
          variant: "destructive",
        });
      }

      return allOutfits;
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
