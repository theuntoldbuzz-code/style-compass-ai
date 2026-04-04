import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}

interface SignatureLook {
  name: string;
  description: string;
  keyPieces: string[];
  occasion: string;
  stylingNotes?: string;
  confidenceBooster?: string;
}

interface SearchRequest {
  signatureLooks: SignatureLook[];
  budgetMin: number;
  budgetMax: number;
  gender: string;
  occasion: string;
  season: string;
}

function sanitizeForPrompt(value: string): string {
  return value.replace(/[\n\r\t]/g, ' ').replace(/[^\x20-\x7E]/g, '').trim().substring(0, 200);
}

function buildSearchUrl(name: string, brand: string, store: string): string {
  const searchQuery = encodeURIComponent(`${brand} ${name}`.trim());
  const s = store.toLowerCase();
  if (s.includes("myntra")) return `https://www.myntra.com/${encodeURIComponent(name.replace(/\s+/g, "-").toLowerCase())}`;
  if (s.includes("ajio")) return `https://www.ajio.com/search/?text=${searchQuery}`;
  if (s.includes("amazon")) return `https://www.amazon.in/s?k=${searchQuery}`;
  if (s.includes("flipkart")) return `https://www.flipkart.com/search?q=${searchQuery}`;
  if (s.includes("tata") || s.includes("cliq")) return `https://www.tatacliq.com/search/?searchCategory=all&text=${searchQuery}`;
  if (s.includes("nykaa")) return `https://www.nykaafashion.com/search/result/?q=${searchQuery}`;
  if (s.includes("h&m") || s.includes("hm")) return `https://www2.hm.com/en_in/search-results.html?q=${searchQuery}`;
  if (s.includes("zara")) return `https://www.zara.com/in/en/search?searchTerm=${searchQuery}`;
  return `https://www.google.com/search?tbm=shop&q=${searchQuery}`;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Authenticated user: ${claimsData.claims.sub}`);

    const VALID_GENDERS = ['male', 'female', 'non-binary', 'other'];
    const VALID_OCCASIONS = ['wedding', 'diwali', 'office', 'date-night', 'party', 'casual', 'formal', 'christmas', 'brunch', 'weekend', 'festive', 'traditional', 'college', 'club'];
    const VALID_SEASONS = ['summer', 'winter', 'monsoon', 'spring', 'all'];

    const body: SearchRequest = await req.json();
    const { signatureLooks, budgetMin, budgetMax, gender, occasion, season } = body;

    if (!signatureLooks || !Array.isArray(signatureLooks) || signatureLooks.length === 0) {
      throw new Error("signatureLooks array is required");
    }

    const safeGender = VALID_GENDERS.includes(gender?.toLowerCase()) ? gender.toLowerCase() : 'unspecified';
    const safeOccasion = VALID_OCCASIONS.includes(occasion?.toLowerCase()) ? occasion.toLowerCase() : 'casual';
    const safeSeason = VALID_SEASONS.includes(season?.toLowerCase()) ? season.toLowerCase() : 'all';
    const safeBudgetMin = Math.max(0, Math.min(1000000, Number(budgetMin) || 0));
    const safeBudgetMax = Math.max(safeBudgetMin, Math.min(1000000, Number(budgetMax) || 25000));

    const outfitResults = [];

    for (const look of signatureLooks.slice(0, 4)) {
      const keyPiecesText = look.keyPieces.map(p => sanitizeForPrompt(p)).join(", ");
      const safeLookName = sanitizeForPrompt(look.name);

      const searchPrompt = `I need to buy a complete outfit in India. Here are the specific items I need:

${keyPiecesText}

This is for: ${safeGender}, ${safeOccasion} occasion, ${safeSeason} season.
Look name: "${safeLookName}"

My TOTAL budget for ALL items combined is ₹${safeBudgetMin} to ₹${safeBudgetMax} INR.

Search for each item on Indian e-commerce sites (Myntra, Ajio, Amazon India, Flipkart, Tata CLiQ, Nykaa Fashion, H&M India, Zara India).

For EACH item, find a real product and provide:
1. Exact product name
2. Brand name
3. Category (Shirt/Top/Pants/Shoes/Accessory/Dress/Kurta/Jacket etc.)
4. Current price in INR
5. Original price (MRP) in INR if discounted
6. Store name
7. Color
8. Rating (out of 5)

IMPORTANT: The TOTAL combined price of ALL items must be within ₹${safeBudgetMin} to ₹${safeBudgetMax}.
Return EXACTLY 4-6 products that form a complete outfit.
Return ONLY a valid JSON array. No markdown, no explanation, no code blocks. Just the raw JSON array.
Each object must have: name, brand, category, price (number), originalPrice (number), store, color, rating (number).`;

      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a fashion product search assistant for Indian e-commerce. Return ONLY a valid JSON array of product objects. No markdown, no explanation, just the JSON array. Each object must have: name, brand, category, price (number), originalPrice (number), store, color, rating (number). Use real product names and brands available on Indian stores.",
              },
              { role: "user", content: searchPrompt },
            ],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`Lovable AI error for "${look.name}":`, response.status, errText);
          
          if (response.status === 429) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          if (response.status === 402) {
            console.error("Lovable AI payment required");
            continue;
          }
          continue;
        }

        const aiData = await response.json();
        const content = aiData?.choices?.[0]?.message?.content;

        if (!content) {
          console.error(`Empty AI response for "${look.name}"`);
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
        } catch (parseErr) {
          console.error(`Failed to parse products for "${look.name}":`, content.substring(0, 500));
          continue;
        }

        if (!Array.isArray(products) || products.length === 0) {
          console.error(`No products array for "${look.name}"`);
          continue;
        }

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
          storeUrl: buildSearchUrl(String(p.name || ""), String(p.brand || ""), String(p.store || "")),
          rating: Number(p.rating || 4.0),
          color: String(p.color || ""),
        }));

        const totalOriginal = normalizedProducts.reduce((sum: number, p: any) => sum + p.originalPrice, 0);
        const totalDiscounted = normalizedProducts.reduce((sum: number, p: any) => sum + p.discountedPrice, 0);

        outfitResults.push({
          id: look.name.replace(/\s+/g, "-").toLowerCase(),
          name: look.name,
          description: look.description,
          whyItSuits: look.stylingNotes || look.confidenceBooster || look.description,
          colorPalette: [],
          occasion: [occasion],
          season: [season],
          products: normalizedProducts,
          totalOriginalPrice: totalOriginal,
          totalDiscountedPrice: totalDiscounted,
        });

        console.log(`Found ${normalizedProducts.length} products for "${look.name}", total: ₹${totalDiscounted}`);

        // Small delay between requests
        await new Promise((r) => setTimeout(r, 500));
      } catch (lookError) {
        console.error(`Error searching for "${look.name}":`, lookError);
        continue;
      }
    }

    console.log(`Total outfits with products: ${outfitResults.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        outfits: outfitResults,
        totalOutfits: outfitResults.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in search-products:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
