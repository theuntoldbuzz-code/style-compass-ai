import { OutfitRecommendation } from "@/types/outfit";

export const mockOutfits: OutfitRecommendation[] = [
  {
    id: "1",
    name: "Elegant Evening Ensemble",
    description: "A sophisticated look perfect for formal occasions with a modern twist.",
    whyItSuits: "The deep navy tones complement your warm undertones beautifully, while the structured silhouette enhances your frame. The gold accents add a touch of luxury that matches your skin's natural glow.",
    colorPalette: ["#1a365d", "#d4af37", "#2d3748", "#f7fafc"],
    products: [
      {
        id: "p1",
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
        id: "p2",
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
        id: "p3",
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
        id: "p4",
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
    id: "2",
    name: "Smart Casual Excellence",
    description: "The perfect blend of comfort and style for your everyday professional life.",
    whyItSuits: "Earth tones work wonderfully with your complexion, creating a harmonious look. The relaxed fit provides comfort while maintaining a polished appearance ideal for your body type.",
    colorPalette: ["#4a5568", "#2d3748", "#718096", "#e2e8f0"],
    products: [
      {
        id: "p5",
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
        id: "p6",
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
        id: "p7",
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
        id: "p8",
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
    id: "3",
    name: "Festival Ready Traditional",
    description: "A stunning ethnic ensemble that celebrates tradition with contemporary elegance.",
    whyItSuits: "The rich burgundy and gold combination brings out the warmth in your skin tone while the classic silhouette flatters your frame. Perfect for making a memorable impression at festive gatherings.",
    colorPalette: ["#722f37", "#d4af37", "#1a1a1a", "#faf5ef"],
    products: [
      {
        id: "p9",
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
        id: "p10",
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
        id: "p11",
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
        id: "p12",
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
  }
];
