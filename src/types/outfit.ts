export interface UserProfile {
  photo?: File | null;
  gender: string;
  skinTone: string;
  hairColor: string;
  bodyType: string;
  occasion: string;
  season: string;
  budgetMin: number;
  budgetMax: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  store: string;
  storeUrl: string;
  rating: number;
  color: string;
}

export interface OutfitRecommendation {
  id: string;
  name: string;
  description: string;
  whyItSuits: string;
  colorPalette: string[];
  products: Product[];
  totalOriginalPrice: number;
  totalDiscountedPrice: number;
}
