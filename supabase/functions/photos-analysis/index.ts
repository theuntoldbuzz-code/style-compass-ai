import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock analysis data generator
function generateMockAnalysis(photoId: string) {
  const bodyTypes = ['hourglass', 'pear', 'apple', 'rectangle', 'inverted-triangle'];
  const skinTones = ['fair', 'light', 'medium', 'olive', 'tan', 'deep'];
  const hairColors = ['black', 'brown', 'blonde', 'red', 'gray', 'auburn'];
  
  const recommendedPalettes = {
    'fair': ['#E8D5B7', '#F5E6D3', '#C9B8A5', '#8B7355', '#4A4A4A', '#2C3E50', '#8E44AD', '#E74C3C'],
    'medium': ['#D4A574', '#C19A6B', '#8B4513', '#F5DEB3', '#FFE4B5', '#2E8B57', '#4169E1', '#DC143C'],
    'olive': ['#DAA520', '#B8860B', '#CD853F', '#8B4513', '#556B2F', '#6B8E23', '#483D8B', '#8B0000'],
    'deep': ['#FFD700', '#FF8C00', '#FF6347', '#00CED1', '#7B68EE', '#DC143C', '#228B22', '#4169E1'],
  };

  const avoidColors = {
    'fair': ['#FFFF00', '#00FF00', '#FF69B4'],
    'medium': ['#808080', '#C0C0C0', '#FFFFFF'],
    'olive': ['#FFC0CB', '#FFB6C1', '#FFDAB9'],
    'deep': ['#F0F8FF', '#FFFAFA', '#FFFFF0'],
  };

  const selectedSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
  const skinCategory = ['fair', 'light'].includes(selectedSkinTone) ? 'fair' : 
                       ['medium', 'olive'].includes(selectedSkinTone) ? 'medium' : 
                       selectedSkinTone === 'tan' ? 'olive' : 'deep';

  return {
    body_type: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
    skin_tone: selectedSkinTone,
    hair_color: hairColors[Math.floor(Math.random() * hairColors.length)],
    measurements: {
      estimated_height: `${Math.floor(Math.random() * 30 + 150)}cm`,
      shoulder_width: `${Math.floor(Math.random() * 10 + 38)}cm`,
      bust: `${Math.floor(Math.random() * 15 + 80)}cm`,
      waist: `${Math.floor(Math.random() * 20 + 60)}cm`,
      hips: `${Math.floor(Math.random() * 20 + 85)}cm`,
    },
    recommended_colors: recommendedPalettes[skinCategory] || recommendedPalettes['medium'],
    avoid_colors: avoidColors[skinCategory] || avoidColors['medium'],
    style_notes: [
      'Balanced proportions suit most silhouettes',
      'Consider structured pieces for a polished look',
      'Earth tones complement your natural coloring',
    ],
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract photo_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const photoId = pathParts[pathParts.length - 1] || url.searchParams.get('photo_id');

    if (!photoId) {
      return new Response(
        JSON.stringify({ error: 'photo_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if analysis already exists
    const { data: existing, error: fetchError } = await supabase
      .from('photo_analyses')
      .select('*')
      .eq('photo_id', photoId)
      .maybeSingle();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch photo analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If analysis exists and has been processed, return it
    if (existing && existing.body_type) {
      return new Response(
        JSON.stringify({
          photo_id: existing.photo_id,
          photo_url: existing.photo_url,
          analysis: {
            body_type: existing.body_type,
            skin_tone: existing.skin_tone,
            hair_color: existing.hair_color,
            measurements: existing.measurements,
            recommended_colors: existing.recommended_colors,
            avoid_colors: existing.avoid_colors,
          },
          analyzed_at: existing.analyzed_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate mock analysis
    const mockAnalysis = generateMockAnalysis(photoId);

    // Update the record with analysis
    if (existing) {
      const { error: updateError } = await supabase
        .from('photo_analyses')
        .update({
          body_type: mockAnalysis.body_type,
          skin_tone: mockAnalysis.skin_tone,
          hair_color: mockAnalysis.hair_color,
          measurements: mockAnalysis.measurements,
          recommended_colors: mockAnalysis.recommended_colors,
          avoid_colors: mockAnalysis.avoid_colors,
          analyzed_at: new Date().toISOString(),
        })
        .eq('photo_id', photoId);

      if (updateError) {
        console.error('Update error:', updateError);
      }
    }

    console.log(`Analysis generated for photo: ${photoId}`);

    return new Response(
      JSON.stringify({
        photo_id: photoId,
        photo_url: existing?.photo_url || null,
        analysis: {
          body_type: mockAnalysis.body_type,
          skin_tone: mockAnalysis.skin_tone,
          hair_color: mockAnalysis.hair_color,
          measurements: mockAnalysis.measurements,
          recommended_colors: mockAnalysis.recommended_colors,
          avoid_colors: mockAnalysis.avoid_colors,
          style_notes: mockAnalysis.style_notes,
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
