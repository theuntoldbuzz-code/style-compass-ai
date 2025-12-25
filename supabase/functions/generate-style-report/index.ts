import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StyleReportRequest {
  gender: string;
  skinTone: string;
  hairColor: string;
  bodyType: string;
  occasion: string;
  season: string;
  // Enhanced fields from photo analysis
  photoAnalysis?: {
    skin_undertone?: string;
    face_shape?: string;
    style_personality?: string;
    measurements?: {
      estimated_height_range: string;
      body_proportions: string;
      shoulder_type: string;
    };
    recommended_colors?: string[];
    avoid_colors?: string[];
    style_notes?: string[];
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json() as StyleReportRequest;
    const { gender, skinTone, hairColor, bodyType, occasion, season, photoAnalysis } = requestData;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating style report for:", { gender, skinTone, hairColor, bodyType, occasion, season });
    console.log("Photo analysis available:", !!photoAnalysis);

    const systemPrompt = `You are LuxFit AI, a world-renowned personal stylist, color analyst, and image consultant with 20+ years of experience working with celebrities, executives, and fashion-conscious individuals. You combine scientific color theory, body architecture analysis, and current fashion trends to create transformative style guides.

Your expertise includes:
- Seasonal Color Analysis (12-season system)
- Body Geometry and Proportions
- Face Shape Styling
- Personal Style Identity
- Occasion-Appropriate Dressing
- Cultural and Regional Fashion Sensibilities

Generate an AUTHENTIC, DETAILED, and GENUINELY VALUABLE style report. This should feel like a premium consultation worth ₹25,000+. Be specific, use the person's actual features, and provide insights they couldn't easily find elsewhere.

Your response must be valid JSON with this EXACT structure:
{
  "skinToneAnalysis": {
    "undertone": "warm/cool/neutral - be specific like 'warm with golden undertones' or 'cool with pink undertones'",
    "description": "3-4 sentences explaining their unique coloring, what makes it special, and how light interacts with their skin. Reference their specific hair color and how it complements their skin.",
    "seasonType": "One of: Bright Spring, True Spring, Light Spring, Light Summer, True Summer, Soft Summer, Soft Autumn, True Autumn, Deep Autumn, Deep Winter, True Winter, Bright Winter",
    "colorTemperature": "Explanation of whether they should lean warm or cool and why",
    "metalPreference": "Gold, Silver, Rose Gold, or Mixed - with explanation"
  },
  "bodyTypeAnalysis": {
    "type": "Their body type with a positive, empowering description",
    "strengths": ["4 specific body features to celebrate and highlight"],
    "stylingFocus": "3-4 sentences on silhouettes, cuts, and proportions that will make them look incredible",
    "avoidStyles": ["2-3 specific cuts or styles that won't flatter as much and why"],
    "fitTips": "Specific advice on how clothes should fit their unique proportions"
  },
  "bestColors": [
    {"color": "Specific color name", "hex": "#accurate_hexcode", "reason": "Why this color makes THEM look amazing, referencing their specific features", "howToWear": "Specific suggestion for using this color"},
    // Include 8 colors - mix of neutrals, accent colors, and statement colors
  ],
  "colorsToAvoid": [
    {"color": "Specific color name", "hex": "#hexcode", "reason": "Why this color doesn't work for their specific coloring", "alternative": "A better alternative color"}
  ],
  "bestPatterns": [
    {"pattern": "Pattern name", "reason": "Why it works for their body type and style", "examples": "Specific examples of how to incorporate"}
  ],
  "signatureLooks": [
    {
      "name": "Evocative name for the look",
      "description": "Rich, visual description that paints a picture",
      "keyPieces": ["5-6 specific pieces with details like fabric, cut, color"],
      "occasion": "When to wear this look",
      "stylingNotes": "How to put it together, accessories, finishing touches",
      "confidenceBooster": "Why this look will make them feel amazing"
    }
    // Include 4 signature looks for different occasions
  ],
  "stylingTips": [
    "8-10 highly personalized, actionable tips specific to their features, lifestyle, and goals"
  ],
  "accessoryGuide": {
    "jewelry": "Detailed recommendations for necklaces, earrings, bracelets, rings - mentioning metals, styles, and scales that work",
    "bags": "Specific bag styles, sizes, and colors that complement their frame and lifestyle",
    "shoes": "Heel heights, toe shapes, and styles that elongate and flatter",
    "scarves": "How to use scarves and which colors/patterns work best",
    "belts": "Belt styles and where to place them on their body"
  },
  "shoppingGuide": {
    "investmentPieces": ["5 pieces worth spending more on for their body type and lifestyle"],
    "budgetFriendly": ["5 pieces they can buy affordably without sacrificing style"],
    "brandsToExplore": ["5-6 brands that cater well to their body type and style preferences"]
  },
  "seasonalWardrobe": {
    "capsuleEssentials": ["10 versatile pieces that form the foundation of their wardrobe"],
    "statementPieces": ["3 bold pieces that express their style personality"],
    "layeringTips": "How to layer for the specified season while looking polished"
  }
}`;

    // Build a detailed user prompt incorporating photo analysis if available
    let userPrompt = `Generate a comprehensive, personalized style report for this individual:

BASIC PROFILE:
- Gender: ${gender}
- Skin Tone: ${skinTone}
- Hair Color: ${hairColor}
- Body Type: ${bodyType}
- Primary Occasion: ${occasion}
- Season: ${season}`;

    if (photoAnalysis) {
      userPrompt += `

AI PHOTO ANALYSIS (use this for even more personalized recommendations):
- Skin Undertone: ${photoAnalysis.skin_undertone || 'Not analyzed'}
- Face Shape: ${photoAnalysis.face_shape || 'Not analyzed'}
- Style Personality: ${photoAnalysis.style_personality || 'Not analyzed'}
- Height Range: ${photoAnalysis.measurements?.estimated_height_range || 'Not analyzed'}
- Body Proportions: ${photoAnalysis.measurements?.body_proportions || 'Not analyzed'}
- Shoulder Type: ${photoAnalysis.measurements?.shoulder_type || 'Not analyzed'}
- AI Recommended Colors: ${photoAnalysis.recommended_colors?.join(', ') || 'Not analyzed'}
- AI Colors to Avoid: ${photoAnalysis.avoid_colors?.join(', ') || 'Not analyzed'}
- AI Style Notes: ${photoAnalysis.style_notes?.join('; ') || 'Not analyzed'}`;
    }

    userPrompt += `

Create a LUXURIOUS, AUTHENTIC style consultation. This should feel like advice from a personal stylist who truly sees and understands this person. Include:
- 8 best colors with accurate hex codes
- 4 colors to avoid with alternatives
- 4 pattern recommendations
- 4 complete signature looks (one for ${occasion}, plus 3 other versatile occasions)
- 8-10 personalized styling tips
- Comprehensive accessory and shopping guidance

Make every recommendation SPECIFIC to their unique combination of features. Avoid generic advice.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate style report" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("Style report generated, parsing response...");

    // Parse the JSON from the response
    let styleReport;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      styleReport = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content?.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse style report. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Style report parsed successfully");

    return new Response(JSON.stringify({ report: styleReport }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-style-report:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
