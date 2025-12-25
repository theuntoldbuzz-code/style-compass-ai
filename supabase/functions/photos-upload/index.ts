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
  // Allow Lovable preview domains (*.lovable.app)
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  // Allow Lovable preview domains (*.lovableproject.com)  
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user - require authentication for photo uploads
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required to upload photos' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`Photo upload initiated by user: ${userId}`);

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (max 10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 10MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique photo ID and organize by user ID for storage policies
    const photoId = crypto.randomUUID();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    // Organize files by user ID: {userId}/{photoId}.{ext}
    const filePath = `${userId}/${photoId}.${fileExtension}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-photos')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate signed URL for private bucket (24 hours expiry)
    const { data: urlData, error: signError } = await supabase.storage
      .from('user-photos')
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour expiry

    if (signError || !urlData) {
      console.error('Failed to create signed URL:', signError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate photo URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const photoUrl = urlData.signedUrl;

    // Store in photo_analyses table with user_id (analysis will be added later)
    const { error: dbError } = await supabase
      .from('photo_analyses')
      .insert({
        photo_id: photoId,
        photo_url: photoUrl,
        user_id: userId,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request, photo is still uploaded
    }

    console.log(`Photo uploaded successfully: ${photoId}`);

    return new Response(
      JSON.stringify({
        success: true,
        photo_id: photoId,
        photo_url: photoUrl,
        message: 'Photo uploaded successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in photos-upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
