import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

interface AnalysisResult {
  isHuman: boolean;
  confidence: number;
  body_type: string | null;
  skin_tone: string | null;
  skin_undertone?: string | null;
  hair_color: string | null;
  face_shape: string | null;
  style_personality: string | null;
  measurements: {
    estimated_height_range: string;
    body_proportions: string;
    shoulder_type: string;
  } | null;
  recommended_colors: string[];
  avoid_colors: string[];
  style_notes: string[];
  error?: string;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get user_id from authorization header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Helper function to validate photo URLs (SSRF prevention)
    const isValidPhotoUrl = (url: string): boolean => {
      try {
        const photoUrl = new URL(url);
        
        // Only accept HTTPS URLs
        if (photoUrl.protocol !== 'https:') {
          console.log('Rejected non-HTTPS URL:', url);
          return false;
        }
        
        // Block private IP ranges, localhost, and cloud metadata endpoints
        const hostname = photoUrl.hostname.toLowerCase();
        if (
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname === '0.0.0.0' ||
          /^10\./.test(hostname) ||
          /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname) ||
          /^192\.168\./.test(hostname) ||
          /^169\.254\./.test(hostname) ||  // Cloud metadata
          /^::1$/.test(hostname) ||  // IPv6 localhost
          /^fe80:/i.test(hostname)  // IPv6 link-local
        ) {
          console.log('Rejected private/internal URL:', url);
          return false;
        }
        
        // Check URL length
        if (url.length > 500) {
          console.log('Rejected URL exceeding length limit');
          return false;
        }
        
        // Only allow URLs from Supabase storage (recommended approach)
        const supabaseHost = new URL(supabaseUrl).host;
        if (!photoUrl.host.endsWith(supabaseHost) && !photoUrl.host.includes('supabase')) {
          console.log('Warning: URL not from Supabase storage:', photoUrl.host);
          // Still allow but log for monitoring - could be made stricter
        }
        
        return true;
      } catch {
        console.log('Invalid URL format:', url);
        return false;
      }
    };

    // Support both GET with query params and POST with body
    let photoId: string | null = null;
    let photoUrl: string | null = null;
    let imageBase64: string | null = null;

    if (req.method === 'POST') {
      const body = await req.json();
      photoId = body.photo_id;
      photoUrl = body.photo_url;
      imageBase64 = body.image_base64;
    } else {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      photoId = pathParts[pathParts.length - 1] || url.searchParams.get('photo_id');
      photoUrl = url.searchParams.get('photo_url');
    }

    // Validate photo URL if provided directly (SSRF prevention)
    if (photoUrl && !isValidPhotoUrl(photoUrl)) {
      return new Response(
        JSON.stringify({ error: 'Invalid photo URL. Only HTTPS URLs from trusted sources are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!photoUrl && !imageBase64 && !photoId) {
      return new Response(
        JSON.stringify({ error: 'photo_url, image_base64, or photo_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If we have photoId, try to get the URL from database (safer approach - URLs already validated during upload)
    if (photoId && !photoUrl && !imageBase64) {
      const { data: existing } = await supabase
        .from('photo_analyses')
        .select('photo_url')
        .eq('photo_id', photoId)
        .maybeSingle();
      
      if (existing?.photo_url) {
        photoUrl = existing.photo_url;
      }
    }

    const analysisPrompt = `Analyze this image for fashion styling purposes.

FIRST, determine if this is a photo of a real human person. If it's not a human (e.g., an object, animal, cartoon, AI-generated art, or no person visible), respond with:
{"isHuman": false, "confidence": 0, "error": "Please upload a clear photo of yourself for personalized style analysis."}

If it IS a human photo, provide a detailed analysis in this exact JSON format:
{
  "isHuman": true,
  "confidence": 95,
  "body_type": "one of: hourglass, pear, apple, rectangle, inverted-triangle, athletic",
  "skin_tone": "specific tone like: fair with pink undertones, light olive, medium warm, deep with golden undertones, etc.",
  "skin_undertone": "warm, cool, or neutral",
  "hair_color": "specific color like: jet black, dark brown, chestnut, auburn, blonde, etc.",
  "face_shape": "oval, round, square, heart, oblong, diamond",
  "style_personality": "one of: Classic Elegant, Romantic Feminine, Natural Casual, Dramatic Bold, Creative Artistic, Sporty Chic",
  "measurements": {
    "estimated_height_range": "petite (under 5'3), average (5'3-5'6), tall (over 5'6)",
    "body_proportions": "balanced, long torso, long legs, short torso",
    "shoulder_type": "narrow, balanced, broad"
  },
  "recommended_colors": ["6-8 specific colors with hex codes that would flatter this person based on their coloring"],
  "avoid_colors": ["3-4 colors to avoid with hex codes"],
  "style_notes": ["4-5 specific, actionable styling observations for this person"]
}

Be specific and personalized. Analyze actual visible features.`;

    // Prepare image as a data URL for the AI gateway
    let imageDataUrl: string | null = null;

    if (imageBase64) {
      // If it's already a data URL, keep it; otherwise assume raw base64 jpeg
      imageDataUrl = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/jpeg;base64,${imageBase64}`;
    } else if (photoUrl) {
      // For URL-based images, fetch and convert to base64
      console.log("Fetching image from URL:", photoUrl);
      const imageResponse = await fetch(photoUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image from URL");
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
      imageDataUrl = `data:${contentType};base64,${base64Data}`;
    }

    if (!imageDataUrl) {
      return new Response(
        JSON.stringify({ error: 'No image provided for analysis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Sending image to Lovable AI gateway for analysis...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content:
              "You are a fashion photo analysis assistant. Return ONLY valid JSON. Do not wrap in markdown or code blocks.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a few seconds and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits are exhausted. Please add credits and try again." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to analyze photo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response received:", typeof content === "string" ? content.substring(0, 200) : "<non-text>");

    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Failed to analyze photo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON from the response
    let analysisResult: AnalysisResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysisResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      return new Response(JSON.stringify({ 
        error: "Failed to analyze the image. Please try with a clearer photo.",
        isHuman: false 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If not a human photo, return early
    if (!analysisResult.isHuman) {
      console.log("Photo is not a human:", analysisResult.error);
      return new Response(
        JSON.stringify({
          isHuman: false,
          error: analysisResult.error || "Please upload a photo of yourself for personalized style analysis.",
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store analysis in database if we have a photoId and userId
    if (photoId && userId) {
      const { error: upsertError } = await supabase
        .from('photo_analyses')
        .upsert({
          photo_id: photoId,
          photo_url: photoUrl || '',
          user_id: userId,
          body_type: analysisResult.body_type,
          skin_tone: analysisResult.skin_tone,
          hair_color: analysisResult.hair_color,
          measurements: analysisResult.measurements,
          recommended_colors: analysisResult.recommended_colors,
          avoid_colors: analysisResult.avoid_colors,
          analyzed_at: new Date().toISOString(),
        }, { onConflict: 'photo_id' });

      if (upsertError) {
        console.error('Database upsert error:', upsertError);
      }
    }

    console.log(`Analysis completed successfully for photo: ${photoId || 'direct-upload'}`);

    return new Response(
      JSON.stringify({
        isHuman: true,
        photo_id: photoId,
        photo_url: photoUrl,
        analysis: {
          body_type: analysisResult.body_type,
          skin_tone: analysisResult.skin_tone,
          skin_undertone: analysisResult.skin_undertone,
          hair_color: analysisResult.hair_color,
          face_shape: analysisResult.face_shape,
          style_personality: analysisResult.style_personality,
          measurements: analysisResult.measurements,
          recommended_colors: analysisResult.recommended_colors,
          avoid_colors: analysisResult.avoid_colors,
          style_notes: analysisResult.style_notes,
        },
        analyzed_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in photos-analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
