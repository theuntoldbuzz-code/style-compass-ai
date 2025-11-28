import { OutfitRecommendation } from "@/types/outfit";

// Men's Outfits
export const mensOutfits: OutfitRecommendation[] = [
  {
    id: "m1",
    name: "Elegant Evening Ensemble",
    description: "A sophisticated look perfect for formal occasions with a modern twist.",
    whyItSuits: "The deep navy tones complement your warm undertones beautifully, while the structured silhouette enhances your frame. The gold accents add a touch of luxury that matches your skin's natural glow.",
    colorPalette: ["#1a365d", "#d4af37", "#2d3748", "#f7fafc"],
    occasion: ["wedding", "formal", "party"],
    season: ["winter", "monsoon"],
    products: [
      {
        id: "mp1",
        name: "Premium Navy Blazer",
        brand: "Raymond",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
        originalPrice: 12999,
        discountedPrice: 8999,
        discount: 31,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.5,
        color: "Navy Blue"
      },
      {
        id: "mp2",
        name: "Slim Fit White Shirt",
        brand: "Van Heusen",
        category: "Shirt",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
        originalPrice: 2499,
        discountedPrice: 1799,
        discount: 28,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.3,
        color: "White"
      },
      {
        id: "mp3",
        name: "Charcoal Formal Trousers",
        brand: "Arrow",
        category: "Pants",
        imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
        originalPrice: 3999,
        discountedPrice: 2799,
        discount: 30,
        store: "Ajio",
        storeUrl: "https://ajio.com",
        rating: 4.4,
        color: "Charcoal"
      },
      {
        id: "mp4",
        name: "Oxford Leather Shoes",
        brand: "Clarks",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 6499,
        discount: 28,
        store: "Tata CLiQ",
        storeUrl: "https://tatacliq.com",
        rating: 4.6,
        color: "Brown"
      }
    ],
    totalOriginalPrice: 28496,
    totalDiscountedPrice: 20096
  },
  {
    id: "m2",
    name: "Smart Casual Excellence",
    description: "The perfect blend of comfort and style for your everyday professional life.",
    whyItSuits: "Earth tones work wonderfully with your complexion, creating a harmonious look. The relaxed fit provides comfort while maintaining a polished appearance ideal for your body type.",
    colorPalette: ["#4a5568", "#2d3748", "#718096", "#e2e8f0"],
    occasion: ["office", "casual", "date-night"],
    season: ["summer", "spring"],
    products: [
      {
        id: "mp5",
        name: "Cotton Polo T-Shirt",
        brand: "U.S. Polo Assn.",
        category: "T-Shirt",
        imageUrl: "https://images.unsplash.com/photo-1625910513413-5fc42f9b6e32?w=400&h=500&fit=crop",
        originalPrice: 2299,
        discountedPrice: 1499,
        discount: 35,
        store: "Flipkart",
        storeUrl: "https://flipkart.com",
        rating: 4.2,
        color: "Olive"
      },
      {
        id: "mp6",
        name: "Stretch Chinos",
        brand: "H&M",
        category: "Pants",
        imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
        originalPrice: 1999,
        discountedPrice: 1299,
        discount: 35,
        store: "H&M",
        storeUrl: "https://hm.com",
        rating: 4.1,
        color: "Khaki"
      },
      {
        id: "mp7",
        name: "Leather Belt",
        brand: "Hidesign",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=500&fit=crop",
        originalPrice: 1999,
        discountedPrice: 1399,
        discount: 30,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.5,
        color: "Tan"
      },
      {
        id: "mp8",
        name: "White Sneakers",
        brand: "Adidas",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=500&fit=crop",
        originalPrice: 6999,
        discountedPrice: 4999,
        discount: 29,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.7,
        color: "White"
      }
    ],
    totalOriginalPrice: 13296,
    totalDiscountedPrice: 9196
  },
  {
    id: "m3",
    name: "Festival Ready Traditional",
    description: "A stunning ethnic ensemble that celebrates tradition with contemporary elegance.",
    whyItSuits: "The rich burgundy and gold combination brings out the warmth in your skin tone while the classic silhouette flatters your frame. Perfect for making a memorable impression at festive gatherings.",
    colorPalette: ["#722f37", "#d4af37", "#1a1a1a", "#faf5ef"],
    occasion: ["wedding", "diwali", "party", "christmas"],
    season: ["winter", "monsoon"],
    products: [
      {
        id: "mp9",
        name: "Silk Kurta Set",
        brand: "Manyavar",
        category: "Kurta",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 6299,
        discount: 30,
        store: "Manyavar",
        storeUrl: "https://manyavar.com",
        rating: 4.6,
        color: "Maroon"
      },
      {
        id: "mp10",
        name: "Embroidered Nehru Jacket",
        brand: "FabIndia",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=400&h=500&fit=crop",
        originalPrice: 5999,
        discountedPrice: 4199,
        discount: 30,
        store: "FabIndia",
        storeUrl: "https://fabindia.com",
        rating: 4.4,
        color: "Gold"
      },
      {
        id: "mp11",
        name: "Churidar Pants",
        brand: "Soch",
        category: "Pants",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
        originalPrice: 1499,
        discountedPrice: 999,
        discount: 33,
        store: "Ajio",
        storeUrl: "https://ajio.com",
        rating: 4.2,
        color: "Black"
      },
      {
        id: "mp12",
        name: "Mojari Shoes",
        brand: "Metro",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
        originalPrice: 2999,
        discountedPrice: 1999,
        discount: 33,
        store: "Tata CLiQ",
        storeUrl: "https://tatacliq.com",
        rating: 4.3,
        color: "Gold"
      }
    ],
    totalOriginalPrice: 19496,
    totalDiscountedPrice: 13496
  },
  {
    id: "m4",
    name: "Summer Breeze Casual",
    description: "Light and breathable summer wear that keeps you cool and stylish.",
    whyItSuits: "Pastel shades and light fabrics complement warmer skin tones excellently while keeping you comfortable in the heat. The relaxed fit works great for all body types.",
    colorPalette: ["#87CEEB", "#F5F5DC", "#E0E0E0", "#FFFFFF"],
    occasion: ["casual", "date-night", "party"],
    season: ["summer", "spring"],
    products: [
      {
        id: "mp13",
        name: "Linen Shirt",
        brand: "Marks & Spencer",
        category: "Shirt",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
        originalPrice: 3499,
        discountedPrice: 2449,
        discount: 30,
        store: "M&S",
        storeUrl: "https://marksandspencer.in",
        rating: 4.4,
        color: "Sky Blue"
      },
      {
        id: "mp14",
        name: "Cotton Shorts",
        brand: "Gap",
        category: "Shorts",
        imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop",
        originalPrice: 2499,
        discountedPrice: 1749,
        discount: 30,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.2,
        color: "Beige"
      },
      {
        id: "mp15",
        name: "Canvas Slip-ons",
        brand: "Vans",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop",
        originalPrice: 4999,
        discountedPrice: 3499,
        discount: 30,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.6,
        color: "White"
      },
      {
        id: "mp16",
        name: "Aviator Sunglasses",
        brand: "Ray-Ban",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop",
        originalPrice: 7999,
        discountedPrice: 5999,
        discount: 25,
        store: "Lenskart",
        storeUrl: "https://lenskart.com",
        rating: 4.8,
        color: "Gold"
      }
    ],
    totalOriginalPrice: 18996,
    totalDiscountedPrice: 13696
  }
];

