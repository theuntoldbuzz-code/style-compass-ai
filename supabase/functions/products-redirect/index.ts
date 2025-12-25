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

// Fallback affiliate URLs by store
const storeAffiliateUrls: Record<string, string> = {
  'Myntra': 'https://www.myntra.com/',
  'Ajio': 'https://www.ajio.com/',
  'Flipkart': 'https://www.flipkart.com/',
  'Amazon': 'https://www.amazon.in/',
  'TataCliq': 'https://www.tatacliq.com/',
};

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

    // Get product_id from query params
    const url = new URL(req.url);
    const productId = url.searchParams.get('product_id');

    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'product_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request metadata for logging
    const userAgent = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ipAddress = forwardedFor.split(',')[0]?.trim() || 'unknown';

    // Try to get product from database
    const { data: product } = await supabase
      .from('products_catalog')
      .select('affiliate_url, store')
      .eq('product_id', productId)
      .maybeSingle();

    // Determine affiliate URL
    let affiliateUrl = product?.affiliate_url;
    
    // Fallback for mock products
    if (!affiliateUrl) {
      // Map product IDs to stores (mock data)
      const mockProductStores: Record<string, string> = {
        'prod_001': 'Myntra',
        'prod_002': 'Ajio',
        'prod_003': 'Flipkart',
        'prod_004': 'TataCliq',
        'prod_005': 'Amazon',
        'prod_006': 'Myntra',
        'prod_007': 'Ajio',
        'prod_008': 'TataCliq',
        'prod_009': 'Flipkart',
        'prod_010': 'Amazon',
      };
      const store = product?.store || mockProductStores[productId] || 'Myntra';
      affiliateUrl = storeAffiliateUrls[store] || 'https://www.myntra.com/';
    }

    // Log the click
    const { error: logError } = await supabase
      .from('affiliate_clicks')
      .insert({
        product_id: productId,
        affiliate_url: affiliateUrl,
        user_agent: userAgent.substring(0, 500),
        ip_address: ipAddress,
        referrer: referrer.substring(0, 500),
      });

    if (logError) {
      console.error('Failed to log click:', logError);
      // Don't fail the redirect, just log the error
    }

    console.log(`Redirecting product ${productId} to ${affiliateUrl}`);

    // Return redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': affiliateUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error in products-redirect:', error);
    // On error, redirect to a safe fallback
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://www.myntra.com/',
      },
    });
  }
});
