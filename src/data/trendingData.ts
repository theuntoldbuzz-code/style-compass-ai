import { Product } from "@/types/outfit";

export interface TrendingCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  products: Product[];
}

export const trendingCategories: TrendingCategory[] = [
  {
    id: "top-trending",
    title: "Top Trending in India Today",
    subtitle: "What's hot right now",
    icon: "flame",
    products: [
      {
        id: "t1",
        name: "Oversized Blazer",
        brand: "Zara",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop",
        originalPrice: 5999,
        discountedPrice: 3999,
        discount: 33,
        store: "Zara",
        storeUrl: "https://zara.com",
        rating: 4.7,
        color: "Camel"
      },
      {
        id: "t2",
        name: "Pleated Wide Leg Pants",
        brand: "H&M",
        category: "Pants",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
        originalPrice: 2499,
        discountedPrice: 1499,
        discount: 40,
        store: "H&M",
        storeUrl: "https://hm.com",
        rating: 4.5,
        color: "Beige"
      },
      {
        id: "t3",
        name: "Chunky Gold Chain",
        brand: "Accessorize",
        category: "Jewelry",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
        originalPrice: 1999,
        discountedPrice: 1299,
        discount: 35,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.6,
        color: "Gold"
      },
      {
        id: "t4",
        name: "Mesh Sneakers",
        brand: "Nike",
        category: "Shoes",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 5999,
        discount: 33,
        store: "Nike",
        storeUrl: "https://nike.com",
        rating: 4.8,
        color: "White/Grey"
      }
    ]
  },
  {
    id: "under-999",
    title: "Most Bought Under ₹999",
    subtitle: "Budget-friendly favorites",
    icon: "wallet",
    products: [
      {
        id: "b1",
        name: "Cotton T-Shirt",
        brand: "H&M",
        category: "T-Shirt",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        originalPrice: 999,
        discountedPrice: 599,
        discount: 40,
        store: "H&M",
        storeUrl: "https://hm.com",
        rating: 4.3,
        color: "White"
      },
      {
        id: "b2",
        name: "Hair Scrunchies Set",
        brand: "Accessorize",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=400&h=500&fit=crop",
        originalPrice: 499,
        discountedPrice: 299,
        discount: 40,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.4,
        color: "Multicolor"
      },
      {
        id: "b3",
        name: "Canvas Belt",
        brand: "Roadster",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=500&fit=crop",
        originalPrice: 799,
        discountedPrice: 449,
        discount: 44,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.2,
        color: "Brown"
      },
      {
        id: "b4",
        name: "Printed Scarf",
        brand: "FabIndia",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
        originalPrice: 899,
        discountedPrice: 599,
        discount: 33,
        store: "FabIndia",
        storeUrl: "https://fabindia.com",
        rating: 4.5,
        color: "Blue"
      }
    ]
  },
  {
    id: "best-discounts",
    title: "Best Discounted Items Right Now",
    subtitle: "Grab before they're gone",
    icon: "tag",
    products: [
      {
        id: "d1",
        name: "Leather Jacket",
        brand: "Pepe Jeans",
        category: "Jacket",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        originalPrice: 12999,
        discountedPrice: 5999,
        discount: 54,
        store: "Ajio",
        storeUrl: "https://ajio.com",
        rating: 4.6,
        color: "Black"
      },
      {
        id: "d2",
        name: "Designer Sunglasses",
        brand: "Ray-Ban",
        category: "Accessory",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop",
        originalPrice: 9999,
        discountedPrice: 4999,
        discount: 50,
        store: "Lenskart",
        storeUrl: "https://lenskart.com",
        rating: 4.8,
        color: "Black"
      },
      {
        id: "d3",
        name: "Silk Saree",
        brand: "Sabyasachi",
        category: "Saree",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
        originalPrice: 15999,
        discountedPrice: 7999,
        discount: 50,
        store: "Myntra",
        storeUrl: "https://myntra.com",
        rating: 4.9,
        color: "Red"
      },
      {
        id: "d4",
        name: "Premium Watch",
        brand: "Fossil",
        category: "Watch",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
        originalPrice: 8999,
        discountedPrice: 3999,
        discount: 56,
        store: "Amazon",
        storeUrl: "https://amazon.in",
        rating: 4.7,
        color: "Silver"
      }
    ]
  }
];

// Infinite scroll products - combination of all products for continuous feed
export const infiniteScrollProducts: Product[] = [
  ...trendingCategories[0].products,
  ...trendingCategories[1].products,
  ...trendingCategories[2].products,
  {
    id: "inf1",
    name: "Bohemian Maxi Dress",
    brand: "Global Desi",
    category: "Dress",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
    originalPrice: 4999,
    discountedPrice: 2999,
    discount: 40,
    store: "Myntra",
    storeUrl: "https://myntra.com",
    rating: 4.5,
    color: "Floral"
  },
  {
    id: "inf2",
    name: "Linen Blazer",
    brand: "Marks & Spencer",
    category: "Jacket",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    originalPrice: 6999,
    discountedPrice: 4599,
    discount: 34,
    store: "M&S",
    storeUrl: "https://marksandspencer.in",
    rating: 4.6,
    color: "Navy"
  },
  {
    id: "inf3",
    name: "Embroidered Kurti",
    brand: "W",
    category: "Top",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
    originalPrice: 2499,
    discountedPrice: 1499,
    discount: 40,
    store: "Ajio",
    storeUrl: "https://ajio.com",
    rating: 4.4,
    color: "Teal"
  },
  {
    id: "inf4",
    name: "Slim Fit Jeans",
    brand: "Levi's",
    category: "Pants",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    originalPrice: 3999,
    discountedPrice: 2399,
    discount: 40,
    store: "Levi's",
    storeUrl: "https://levis.in",
    rating: 4.7,
    color: "Dark Blue"
  },
  {
    id: "inf5",
    name: "Statement Earrings",
    brand: "Tanishq",
    category: "Jewelry",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    originalPrice: 5999,
    discountedPrice: 3999,
    discount: 33,
    store: "Tanishq",
    storeUrl: "https://tanishq.co.in",
    rating: 4.8,
    color: "Gold"
  },
  {
    id: "inf6",
    name: "Printed Palazzo",
    brand: "Biba",
    category: "Pants",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    originalPrice: 1999,
    discountedPrice: 1199,
    discount: 40,
    store: "Myntra",
    storeUrl: "https://myntra.com",
    rating: 4.3,
    color: "Multicolor"
  },
  {
    id: "inf7",
    name: "Crossbody Sling Bag",
    brand: "Baggit",
    category: "Bag",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    originalPrice: 2999,
    discountedPrice: 1799,
    discount: 40,
    store: "Amazon",
    storeUrl: "https://amazon.in",
    rating: 4.4,
    color: "Tan"
  },
  {
    id: "inf8",
    name: "Formal Oxford Shoes",
    brand: "Clarks",
    category: "Shoes",
    imageUrl: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop",
    originalPrice: 7999,
    discountedPrice: 4999,
    discount: 38,
    store: "Tata CLiQ",
    storeUrl: "https://tatacliq.com",
    rating: 4.6,
    color: "Brown"
  }
];