// Women's Outfits
export const womensOutfits: OutfitRecommendation[] = [
  {
    id: "w1",
    name: "Elegant Office Chic",
    description: "A sophisticated look that commands respect in the boardroom.",
    whyItSuits: "The structured blazer accentuates your frame while the neutral tones complement your skin beautifully. This ensemble projects confidence and professionalism.",
    colorPalette: ["#2C3E50", "#ECF0F1", "#BDC3C7", "#E74C3C"],
    occasion: ["office", "formal", "casual"],
    season: ["winter", "monsoon", "spring"],
    products: [
      {
        id: "wp1",
        name: "Tailored Blazer",
        brand: "Zara",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop",
        originalPrice: 5999,
        discountedPrice: 4199,
        discount: 30,
        store: "Zara",
        storeUrl: "https://zara.com",
        rating: 4.5,
        color: "Charcoal"
      },
      {
        id: "wp2",
        name: "Silk Blouse",
        brand: "Vero Moda",
        category: "Top",
        imageUrl: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
        originalPrice: 2999,
        discountedPrice: 2099,
        discount: 30,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.3,
        color: "Ivory"
      },
      {
        id: "wp3",
        name: "High-Waist Trousers",
        brand: "H&M",
        category: "Pants",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        originalPrice: 2499,
        discountedPrice: 1749,
        discount: 30,
        store: "H&M",
        storeUrl: "https://hm.com",
        rating: 4.2,
        color: "Black"
      },
      {
        id: "wp4",
        name: "Block Heels",
        brand: "Steve Madden",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
        originalPrice: 6999,
        discountedPrice: 4899,
        discount: 30,
        store: "Tata CLiQ",
        storeUrl: "https://tatacliq.com",
        rating: 4.4,
        color: "Nude"
      }
    ],
    totalOriginalPrice: 18496,
    totalDiscountedPrice: 12946
  },
  {
    id: "w2",
    name: "Festive Ethnic Glamour",
    description: "A stunning traditional ensemble perfect for celebrations and festivals.",
    whyItSuits: "The rich jewel tones enhance your natural glow while the intricate embroidery adds a touch of royal elegance. Perfect for making a statement at any celebration.",
    colorPalette: ["#800020", "#D4AF37", "#2E1A47", "#F5F5DC"],
    occasion: ["wedding", "diwali", "party", "christmas"],
    season: ["winter", "monsoon"],
    products: [
      {
        id: "wp5",
        name: "Embroidered Anarkali",
        brand: "Biba",
        category: "Dress",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 6299,
        discount: 30,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.6,
        color: "Burgundy"
      },
      {
        id: "wp6",
        name: "Dupatta with Gold Border",
        brand: "FabIndia",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
        originalPrice: 2499,
        discountedPrice: 1749,
        discount: 30,
        store: "FabIndia",
        storeUrl: "https://fabindia.com",
        rating: 4.4,
        color: "Gold"
      },
      {
        id: "wp7",
        name: "Kundan Jewelry Set",
        brand: "Tanishq",
        category: "Jewelry",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
        originalPrice: 15999,
        discountedPrice: 11999,
        discount: 25,
        store: "Tanishq",
        storeUrl: "https://tanishq.co.in",
        rating: 4.8,
        color: "Gold"
      },
      {
        id: "wp8",
        name: "Embellished Juttis",
        brand: "Fizzy Goblet",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
        originalPrice: 3999,
        discountedPrice: 2799,
        discount: 30,
        store: "Ajio",
        storeUrl: "https://ajio.com",
        rating: 4.5,
        color: "Gold"
      }
    ],
    totalOriginalPrice: 31496,
    totalDiscountedPrice: 22846
  },
  {
    id: "w3",
    name: "Casual Weekend Vibes",
    description: "Effortlessly stylish look for brunches and weekend outings.",
    whyItSuits: "The relaxed silhouette and soft colors create a flattering, approachable look. Perfect for your body type and skin tone, this ensemble keeps you comfortable yet fashionable.",
    colorPalette: ["#F8B4B4", "#FFFFFF", "#87CEEB", "#FFE4C4"],
    occasion: ["casual", "date-night", "party"],
    season: ["summer", "spring"],
    products: [
      {
        id: "wp9",
        name: "Floral Midi Dress",
        brand: "Forever 21",
        category: "Dress",
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
        originalPrice: 2999,
        discountedPrice: 2099,
        discount: 30,
        store: "Forever 21",
        storeUrl: "https://forever21.in",
        rating: 4.2,
        color: "Floral Pink"
      },
      {
        id: "wp10",
        name: "Denim Jacket",
        brand: "Levi's",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=500&fit=crop",
        originalPrice: 4999,
        discountedPrice: 3499,
        discount: 30,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.6,
        color: "Light Blue"
      },
      {
        id: "wp11",
        name: "White Sneakers",
        brand: "Nike",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop",
        originalPrice: 7999,
        discountedPrice: 5999,
        discount: 25,
        store: "Nike",
        storeUrl: "https://nike.com",
        rating: 4.7,
        color: "White"
      },
      {
        id: "wp12",
        name: "Crossbody Bag",
        brand: "Accessorize",
        category: "Bag",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
        originalPrice: 2999,
        discountedPrice: 2099,
        discount: 30,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.3,
        color: "Tan"
      }
    ],
    totalOriginalPrice: 18996,
    totalDiscountedPrice: 13696
  },
  {
    id: "w4",
    name: "Date Night Elegance",
    description: "A romantic and sophisticated look for special evenings.",
    whyItSuits: "The fitted silhouette highlights your best features while the deep colors create an air of mystery and allure. Perfect for making lasting impressions.",
    colorPalette: ["#1C1C1C", "#C41E3A", "#D4AF37", "#FFFFFF"],
    occasion: ["date-night", "party", "formal"],
    season: ["winter", "monsoon", "spring"],
    products: [
      {
        id: "wp13",
        name: "Satin Slip Dress",
        brand: "Mango",
        category: "Dress",
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
        originalPrice: 5999,
        discountedPrice: 4199,
        discount: 30,
        store: "Mango",
        storeUrl: "https://mango.com",
        rating: 4.5,
        color: "Black"
      },
      {
        id: "wp14",
        name: "Statement Earrings",
        brand: "Swarovski",
        category: "Jewelry",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 6299,
        discount: 30,
        store: "Swarovski",
        storeUrl: "https://swarovski.com",
        rating: 4.7,
        color: "Crystal"
      },
      {
        id: "wp15",
        name: "Stiletto Heels",
        brand: "Aldo",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
        originalPrice: 7999,
        discountedPrice: 5599,
        discount: 30,
        store: "Aldo",
        storeUrl: "https://aldoshoes.in",
        rating: 4.4,
        color: "Red"
      },
      {
        id: "wp16",
        name: "Clutch Purse",
        brand: "Charles & Keith",
        category: "Bag",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop",
        originalPrice: 3999,
        discountedPrice: 2799,
        discount: 30,
        store: "Charles & Keith",
        storeUrl: "https://charleskeith.in",
        rating: 4.5,
        color: "Gold"
      }
    ],
    totalOriginalPrice: 26996,
    totalDiscountedPrice: 18896
  }
];

