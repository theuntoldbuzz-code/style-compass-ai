import { OutfitRecommendation } from "@/types/outfit";

export interface OccasionData {
  id: string;
  title: string;
  subtitle: string;
  icon: "wedding" | "festive" | "office" | "casual" | "winter" | "college" | "party";
  stylingTip: string;
  occasions: string[];
}

export const occasionCategories: OccasionData[] = [
  {
    id: "wedding",
    title: "Wedding Looks",
    subtitle: "Elegant ensembles for the most special celebrations",
    icon: "wedding",
    stylingTip: "For weddings, opt for rich fabrics like silk and velvet. Layer with elegant jewelry and choose colors that complement the wedding theme while ensuring you don't overshadow the couple.",
    occasions: ["wedding"],
  },
  {
    id: "festive",
    title: "Festive Looks",
    subtitle: "Celebrate in style with traditional and contemporary fusion",
    icon: "festive",
    stylingTip: "Festival dressing is about vibrant colors and cultural elements. Mix traditional pieces with modern silhouettes for a fresh take on ethnic wear. Gold accessories always elevate the look.",
    occasions: ["diwali", "christmas"],
  },
  {
    id: "winter-street",
    title: "Winter Street Fashion",
    subtitle: "Stay warm while looking effortlessly cool",
    icon: "winter",
    stylingTip: "Layer strategically with a focus on textures. A well-fitted coat is your statement piece. Add a structured bag and quality boots to elevate any winter outfit instantly.",
    occasions: ["winter"],
  },
  {
    id: "college",
    title: "College Fresh Look",
    subtitle: "Trendy, comfortable, and Instagram-ready",
    icon: "college",
    stylingTip: "Balance comfort with style by investing in quality basics. Sneakers, denim, and layering pieces are your best friends. Add one statement accessory to stand out.",
    occasions: ["casual"],
  },
  {
    id: "office",
    title: "Office Professional Look",
    subtitle: "Command respect with polished workwear",
    icon: "office",
    stylingTip: "Invest in well-tailored pieces in neutral colors. A structured blazer instantly elevates any outfit. Keep accessories minimal but quality - a good watch and leather bag speak volumes.",
    occasions: ["office", "formal"],
  },
  {
    id: "party",
    title: "Party / Date Night",
    subtitle: "Make lasting impressions with stunning evening wear",
    icon: "party",
    stylingTip: "Evening wear is about confidence. Choose one statement piece - whether it's a bold color, luxe fabric, or eye-catching silhouette. Let your outfit do the talking and keep makeup complementary.",
    occasions: ["party", "date-night"],
  },
];

