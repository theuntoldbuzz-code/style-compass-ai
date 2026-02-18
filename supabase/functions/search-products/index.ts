import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.1");
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`Authenticated user: ${claimsData.claims.sub}`);

    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    const body: SearchRequest = await req.json();
    const { signatureLooks, budgetMin, budgetMax, gender, occasion, season } = body;

    if (!signatureLooks || !Array.isArray(signatureLooks) || signatureLooks.length === 0) {
      throw new Error("signatureLooks array is required");
    }

    console.log(`Searching products for ${signatureLooks.length} looks, budget: ₹${budgetMin}-₹${budgetMax}`);

    // For each signature look, search Perplexity for real products
    const outfitResults = [];

    for (const look of signatureLooks.slice(0, 4)) {
      const keyPiecesText = look.keyPieces.join(", ");

      const searchPrompt = `I need to buy a complete outfit in India. Here are the specific items I need:

${keyPiecesText}

This is for: ${gender}, ${occasion} occasion, ${season} season.
Look name: "${look.name}"

My TOTAL budget for ALL items combined is ₹${budgetMin} to ₹${budgetMax} INR.

Search for each item on Indian e-commerce sites (Myntra, Ajio, Amazon India, Flipkart, Tata CLiQ, Nykaa Fashion, H&M India, Zara India).

For EACH item, find a real product and provide:
1. Exact product name
2. Brand name
3. Category (Shirt/Top/Pants/Shoes/Accessory/Dress/Kurta/Jacket etc.)
4. Current price in INR
5. Original price (MRP) in INR if discounted
6. Store name
7. Direct product URL
8. Color
9. Rating (out of 5)

IMPORTANT: The TOTAL combined price of ALL items must be within ₹${budgetMin} to ₹${budgetMax}.
Return EXACTLY 4-6 products that form a complete outfit.
Format as JSON array with objects having: name, brand, category, price, originalPrice, store, storeUrl, color, rating.`;

      try {
        const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "You are a fashion product search assistant. Return ONLY a valid JSON array of product objects. No markdown, no explanation, just the JSON array. Each object must have: name, brand, category, price (number), originalPrice (number), store, storeUrl, color, rating (number).",
              },
              { role: "user", content: searchPrompt },
            ],
            temperature: 0.1,
            search_domain_filter: [
              "myntra.com",
              "ajio.com",
              "amazon.in",
              "flipkart.com",
              "tatacliq.com",
              "nykaa.com",
              "hm.com",
              "zara.com",
            ],
          }),
        });

        if (!perplexityResponse.ok) {
          const errText = await perplexityResponse.text();
          console.error(`Perplexity error for "${look.name}":`, perplexityResponse.status, errText);

          if (perplexityResponse.status === 429) {
            // Wait and continue with remaining looks
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          continue;
        }

        const perplexityData = await perplexityResponse.json();
        const content = perplexityData?.choices?.[0]?.message?.content;
        const citations = perplexityData?.citations || [];

        if (!content) {
          console.error(`Empty Perplexity response for "${look.name}"`);
          continue;
        }

        // Parse products from Perplexity response
        let products = [];
        try {
          // Try to extract JSON array from response
          const jsonMatch =
            content.match(/\[[\s\S]*\]/) ||
            content.match(/```json\n?([\s\S]*?)\n?```/) ||
            content.match(/```\n?([\s\S]*?)\n?```/);

          const jsonStr = jsonMatch
            ? jsonMatch[1] || jsonMatch[0]
            : content;
          products = JSON.parse(jsonStr.trim());
        } catch (parseErr) {
          console.error(`Failed to parse products for "${look.name}":`, content.substring(0, 500));
          continue;
        }

        if (!Array.isArray(products) || products.length === 0) {
          console.error(`No products array for "${look.name}", raw type: ${typeof products}, content preview: ${content.substring(0, 200)}`);
          continue;
        }

        // Map citation indices to real URLs
        const normalizedProducts = products.slice(0, 6).map((p: any, idx: number) => ({
          id: `${look.name.replace(/\s+/g, "-").toLowerCase()}-${idx}`,
          name: String(p.name || "Unknown Product"),
          brand: String(p.brand || "Unknown"),
          category: String(p.category || "Fashion"),
          imageUrl: "", // Will be populated by OG image fetching below
          originalPrice: Number(p.originalPrice || p.price || 0),
          discountedPrice: Number(p.price || p.discountedPrice || 0),
          discount: p.originalPrice && p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0,
          store: String(p.store || "Online"),
          storeUrl: String(p.storeUrl || p.url || "#"),
          rating: Number(p.rating || 4.0),
          color: String(p.color || ""),
        }));

        // Always construct working search URLs regardless of what Perplexity returns
        for (const product of normalizedProducts) {
          const searchQuery = encodeURIComponent(`${product.brand} ${product.name}`.trim());
          const store = (product.store || "").toLowerCase();
          if (store.includes("myntra")) {
            product.storeUrl = `https://www.myntra.com/${encodeURIComponent(product.name.replace(/\s+/g, "-").toLowerCase())}`;
          } else if (store.includes("ajio")) {
            product.storeUrl = `https://www.ajio.com/search/?text=${searchQuery}`;
          } else if (store.includes("amazon")) {
            product.storeUrl = `https://www.amazon.in/s?k=${searchQuery}`;
          } else if (store.includes("flipkart")) {
            product.storeUrl = `https://www.flipkart.com/search?q=${searchQuery}`;
          } else if (store.includes("tata") || store.includes("cliq")) {
            product.storeUrl = `https://www.tatacliq.com/search/?searchCategory=all&text=${searchQuery}`;
          } else if (store.includes("nykaa")) {
            product.storeUrl = `https://www.nykaafashion.com/search/result/?q=${searchQuery}`;
          } else if (store.includes("h&m") || store.includes("hm")) {
            product.storeUrl = `https://www2.hm.com/en_in/search-results.html?q=${searchQuery}`;
          } else if (store.includes("zara")) {
            product.storeUrl = `https://www.zara.com/in/en/search?searchTerm=${searchQuery}`;
          } else {
            // Fallback: Google Shopping search for any unknown store
            product.storeUrl = `https://www.google.com/search?tbm=shop&q=${searchQuery}`;
          }
        }

        const totalOriginal = normalizedProducts.reduce(
          (sum: number, p: any) => sum + p.originalPrice,
          0
        );
        const totalDiscounted = normalizedProducts.reduce(
          (sum: number, p: any) => sum + p.discountedPrice,
          0
        );

        outfitResults.push({
          id: look.name.replace(/\s+/g, "-").toLowerCase(),
          name: look.name,
          description: look.description,
          whyItSuits: look.stylingNotes || look.confidenceBooster || look.description,
          colorPalette: [], // Will use report colors
          occasion: [occasion],
          season: [season],
          products: normalizedProducts,
          totalOriginalPrice: totalOriginal,
          totalDiscountedPrice: totalDiscounted,
          citations,
        });

        console.log(
          `Found ${normalizedProducts.length} products for "${look.name}", total: ₹${totalDiscounted}`
        );

        // Small delay between requests to avoid rate limits
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
