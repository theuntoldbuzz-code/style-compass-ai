import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface StyleReportRequest {
  gender: string;
  preferredColors: string[];
  bodyType: string;
  heightShape: string;
  occasion: string;
  stylePersonality: string;
  budget: string;
  skinTone?: string;
  hairColor?: string;
  season?: string;
  photoAnalysis?: Record<string, unknown>;
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`Authenticated user: ${user.id}`);

    const rawBody = await req.json();
    const {
      gender = 'male',
      preferredColors = [],
      bodyType = 'rectangle',
      heightShape = 'average',
      occasion = 'casual',
      stylePersonality = 'classic',
      budget = 'mid',
      skinTone,
      hairColor,
      season,
      photoAnalysis,
    } = rawBody as StyleReportRequest;

    // Map budget to range text
    const budgetMap: Record<string, string> = {
      'budget': 'Under ₹1,500',
      'mid': '₹1,500 - ₹5,000',
      'premium': '₹5,000 - ₹15,000',
      'luxury': '₹15,000+',
    };
    const budgetRange = budgetMap[budget] || budget;

    // Map color values to readable names
    const colorMap: Record<string, string> = {
      'neutral': 'Neutrals (Beige, Cream, Brown)',
      'bold': 'Bold & Bright (Red, Orange, Yellow)',
      'cool': 'Cool Tones (Blue, Teal, Purple)',
      'pastel': 'Soft Pastels (Pink, Lavender, Mint)',
      'earth': 'Earth Tones (Green, Rust, Terracotta)',
      'monochrome': 'Black & White (Classic Monochrome)',
    };
    const colorNames = preferredColors.map((c: string) => colorMap[c] || c).join(', ');

    const heightMap: Record<string, string> = {
      'petite': 'Petite (Under 5\'3")',
      'average': 'Average (5\'3" - 5\'6")',
      'tall': 'Tall (5\'7" - 5\'10")',
      'very-tall': 'Very Tall (Above 5\'10")',
    };
    const heightLabel = heightMap[heightShape] || heightShape;

    const styleMap: Record<string, string> = {
      'bold': 'Bold & Trendy',
      'minimal': 'Minimal & Clean',
      'classic': 'Classic & Elegant',
      'boho': 'Bohemian & Free',
      'edgy': 'Edgy & Street',
      'romantic': 'Romantic & Feminine',
    };
    const styleLabel = styleMap[stylePersonality] || stylePersonality;

    const occasionMap: Record<string, string> = {
      'casual': 'Everyday Casual',
      'work': 'Office & Work',
      'party': 'Party & Events',
      'date': 'Date Nights',
      'ethnic': 'Traditional & Ethnic',
      'mix': 'Mix of Everything',
    };
    const occasionLabel = occasionMap[occasion] || occasion;

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    console.log("Generating style report via Groq for:", { gender, bodyType, heightShape, occasion, stylePersonality, budget });

    const systemPrompt = `You are a world-class professional fashion stylist, personal image consultant, and luxury wardrobe expert with experience styling clients across casual, office, ethnic, and premium fashion segments.

You specialize in:
- Body-type-based styling
- Color psychology & complexion harmony
- Height & proportion balancing
- Lifestyle-driven outfit planning
- Budget-optimized fashion recommendations

Your task is to generate a highly professional, detailed, expert-level personalized fashion report that looks premium, trustworthy, and extremely valuable.

The report should feel like it was created by a top human stylist, not an AI.

Tone & Style Guidelines:
- Confident, polished, and expert
- Clear sections with headings
- Practical, actionable advice
- Elegant but easy to read
- No emojis
- No fluff, no repetition

IMPORTANT: Your response must be valid JSON matching this exact structure:
{
  "styleProfileSummary": "A concise but premium overview explaining the user's overall fashion identity, dominant style personality, and how their preferences combine into a unique personal look. This should feel like a luxury stylist's diagnosis.",
  "skinToneAnalysis": {
    "undertone": "warm/cool/neutral assessment",
    "description": "Detailed analysis",
    "seasonType": "Color season type",
    "colorTemperature": "Whether to lean warm or cool",
    "metalPreference": "Gold/Silver/Rose Gold with explanation"
  },
  "bodyTypeAnalysis": {
    "type": "Body type with positive description",
    "strengths": ["4 specific body features to highlight"],
    "stylingFocus": "Silhouettes, cuts, proportions guidance",
    "avoidStyles": ["2-3 cuts or styles to avoid"],
    "fitTips": "Specific fit advice"
  },
  "colorStrategy": {
    "whyTheseColors": "Why their preferred colors suit their personality",
    "coreColors": ["Best core colors"],
    "accentColors": ["Accent colors"],
    "useSparingly": ["Colors to use sparingly"],
    "everydayCombos": "How to combine for everyday",
    "statementCombos": "How to combine for statements"
  },
  "bestColors": [
    {"color": "Name", "hex": "#hexcode", "reason": "Why it suits them", "howToWear": "How to use it"}
  ],
  "colorsToAvoid": [
    {"color": "Name", "hex": "#hexcode", "reason": "Why to avoid", "alternative": "Better alternative"}
  ],
  "heightProportionStyling": {
    "techniques": "Proportion-balancing techniques",
    "lengths": "Recommended lengths for tops, bottoms, outerwear",
    "visualTricks": "Vertical or horizontal styling tricks",
    "footwearGuidance": "Heel/sole type guidance"
  },
  "lifestyleOutfitDirection": {
    "dailyWear": "Daily wear recommendations",
    "primaryOccasion": "Specific occasion-based outfit direction",
    "balanceTip": "How to stay stylish without over-dressing"
  },
  "stylePersonalityDeepDive": {
    "essence": "The essence of their style",
    "fabrics": "Recommended fabrics",
    "textures": "Recommended textures",
    "prints": "Recommended prints",
    "accessoriesDirection": "Accessories direction",
    "standoutFactor": "What makes their style stand out"
  },
  "budgetStrategy": {
    "philosophy": "Smart shopping philosophy",
    "investIn": ["Where to invest"],
    "saveOn": ["Where to save"],
    "maxValueTip": "How to maximize value per outfit"
  },
  "bestPatterns": [
    {"pattern": "Name", "reason": "Why it works", "examples": "Specific examples"}
  ],
  "signatureLooks": [
    {
      "name": "Evocative name",
      "description": "Rich visual description with outfit direction",
      "keyPieces": ["5-6 specific pieces"],
      "occasion": "When to wear",
      "stylingNotes": "How to put it together",
      "confidenceBooster": "Why this look makes them feel amazing"
    }
  ],
  "essentialWardrobe": {
    "tops": ["Must-have tops"],
    "bottoms": ["Must-have bottoms"],
    "layering": ["Layering pieces"],
    "footwear": ["Footwear essentials"],
    "accessories": ["Accessory essentials"]
  },
  "stylingTips": ["8-10 highly personalized actionable tips"],
  "stylingDos": ["4-6 practical dos"],
  "stylingDonts": ["4-6 practical don'ts"],
  "accessoryGuide": {
    "jewelry": "Detailed jewelry recommendations",
    "bags": "Bag styles and colors",
    "shoes": "Footwear guidance",
    "scarves": "Scarves/dupattas/stoles guidance",
    "belts": "Belt and other accessories"
  },
  "shoppingGuide": {
    "investmentPieces": ["5 worth investing in"],
    "budgetFriendly": ["5 budget-friendly picks"],
    "brandsToExplore": ["5-6 brand suggestions"]
  },
  "seasonalWardrobe": {
    "capsuleEssentials": ["10 versatile pieces"],
    "statementPieces": ["3 bold pieces"],
    "layeringTips": "Seasonal layering advice"
  },
  "finalStylistNote": "A short, premium stylist message that builds confidence, encourages experimentation, and reinforces their unique style identity."
}

Include 8 best colors, 4 colors to avoid, 4 patterns, and 4 signature looks.
Do NOT mention AI, models, or prompts. The report must feel like a paid fashion consultation.`;

    let userPrompt = `User Profile:
- Gender: ${gender}
- Preferred Colors: ${colorNames}
- Body Type: ${bodyType}
- Height Category: ${heightLabel}
- Primary Dressing Purpose: ${occasionLabel}
- Style Personality: ${styleLabel}
- Budget Per Outfit: ${budgetRange}`;

    if (skinTone) userPrompt += `\n- Skin Tone: ${skinTone}`;
    if (hairColor) userPrompt += `\n- Hair Color: ${hairColor}`;
    if (season) userPrompt += `\n- Season: ${season}`;

    if (photoAnalysis) {
      userPrompt += `\n\nAI Photo Analysis Data:\n${JSON.stringify(photoAnalysis, null, 2)}`;
    }

    userPrompt += `\n\nGenerate the complete personalized fashion report as specified. Every suggestion must feel intentional and premium.`;

    // Call Groq API
    const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
    let response: Response | null = null;
    let lastErrorText = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(groqUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 8000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (response.ok) break;

      lastErrorText = await response.text();
      if (response.status !== 429 || attempt === 2) break;

      console.warn(`Groq 429; retrying (attempt ${attempt + 1}/3)`);
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!response || !response.ok) {
      const errorText = lastErrorText || (response ? await response.text() : "No response");
      console.error("Groq API error:", response?.status, errorText);
      
      if (response?.status === 429) {
        return new Response(JSON.stringify({ error: "AI is busy. Please wait a few seconds and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to generate style report. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content as string | undefined;
    if (!content) {
      console.error("Empty Groq response");
      return new Response(JSON.stringify({ error: "Empty AI response. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Style report generated, parsing response...");

    let styleReport;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      styleReport = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError);
      console.error("Raw content:", content?.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse style report. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Style report parsed successfully");

    return new Response(JSON.stringify({ report: styleReport }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-style-report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