// Men's occasion-specific outfits
export const mensOccasionOutfits: Record<string, OutfitRecommendation[]> = {
  wedding: [
    {
      id: "mw1",
      name: "Royal Wedding Elegance",
      description: "A commanding presence for grand wedding celebrations with timeless sophistication.",
      whyItSuits: "The deep jewel tones create a regal appearance while the tailored fit enhances your silhouette. Gold accents complement your complexion beautifully.",
      colorPalette: ["#1a1a2e", "#d4af37", "#722f37", "#f5f5f5"],
      occasion: ["wedding"],
      season: ["winter", "monsoon"],
      products: [
        {
          id: "mwp1",
          name: "Sherwani Set",
          brand: "Manyavar",
          category: "Traditional",
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
          originalPrice: 24999,
          discountedPrice: 17499,
          discount: 30,
          store: "Manyavar",
          storeUrl: "https://manyavar.com",
          rating: 4.8,
          color: "Navy Blue"
        },
        {
          id: "mwp2",
          name: "Embroidered Stole",
          brand: "FabIndia",
          category: "Accessory",
          imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
          originalPrice: 3999,
          discountedPrice: 2799,
          discount: 30,
          store: "FabIndia",
          storeUrl: "https://fabindia.com",
          rating: 4.5,
          color: "Gold"
        },
        {
          id: "mwp3",
          name: "Mojari Shoes",
          brand: "Metro",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
          originalPrice: 4999,
          discountedPrice: 3499,
          discount: 30,
          store: "Tata CLiQ",
          storeUrl: "https://tatacliq.com",
          rating: 4.4,
          color: "Gold"
        }
      ],
      totalOriginalPrice: 33997,
      totalDiscountedPrice: 23797
    }
  ],
  festive: [
    {
      id: "mf1",
      name: "Diwali Celebration Look",
      description: "A festive ensemble that blends tradition with contemporary style.",
      whyItSuits: "The rich burgundy and gold combination brings out warmth in your complexion. The structured silhouette flatters your frame perfectly.",
      colorPalette: ["#722f37", "#d4af37", "#1a1a1a", "#faf5ef"],
      occasion: ["diwali", "christmas"],
      season: ["winter", "monsoon"],
      products: [
        {
          id: "mfp1",
          name: "Silk Kurta",
          brand: "Manyavar",
          category: "Kurta",
          imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
          originalPrice: 5999,
          discountedPrice: 4199,
          discount: 30,
          store: "Myntra",
          storeUrl: "https://myntra.com",
          rating: 4.6,
          color: "Maroon"
        },
        {
          id: "mfp2",
          name: "Nehru Jacket",
          brand: "Raymond",
          category: "Jacket",
          imageUrl: "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=400&h=500&fit=crop",
          originalPrice: 7999,
          discountedPrice: 5599,
          discount: 30,
          store: "Raymond",
          storeUrl: "https://raymond.in",
          rating: 4.7,
          color: "Gold"
        },
        {
          id: "mfp3",
          name: "Churidar",
          brand: "Soch",
          category: "Pants",
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
          originalPrice: 1999,
          discountedPrice: 1399,
          discount: 30,
          store: "Ajio",
          storeUrl: "https://ajio.com",
          rating: 4.3,
          color: "Black"
        }
      ],
      totalOriginalPrice: 15997,
      totalDiscountedPrice: 11197
    }
  ],
  office: [
    {
      id: "mo1",
      name: "Executive Power Look",
      description: "Command any boardroom with this sophisticated ensemble.",
      whyItSuits: "The classic navy and white combination projects authority while the tailored fit enhances your professional presence.",
      colorPalette: ["#1a365d", "#ffffff", "#2d3748", "#e2e8f0"],
      occasion: ["office", "formal"],
      season: ["summer", "winter", "spring", "monsoon"],
      products: [
        {
          id: "mop1",
          name: "Tailored Suit",
          brand: "Raymond",
          category: "Suit",
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
          originalPrice: 18999,
          discountedPrice: 13299,
          discount: 30,
          store: "Raymond",
          storeUrl: "https://raymond.in",
          rating: 4.8,
          color: "Navy"
        },
        {
          id: "mop2",
          name: "Crisp White Shirt",
          brand: "Van Heusen",
          category: "Shirt",
          imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
          originalPrice: 2999,
          discountedPrice: 2099,
          discount: 30,
          store: "Amazon",
          storeUrl: "https://amazon.in",
          rating: 4.5,
          color: "White"
        },
        {
          id: "mop3",
          name: "Oxford Shoes",
          brand: "Clarks",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop",
          originalPrice: 8999,
          discountedPrice: 6299,
          discount: 30,
          store: "Tata CLiQ",
          storeUrl: "https://tatacliq.com",
          rating: 4.7,
          color: "Black"
        }
      ],
      totalOriginalPrice: 30997,
      totalDiscountedPrice: 21697
    }
  ],
  casual: [
    {
      id: "mc1",
      name: "Campus Cool",
      description: "Effortlessly stylish look for everyday college life.",
      whyItSuits: "The relaxed fit and neutral tones create a laid-back vibe while quality basics ensure you always look put-together.",
      colorPalette: ["#4a5568", "#e2e8f0", "#2d3748", "#ffffff"],
      occasion: ["casual"],
      season: ["summer", "spring"],
      products: [
        {
          id: "mcp1",
          name: "Graphic Tee",
          brand: "Jack & Jones",
          category: "T-Shirt",
          imageUrl: "https://images.unsplash.com/photo-1625910513413-5fc42f9b6e32?w=400&h=500&fit=crop",
          originalPrice: 1499,
          discountedPrice: 999,
          discount: 33,
          store: "Myntra",
          storeUrl: "https://myntra.com",
          rating: 4.3,
          color: "Grey"
        },
        {
          id: "mcp2",
          name: "Slim Fit Jeans",
          brand: "Levis",
          category: "Jeans",
          imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
          originalPrice: 3999,
          discountedPrice: 2799,
          discount: 30,
          store: "Levis",
          storeUrl: "https://levis.in",
          rating: 4.6,
          color: "Blue"
        },
        {
          id: "mcp3",
          name: "White Sneakers",
          brand: "Adidas",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=500&fit=crop",
          originalPrice: 6999,
          discountedPrice: 4899,
          discount: 30,
          store: "Adidas",
          storeUrl: "https://adidas.co.in",
          rating: 4.7,
          color: "White"
        }
      ],
      totalOriginalPrice: 12497,
      totalDiscountedPrice: 8697
    }
  ],
  "winter-street": [
    {
      id: "mws1",
      name: "Urban Winter Style",
      description: "Stay warm while looking sharp on cold city streets.",
      whyItSuits: "The layered look adds dimension while earthy tones complement your natural coloring. The structured outerwear enhances your silhouette.",
      colorPalette: ["#1a1a1a", "#6b5b4f", "#d4c4b5", "#ffffff"],
      occasion: ["casual"],
      season: ["winter"],
      products: [
        {
          id: "mwsp1",
          name: "Wool Overcoat",
          brand: "Zara",
          category: "Coat",
          imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
          originalPrice: 9999,
          discountedPrice: 6999,
          discount: 30,
          store: "Zara",
          storeUrl: "https://zara.com",
          rating: 4.5,
          color: "Camel"
        },
        {
          id: "mwsp2",
          name: "Cashmere Sweater",
          brand: "Marks & Spencer",
          category: "Sweater",
          imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
          originalPrice: 4999,
          discountedPrice: 3499,
          discount: 30,
          store: "M&S",
          storeUrl: "https://marksandspencer.in",
          rating: 4.6,
          color: "Cream"
        },
        {
          id: "mwsp3",
          name: "Chelsea Boots",
          brand: "Clarks",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop",
          originalPrice: 7999,
          discountedPrice: 5599,
          discount: 30,
          store: "Amazon",
          storeUrl: "https://amazon.in",
          rating: 4.7,
          color: "Brown"
        }
      ],
      totalOriginalPrice: 22997,
      totalDiscountedPrice: 16097
    }
  ],
  party: [
    {
      id: "mp1",
      name: "Night Out Sophistication",
      description: "Make a statement at any evening event.",
      whyItSuits: "The dark palette creates mystery while subtle metallic accents add glamour. The fitted silhouette enhances your frame for maximum impact.",
      colorPalette: ["#1a1a1a", "#c41e3a", "#d4af37", "#ffffff"],
      occasion: ["party", "date-night"],
      season: ["winter", "monsoon", "spring"],
      products: [
        {
          id: "mpp1",
          name: "Velvet Blazer",
          brand: "Zara",
          category: "Blazer",
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
          originalPrice: 7999,
          discountedPrice: 5599,
          discount: 30,
          store: "Zara",
          storeUrl: "https://zara.com",
          rating: 4.5,
          color: "Black"
        },
        {
          id: "mpp2",
          name: "Silk Shirt",
          brand: "H&M",
          category: "Shirt",
          imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
          originalPrice: 2999,
          discountedPrice: 2099,
          discount: 30,
          store: "H&M",
          storeUrl: "https://hm.com",
          rating: 4.3,
          color: "Burgundy"
        },
        {
          id: "mpp3",
          name: "Slim Trousers",
          brand: "Arrow",
          category: "Pants",
          imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
          originalPrice: 3999,
          discountedPrice: 2799,
          discount: 30,
          store: "Myntra",
          storeUrl: "https://myntra.com",
          rating: 4.4,
          color: "Black"
        }
      ],
      totalOriginalPrice: 14997,
      totalDiscountedPrice: 10497
    }
  ]
};