// Function to get recommendations based on profile
export const getRecommendations = (profile: {
  gender: string;
  occasion: string;
  season: string;
  budgetMax: number;
  skinTone: string;
}): OutfitRecommendation[] => {
  const baseOutfits = profile.gender === "female" ? womensOutfits : mensOutfits;
  
  // Filter by occasion and season
  let filtered = baseOutfits.filter(outfit => {
    const matchesOccasion = outfit.occasion?.includes(profile.occasion) ?? true;
    const matchesSeason = outfit.season?.includes(profile.season) ?? true;
    const matchesBudget = outfit.totalDiscountedPrice <= profile.budgetMax;
    return matchesBudget && (matchesOccasion || matchesSeason);
  });
  
  // If no exact matches, return all that fit budget
  if (filtered.length === 0) {
    filtered = baseOutfits.filter(outfit => outfit.totalDiscountedPrice <= profile.budgetMax);
  }
  
  // If still empty, return all outfits
  if (filtered.length === 0) {
    filtered = baseOutfits;
  }
  
  // Customize "why it suits you" based on skin tone
  return filtered.map(outfit => {
    let customizedWhy = outfit.whyItSuits;
    
    if (profile.skinTone === "fair" || profile.skinTone === "light") {
      customizedWhy = customizedWhy.replace("warm undertones", "cool undertones").replace("warmth in your skin tone", "natural radiance");
    } else if (profile.skinTone === "medium" || profile.skinTone === "olive") {
      customizedWhy = customizedWhy.replace("warm undertones", "golden undertones");
    } else if (profile.skinTone === "tan" || profile.skinTone === "brown" || profile.skinTone === "dark") {
      customizedWhy = customizedWhy.replace("warm undertones", "rich undertones").replace("natural glow", "beautiful depth");
    }
    
    return { ...outfit, whyItSuits: customizedWhy };
  });
};

// Legacy export for backward compatibility
export const mockOutfits = mensOutfits;
