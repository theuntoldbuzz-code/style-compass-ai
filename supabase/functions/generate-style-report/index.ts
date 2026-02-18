import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
];

// Check if origin is allowed (includes Lovable preview domains)
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function parseRetryAfterMs(resp: Response, bodyText: string): number {
  const header = resp.headers.get("retry-after");
  if (header) {
    const s = Number(header);
    if (!Number.isNaN(s) && s > 0) return Math.min(s * 1000, 8000);
  }

  // Best-effort parse for provider-like error payloads that include retryDelay: "25s"
  const match = bodyText.match(/"retryDelay"\s*:\s*"(\d+)s"/);
  if (match) {
    const s = Number(match[1]);
    if (!Number.isNaN(s) && s > 0) return Math.min(s * 1000, 8000);
  }

  return 1200;
}

interface StyleReportRequest {
  gender: string;
  skinTone: string;
  hairColor: string;
  bodyType: string;
  occasion: string;
  season: string;
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

// Input validation constants
const MAX_STRING_LENGTH = 100;
const MAX_STYLE_NOTES = 10;
const MAX_COLORS = 20;
const VALID_HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

// Allowed values for enumerated fields
const VALID_GENDERS = ['male', 'female', 'non-binary', 'other'];
const VALID_SEASONS = ['spring', 'summer', 'autumn', 'fall', 'winter', 'monsoon', 'all'];
const VALID_OCCASIONS = ['office', 'casual', 'formal', 'wedding', 'festive', 'party', 'date-night', 'brunch', 'traditional', 'all'];
const VALID_BODY_TYPES = ['hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle', 'athletic', 'plus-size', 'petite', 'tall'];

// Sanitize string input
function sanitizeString(value: unknown, fieldName: string, maxLength = MAX_STRING_LENGTH): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  return value.trim().substring(0, maxLength);
}

// Validate enumerated value
function validateEnum(value: string, allowedValues: string[], fieldName: string): string {
  const normalized = value.toLowerCase().trim();
  if (!allowedValues.includes(normalized)) {
    // Return a default rather than throwing for flexibility
    console.warn(`Invalid ${fieldName}: ${value}. Using default.`);
    return allowedValues[0];
  }
  return normalized;
}

// Validate color array
function validateColors(colors: unknown): string[] {
  if (!colors) return [];
  if (!Array.isArray(colors)) return [];
  return colors
    .filter((c): c is string => typeof c === 'string')
    .slice(0, MAX_COLORS)
    .map(c => c.trim().substring(0, 50));
}

// Validate style notes
function validateStyleNotes(notes: unknown): string[] {
  if (!notes) return [];
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((n): n is string => typeof n === 'string')
    .slice(0, MAX_STYLE_NOTES)
    .map(n => n.trim().substring(0, 200));
}

// Validate photo analysis object
function validatePhotoAnalysis(analysis: unknown): StyleReportRequest['photoAnalysis'] | undefined {
  if (!analysis || typeof analysis !== 'object') return undefined;
  
  const a = analysis as Record<string, unknown>;
  
  return {
    skin_undertone: sanitizeString(a.skin_undertone, 'skin_undertone', 50) || undefined,
    face_shape: sanitizeString(a.face_shape, 'face_shape', 50) || undefined,
    style_personality: sanitizeString(a.style_personality, 'style_personality', 100) || undefined,
    measurements: a.measurements && typeof a.measurements === 'object' ? {
      estimated_height_range: sanitizeString((a.measurements as Record<string, unknown>).estimated_height_range, 'height_range', 50),
      body_proportions: sanitizeString((a.measurements as Record<string, unknown>).body_proportions, 'body_proportions', 100),
      shoulder_type: sanitizeString((a.measurements as Record<string, unknown>).shoulder_type, 'shoulder_type', 50),
    } : undefined,
    recommended_colors: validateColors(a.recommended_colors),
    avoid_colors: validateColors(a.avoid_colors),
    style_notes: validateStyleNotes(a.style_notes),
  };
}

