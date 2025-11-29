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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gender, skinTone, hairColor, bodyType, occasion, season } = await req.json() as StyleReportRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are LuxFit AI, a world-class personal fashion stylist and color analyst. Generate a comprehensive, personalized style report in JSON format. Be specific, practical, and luxurious in your recommendations.

Your response must be valid JSON with this exact structure:
{
  "skinToneAnalysis": {
    "undertone": "warm/cool/neutral",
    "description": "2-3 sentences about their skin tone characteristics",
    "seasonType": "Spring/Summer/Autumn/Winter"
  },
  "bodyTypeAnalysis": {
    "type": "the body type",
    "strengths": ["3 body features to highlight"],
    "stylingFocus": "2-3 sentences on how to dress this body type"
  },
  "bestColors": [
    {"color": "color name", "hex": "#hexcode", "reason": "why it suits them"}
  ],
  "colorsToAvoid": [
    {"color": "color name", "hex": "#hexcode", "reason": "why to avoid"}
  ],
  "bestPatterns": [
    {"pattern": "pattern name", "reason": "why it works"}
  ],
  "signatureLooks": [
    {
      "name": "look name",
      "description": "detailed description",
      "keyPieces": ["piece1", "piece2", "piece3"],
      "occasion": "when to wear"
    }
  ],
  "stylingTips": ["5 personalized styling tips"],
  "accessoryGuide": {
    "jewelry": "recommendation",
    "bags": "recommendation",
    "shoes": "recommendation"
  }
}`;

    const userPrompt = `Generate a personalized style report for:
- Gender: ${gender}
- Skin Tone: ${skinTone}
- Hair Color: ${hairColor}
- Body Type: ${bodyType}
- Primary Occasion: ${occasion}
- Season: ${season}

Create a luxurious, detailed style analysis with specific color hex codes and practical recommendations. Include 6 best colors and 4 colors to avoid. Provide 3 signature looks and 4 best patterns.`;

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
        temperature: 0.7,
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
    
    // Parse the JSON from the response
    let styleReport;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      styleReport = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      return new Response(JSON.stringify({ error: "Failed to parse style report" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