// Women's occasion-specific outfits
export const womensOccasionOutfits: Record<string, OutfitRecommendation[]> = {
  wedding: [
    {
      id: "ww1",
      name: "Bridal Party Glamour",
      description: "Stunning ensemble perfect for wedding celebrations.",
      whyItSuits: "The rich jewel tones enhance your natural radiance while the flowing silhouette creates an ethereal effect. Gold embellishments add regal elegance.",
      colorPalette: ["#800020", "#d4af37", "#2e1a47", "#f5f5dc"],
      occasion: ["wedding"],
      season: ["winter", "monsoon"],
      products: [
        {
          id: "wwp1",
          name: "Designer Lehenga",
          brand: "Sabyasachi",
          category: "Lehenga",
          imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
          originalPrice: 45999,
          discountedPrice: 32199,
          discount: 30,
          store: "Pernia's Pop-Up Shop",
          storeUrl: "https://perniaspopupshop.com",
          rating: 4.9,
          color: "Burgundy"
        },
        {
          id: "wwp2",
          name: "Kundan Jewelry Set",
          brand: "Tanishq",
          category: "Jewelry",
          imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
          originalPrice: 25999,
          discountedPrice: 19499,
          discount: 25,
          store: "Tanishq",
          storeUrl: "https://tanishq.co.in",
          rating: 4.8,
          color: "Gold"
        },
        {
          id: "wwp3",
          name: "Embellished Heels",
          brand: "Jimmy Choo",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
          originalPrice: 12999,
          discountedPrice: 9099,
          discount: 30,
          store: "Darveys",
          storeUrl: "https://darveys.com",
          rating: 4.7,
          color: "Gold"
        }
      ],
      totalOriginalPrice: 84997,
      totalDiscountedPrice: 60797
    }
  ],
  festive: [
    {
      id: "wf1",
      name: "Festival Queen",
      description: "Celebrate in style with this stunning ethnic ensemble.",
      whyItSuits: "Vibrant colors complement your warm undertones while the traditional silhouette celebrates your heritage. The intricate details add a touch of royalty.",
      colorPalette: ["#ff6b6b", "#d4af37", "#4a5568", "#ffffff"],
      occasion: ["diwali", "christmas"],
      season: ["winter", "monsoon"],
      products: [
        {
          id: "wfp1",
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
          color: "Red"
        },
        {
          id: "wfp2",
          name: "Statement Jhumkas",
          brand: "Zaveri Pearls",
          category: "Jewelry",
          imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
          originalPrice: 1999,
          discountedPrice: 1399,
          discount: 30,
          store: "Amazon",
          storeUrl: "https://amazon.in",
          rating: 4.4,
          color: "Gold"
        },
        {
          id: "wfp3",
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
      totalOriginalPrice: 14997,
      totalDiscountedPrice: 10497
    }
  ],
  office: [
    {
      id: "wo1",
      name: "Corporate Chic",
      description: "Command respect with sophisticated professional wear.",
      whyItSuits: "The structured silhouette projects confidence while neutral tones create a polished appearance. Quality fabrics ensure all-day comfort.",
      colorPalette: ["#2c3e50", "#ecf0f1", "#bdc3c7", "#e74c3c"],
      occasion: ["office", "formal"],
      season: ["summer", "winter", "spring", "monsoon"],
      products: [
        {
          id: "wop1",
          name: "Tailored Blazer",
          brand: "Zara",
          category: "Blazer",
          imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop",
          originalPrice: 5999,
          discountedPrice: 4199,
          discount: 30,
          store: "Zara",
          storeUrl: "https://zara.com",
          rating: 4.5,
          color: "Navy"
        },
        {
          id: "wop2",
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
          color: "White"
        },
        {
          id: "wop3",
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
          id: "wop4",
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
    }
  ],
  casual: [
    {
      id: "wc1",
      name: "Campus Cutie",
      description: "Trendy and comfortable for everyday college style.",
      whyItSuits: "The relaxed silhouette and soft colors create an approachable, youthful vibe while quality pieces ensure you stand out from the crowd.",
      colorPalette: ["#f8b4b4", "#ffffff", "#87ceeb", "#ffe4c4"],
      occasion: ["casual"],
      season: ["summer", "spring"],
      products: [
        {
          id: "wcp1",
          name: "Crop Top",
          brand: "Forever 21",
          category: "Top",
          imageUrl: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop",
          originalPrice: 999,
          discountedPrice: 699,
          discount: 30,
          store: "Forever 21",
          storeUrl: "https://forever21.in",
          rating: 4.2,
          color: "Pink"
        },
        {
          id: "wcp2",
          name: "Mom Jeans",
          brand: "Levis",
          category: "Jeans",
          imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
          originalPrice: 3999,
          discountedPrice: 2799,
          discount: 30,
          store: "Levis",
          storeUrl: "https://levis.in",
          rating: 4.6,
          color: "Light Blue"
        },
        {
          id: "wcp3",
          name: "Canvas Sneakers",
          brand: "Converse",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop",
          originalPrice: 4999,
          discountedPrice: 3499,
          discount: 30,
          store: "Myntra",
          storeUrl: "https://myntra.com",
          rating: 4.7,
          color: "White"
        }
      ],
      totalOriginalPrice: 9997,
      totalDiscountedPrice: 6997
    }
  ],
  "winter-street": [
    {
      id: "wws1",
      name: "Cozy Chic Winter",
      description: "Layer up in style for cold city streets.",
      whyItSuits: "Warm earth tones complement your complexion while the layered silhouette adds visual interest. Quality outerwear becomes your statement piece.",
      colorPalette: ["#5c4033", "#d4c4b5", "#1a1a1a", "#ffffff"],
      occasion: ["casual"],
      season: ["winter"],
      products: [
        {
          id: "wwsp1",
          name: "Teddy Coat",
          brand: "Mango",
          category: "Coat",
          imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
          originalPrice: 8999,
          discountedPrice: 6299,
          discount: 30,
          store: "Mango",
          storeUrl: "https://mango.com",
          rating: 4.5,
          color: "Camel"
        },
        {
          id: "wwsp2",
          name: "Knit Sweater Dress",
          brand: "H&M",
          category: "Dress",
          imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
          originalPrice: 2999,
          discountedPrice: 2099,
          discount: 30,
          store: "H&M",
          storeUrl: "https://hm.com",
          rating: 4.3,
          color: "Cream"
        },
        {
          id: "wwsp3",
          name: "Knee-High Boots",
          brand: "Dune",
          category: "Shoes",
          imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop",
          originalPrice: 9999,
          discountedPrice: 6999,
          discount: 30,
          store: "Dune",
          storeUrl: "https://dunelondon.com",
          rating: 4.6,
          color: "Black"
        }
      ],
      totalOriginalPrice: 21997,
      totalDiscountedPrice: 15397
    }
  ],
  party: [
    {
      id: "wp1",
      name: "Date Night Diva",
      description: "Turn heads at any evening event.",
      whyItSuits: "The fitted silhouette highlights your figure while deep colors create an air of sophistication. Strategic details draw attention to your best features.",
      colorPalette: ["#1c1c1c", "#c41e3a", "#d4af37", "#ffffff"],
      occasion: ["party", "date-night"],
      season: ["winter", "monsoon", "spring"],
      products: [
        {
          id: "wpp1",
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
          id: "wpp2",
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
          id: "wpp3",
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
          id: "wpp4",
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
  ]
};

export const getOccasionOutfits = (gender: string, occasionId: string): OutfitRecommendation[] => {
  const outfits = gender === "female" ? womensOccasionOutfits : mensOccasionOutfits;
  return outfits[occasionId] || [];
};