// Validate entire request
function validateRequest(body: unknown): StyleReportRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }
  
  const b = body as Record<string, unknown>;
  
  const gender = sanitizeString(b.gender, 'gender');
  const skinTone = sanitizeString(b.skinTone, 'skinTone');
  const hairColor = sanitizeString(b.hairColor, 'hairColor');
  const bodyType = sanitizeString(b.bodyType, 'bodyType');
  const occasion = sanitizeString(b.occasion, 'occasion');
  const season = sanitizeString(b.season, 'season');
  
  // Require basic fields
  if (!gender || !skinTone || !bodyType) {
    throw new Error('Missing required fields: gender, skinTone, and bodyType are required');
  }
  
  return {
    gender: validateEnum(gender, VALID_GENDERS, 'gender'),
    skinTone,
    hairColor: hairColor || 'Not specified',
    bodyType: validateEnum(bodyType, VALID_BODY_TYPES, 'bodyType'),
    occasion: validateEnum(occasion || 'casual', VALID_OCCASIONS, 'occasion'),
    season: validateEnum(season || 'all', VALID_SEASONS, 'season'),
    photoAnalysis: validatePhotoAnalysis(b.photoAnalysis),
  };
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
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
    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const rawBody = await req.json();
    const requestData = validateRequest(rawBody);
    const { gender, skinTone, hairColor, bodyType, occasion, season, photoAnalysis } = requestData;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating style report for:", { gender, skinTone, hairColor, bodyType, occasion, season });
    console.log("Photo analysis available:", !!photoAnalysis);

    const systemPrompt = `You are a world-class professional fashion designer, celebrity stylist, and personal image consultant with 15+ years of experience in luxury fashion, high-street fashion, Indian traditional wear, western wear, seasonal styling, color theory, fabric science, body-type optimization, and grooming aesthetics.

You have styled:
- Celebrities
- Corporate professionals
- Wedding guests
- Casual lifestyle influencers
across all genders, body types, skin tones, ages, seasons, and cultures.

Your task is to analyze the user's provided personal details and context, and then design a complete, head-to-toe outfit recommendation that looks premium, intentional, and expertly curated.

You must think like a real human stylist, not a generic AI.

ANALYSIS INSTRUCTIONS (VERY IMPORTANT)
Before suggesting outfits, internally analyze:
- Facial structure & proportions (from any photo analysis data)
- Body balance (shoulders, waist, height perception)
- Skin undertone (warm / cool / neutral)
- Color harmony with skin & hair
- Season-appropriate fabrics
- Occasion appropriateness
- Cultural and traditional suitability (especially for Indian wear)
- Practical comfort + visual elegance

Your goal is to enhance the user's natural strengths and avoid anything that clashes with their body, skin tone, or event.

TONE & QUALITY RULES
- Sound like a luxury stylist, not a shopping bot
- Be confident, refined, and precise
- Avoid generic advice
- Every suggestion must feel intentional and premium
- Never overwhelm — clarity > quantity

Your response must be valid JSON with this EXACT structure:
{
  "skinToneAnalysis": {
    "undertone": "warm/cool/neutral - be specific like 'warm with golden undertones'",
    "description": "3-4 sentences explaining their unique coloring, what makes it special, and how light interacts with their skin. Reference their specific hair color.",
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
    {"color": "Specific color name", "hex": "#accurate_hexcode", "reason": "Why this color makes THEM look amazing, referencing their specific features", "howToWear": "Specific suggestion for using this color"}
  ],
  "colorsToAvoid": [
    {"color": "Specific color name", "hex": "#hexcode", "reason": "Why this doesn't work for their specific coloring", "alternative": "A better alternative color"}
  ],
  "bestPatterns": [
    {"pattern": "Pattern name", "reason": "Why it works for their body type and style", "examples": "Specific examples"}
  ],
  "signatureLooks": [
    {
      "name": "Evocative name for the look",
      "description": "Rich, visual description including outfit direction (Western/Traditional/Fusion based on user). For males: upper wear (type, color, fabric, fit), lower wear, layering, footwear, accessories, grooming tips. For females: outfit direction, upper wear (neckline, sleeve), lower wear, traditional wear option if suitable (saree/lehenga/anarkali etc with fabric & drape style), layering, footwear (heel height), accessories (jewelry type - minimal/statement/traditional, earrings, bangles, bag), hair & makeup direction.",
      "keyPieces": ["5-6 specific pieces with fabric, cut, color details"],
      "occasion": "When to wear this look",
      "stylingNotes": "How to put it together, accessories, finishing touches. Include 2-3 styling pro-tips and one confidence tip (posture, attitude, grooming).",
      "confidenceBooster": "Why this look will make them feel amazing"
    }
  ],
  "stylingTips": [
    "8-10 highly personalized, actionable tips specific to their features"
  ],
  "accessoryGuide": {
    "jewelry": "Detailed recommendations - metals, styles, scales. For females include earrings (studs/jhumkas/hoops), neckwear, bangles/bracelets",
    "bags": "Specific bag styles, sizes, colors",
    "shoes": "Types, heel heights (if applicable), toe shapes, comfort vs elegance balance. For males: sneakers/loafers/oxfords/mojaris/boots. For females: sneakers/sandals/heels/wedges/juttis",
    "scarves": "How to use scarves/dupattas/stoles and which colors/patterns work",
    "belts": "Belt styles, watch type, sunglasses (if applicable), traditional accessories"
  },
  "shoppingGuide": {
    "investmentPieces": ["5 pieces worth spending more on"],
    "budgetFriendly": ["5 pieces they can buy affordably"],
    "brandsToExplore": ["5-6 brands that cater to their body type and style"]
  },
  "seasonalWardrobe": {
    "capsuleEssentials": ["10 versatile foundation pieces"],
    "statementPieces": ["3 bold pieces expressing their style personality"],
    "layeringTips": "How to layer for the specified season while looking polished"
  }
}

Include 8 best colors, 4 colors to avoid, 4 patterns, and 4 signature looks (one for the primary occasion plus 3 versatile ones).`;

    // Build user prompt with all personal details
    let userPrompt = `🧠 STYLIST'S CLIENT BRIEF — Analyze and create a premium style consultation:

USER PROFILE:
- Gender: ${gender}
- Skin Tone: ${skinTone}
- Hair Color: ${hairColor}
- Body Type: ${bodyType}
- Occasion: ${occasion}
- Season: ${season}`;

    if (photoAnalysis) {
      userPrompt += `

AI PHOTO ANALYSIS DATA (use for deeply personalized recommendations):
- Skin Undertone: ${photoAnalysis.skin_undertone || 'Not analyzed'}
- Face Shape: ${photoAnalysis.face_shape || 'Not analyzed'}
- Style Personality: ${photoAnalysis.style_personality || 'Not analyzed'}
- Height Range: ${photoAnalysis.measurements?.estimated_height_range || 'Not analyzed'}
- Body Proportions: ${photoAnalysis.measurements?.body_proportions || 'Not analyzed'}
- Shoulder Type: ${photoAnalysis.measurements?.shoulder_type || 'Not analyzed'}
- Recommended Colors: ${photoAnalysis.recommended_colors?.join(', ') || 'Not analyzed'}
- Colors to Avoid: ${photoAnalysis.avoid_colors?.join(', ') || 'Not analyzed'}
- Style Notes: ${photoAnalysis.style_notes?.join('; ') || 'Not analyzed'}`;
    }

    userPrompt += `

Design a complete head-to-toe style report. Think like a real human stylist who truly sees this person. Every suggestion must feel intentional and premium.`;

    // Use Lovable AI Gateway (OpenAI-compatible) to avoid direct provider quota issues.
    const requestPayload = {
      model: "google/gemini-3-flash-preview",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
    };

    const aiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
    let response: Response | null = null;
    let lastErrorText = "";

    // Retry a couple of times on transient 429s.
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(aiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (response.ok) break;

      lastErrorText = await response.text();
      if (response.status !== 429 || attempt === 2) break;

      const waitMs = parseRetryAfterMs(response, lastErrorText);
      console.warn(`AI gateway 429; retrying in ${waitMs}ms (attempt ${attempt + 1}/3)`);
      await new Promise((r) => setTimeout(r, waitMs));
    }

    if (!response) {
      return new Response(JSON.stringify({ error: "Failed to contact AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      const errorText = lastErrorText || await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits are exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to generate style report" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content as string | undefined;
    if (!content || typeof content !== "string") {
      console.error("Empty AI response received");
      return new Response(JSON.stringify({ error: "Empty AI response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isValidationError = errorMessage.includes('required') || errorMessage.includes('must be');
    return new Response(JSON.stringify({ error: isValidationError ? errorMessage : "An error occurred" }), {
      status: isValidationError ? 400 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
