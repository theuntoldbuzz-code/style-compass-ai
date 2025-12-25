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

// Input validation constants
const MAX_BUDGET = 1000000; // 10 lakh rupees
const MIN_BUDGET = 0;
const VALID_OCCASIONS = ['office', 'casual', 'formal', 'wedding', 'festive', 'party', 'date-night', 'brunch', 'traditional', 'college', 'weekend', 'club', 'winter', 'all'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Validate and sanitize budget
function validateBudget(value: unknown, defaultValue: number): number {
  if (value === undefined || value === null) return defaultValue;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return defaultValue;
  return Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, Math.floor(num)));
}

// Validate occasion
function validateOccasion(value: unknown): string {
  if (typeof value !== 'string') return 'all';
  const normalized = value.toLowerCase().trim();
  if (normalized.length > 50) return 'all';
  if (!VALID_OCCASIONS.includes(normalized)) return 'all';
  return normalized;
}

// Validate UUID
function validateUUID(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!UUID_PATTERN.test(trimmed)) return null;
  return trimmed;
}

// Mock product data (would come from CSV/database in production)
const mockProducts = [
  {
    product_id: 'prod_001',
    name: 'Classic Navy Blazer',
    brand: 'Raymond',
    category: 'Outerwear',
    price: 8999,
    discounted_price: 6499,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    affiliate_url: 'https://www.myntra.com/blazers',
    store: 'Myntra',
    color: 'Navy',
    occasion: ['office', 'formal', 'wedding'],
    body_types: ['rectangle', 'inverted-triangle', 'hourglass'],
    rating: 4.5,
  },
  {
    product_id: 'prod_002',
    name: 'Slim Fit White Shirt',
    brand: 'Van Heusen',
    category: 'Shirts',
    price: 2499,
    discounted_price: 1799,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    affiliate_url: 'https://www.ajio.com/shirts',
    store: 'Ajio',
    color: 'White',
    occasion: ['office', 'formal', 'casual'],
    body_types: ['all'],
    rating: 4.3,
  },
  {
    product_id: 'prod_003',
    name: 'High-Waist Pleated Trousers',
    brand: 'H&M',
    category: 'Trousers',
    price: 2999,
    discounted_price: 1999,
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    affiliate_url: 'https://www.flipkart.com/trousers',
    store: 'Flipkart',
    color: 'Beige',
    occasion: ['office', 'casual', 'brunch'],
    body_types: ['pear', 'hourglass', 'apple'],
    rating: 4.1,
  },
  {
    product_id: 'prod_004',
    name: 'Embroidered Silk Kurta',
    brand: 'FabIndia',
    category: 'Ethnic',
    price: 4500,
    discounted_price: 3600,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
    affiliate_url: 'https://www.tatacliq.com/ethnic',
    store: 'TataCliq',
    color: 'Maroon',
    occasion: ['festive', 'wedding', 'traditional'],
    body_types: ['all'],
    rating: 4.7,
  },
  {
    product_id: 'prod_005',
    name: 'Leather Oxford Shoes',
    brand: 'Clarks',
    category: 'Footwear',
    price: 7999,
    discounted_price: 5999,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400',
    affiliate_url: 'https://www.amazon.in/shoes',
    store: 'Amazon',
    color: 'Brown',
    occasion: ['office', 'formal', 'wedding'],
    body_types: ['all'],
    rating: 4.6,
  },
  {
    product_id: 'prod_006',
    name: 'Floral Maxi Dress',
    brand: 'Zara',
    category: 'Dresses',
    price: 5999,
    discounted_price: 4199,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    affiliate_url: 'https://www.myntra.com/dresses',
    store: 'Myntra',
    color: 'Multicolor',
    occasion: ['casual', 'brunch', 'party'],
    body_types: ['hourglass', 'pear', 'rectangle'],
    rating: 4.4,
  },
  {
    product_id: 'prod_007',
    name: 'Cashmere Sweater',
    brand: 'Marks & Spencer',
    category: 'Knitwear',
    price: 6999,
    discounted_price: 4899,
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
    affiliate_url: 'https://www.ajio.com/sweaters',
    store: 'Ajio',
    color: 'Charcoal',
    occasion: ['casual', 'winter', 'office'],
    body_types: ['all'],
    rating: 4.5,
  },
  {
    product_id: 'prod_008',
    name: 'Statement Gold Earrings',
    brand: 'Tanishq',
    category: 'Accessories',
    price: 15000,
    discounted_price: 12500,
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    affiliate_url: 'https://www.tatacliq.com/jewellery',
    store: 'TataCliq',
    color: 'Gold',
    occasion: ['festive', 'wedding', 'party'],
    body_types: ['all'],
    rating: 4.8,
  },
  {
    product_id: 'prod_009',
    name: 'Denim Jacket',
    brand: 'Levi\'s',
    category: 'Outerwear',
    price: 4999,
    discounted_price: 3499,
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
    affiliate_url: 'https://www.flipkart.com/jackets',
    store: 'Flipkart',
    color: 'Blue',
    occasion: ['casual', 'college', 'weekend'],
    body_types: ['rectangle', 'pear', 'inverted-triangle'],
    rating: 4.4,
  },
  {
    product_id: 'prod_010',
    name: 'Sequin Party Top',
    brand: 'Forever 21',
    category: 'Tops',
    price: 1999,
    discounted_price: 999,
    image_url: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400',
    affiliate_url: 'https://www.amazon.in/tops',
    store: 'Amazon',
    color: 'Black',
    occasion: ['party', 'date-night', 'club'],
    body_types: ['all'],
    rating: 4.2,
  },
];

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

    const body = await req.json();
    
    // Validate and sanitize all inputs
    const photo_id = validateUUID(body.photo_id);
    const budget_min = validateBudget(body.budget_min, 0);
    const budget_max = validateBudget(body.budget_max, 50000);
    const occasion = validateOccasion(body.occasion);

    console.log(`Generating recommendations - photo_id: ${photo_id}, budget: ${budget_min}-${budget_max}, occasion: ${occasion}`);

    // Get photo analysis if photo_id provided (uses parameterized query via Supabase client)
    let userAnalysis = null;
    if (photo_id) {
      const { data } = await supabase
        .from('photo_analyses')
        .select('*')
        .eq('photo_id', photo_id)
        .maybeSingle();
      userAnalysis = data;
    }

    // First try to get products from database (uses parameterized query via Supabase client)
    let { data: dbProducts } = await supabase
      .from('products_catalog')
      .select('*')
      .gte('discounted_price', budget_min)
      .lte('discounted_price', budget_max);

    // Use mock products if database is empty
    let products = dbProducts && dbProducts.length > 0 ? dbProducts : mockProducts;

    // Filter by budget
    products = products.filter((p: any) => {
      const price = p.discounted_price || p.price;
      return price >= budget_min && price <= budget_max;
    });

    // Filter by occasion if specified
    if (occasion && occasion !== 'all') {
      products = products.filter((p: any) => {
        const occasions = p.occasion || [];
        return occasions.includes(occasion.toLowerCase());
      });
    }

    // Filter by body type if analysis available
    if (userAnalysis?.body_type) {
      products = products.filter((p: any) => {
        const bodyTypes = p.body_types || ['all'];
        return bodyTypes.includes('all') || bodyTypes.includes(userAnalysis.body_type);
      });
    }

    // Sort by rating and discount
    products.sort((a: any, b: any) => {
      const discountA = ((a.price - a.discounted_price) / a.price) * 100;
      const discountB = ((b.price - b.discounted_price) / b.price) * 100;
      return (b.rating || 0) + discountB / 10 - ((a.rating || 0) + discountA / 10);
    });

    // Limit results
    const recommendations = products.slice(0, 12).map((p: any) => ({
      product_id: p.product_id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      original_price: p.price,
      discounted_price: p.discounted_price,
      discount_percent: Math.round(((p.price - p.discounted_price) / p.price) * 100),
      image_url: p.image_url,
      store: p.store,
      rating: p.rating,
      color: p.color,
      redirect_url: `${supabaseUrl}/functions/v1/products-redirect?product_id=${encodeURIComponent(p.product_id)}`,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        photo_id: photo_id || null,
        filters: {
          budget_min,
          budget_max,
          occasion,
          body_type: userAnalysis?.body_type || null,
        },
        total_results: recommendations.length,
        products: recommendations,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: 'An error occurred processing recommendations' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
