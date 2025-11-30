import { Palette, Check, X, Sparkles, Watch, Gem, ShoppingBag } from "lucide-react";

interface ColorPaletteProps {
  skinTone?: string;
  season?: string;
}

// Color recommendations based on skin tone
const colorRecommendations: Record<string, {
  bestColors: { name: string; hex: string }[];
  avoidColors: { name: string; hex: string }[];
  accessories: { name: string; color: string; icon: string }[];
}> = {
  fair: {
    bestColors: [
      { name: "Soft Pink", hex: "#F8B4B4" },
      { name: "Lavender", hex: "#C4B5E0" },
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Mint Green", hex: "#98FB98" },
      { name: "Peach", hex: "#FFDAB9" },
      { name: "Dusty Rose", hex: "#D4A5A5" },
      { name: "Powder Blue", hex: "#B0E0E6" },
      { name: "Champagne", hex: "#F7E7CE" },
    ],
    avoidColors: [
      { name: "Neon Orange", hex: "#FF6600" },
      { name: "Mustard Yellow", hex: "#FFDB58" },
      { name: "Bright Red", hex: "#FF0000" },
    ],
    accessories: [
      { name: "Rose Gold Watch", color: "#B76E79", icon: "watch" },
      { name: "Pearl Earrings", color: "#FDEEF4", icon: "gem" },
      { name: "Blush Handbag", color: "#DE5D83", icon: "bag" },
    ]
  },
  light: {
    bestColors: [
      { name: "Coral", hex: "#FF7F50" },
      { name: "Teal", hex: "#008080" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Royal Blue", hex: "#4169E1" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Plum", hex: "#8E4585" },
      { name: "Olive", hex: "#808000" },
    ],
    avoidColors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Pale Yellow", hex: "#FFFF99" },
      { name: "Washed Out Grey", hex: "#D3D3D3" },
    ],
    accessories: [
      { name: "Gold Chain", color: "#D4AF37", icon: "gem" },
      { name: "Leather Watch", color: "#8B4513", icon: "watch" },
      { name: "Tan Tote", color: "#D2691E", icon: "bag" },
    ]
  },
  medium: {
    bestColors: [
      { name: "Emerald", hex: "#50C878" },
      { name: "Turquoise", hex: "#40E0D0" },
      { name: "Burnt Orange", hex: "#CC5500" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Cobalt Blue", hex: "#0047AB" },
      { name: "Rust", hex: "#B7410E" },
      { name: "Mauve", hex: "#E0B0FF" },
      { name: "Sage", hex: "#9DC183" },
    ],
    avoidColors: [
      { name: "Pastel Pink", hex: "#FFD1DC" },
      { name: "Baby Blue", hex: "#89CFF0" },
      { name: "Cream", hex: "#FFFDD0" },
    ],
    accessories: [
      { name: "Mixed Metals", color: "#C0C0C0", icon: "gem" },
      { name: "Copper Watch", color: "#B87333", icon: "watch" },
      { name: "Cognac Bag", color: "#9F4E19", icon: "bag" },
    ]
  },
  olive: {
    bestColors: [
      { name: "Deep Purple", hex: "#4B0082" },
      { name: "Maroon", hex: "#800000" },
      { name: "Navy", hex: "#000080" },
      { name: "Chocolate", hex: "#7B3F00" },
      { name: "Wine", hex: "#722F37" },
      { name: "Hunter Green", hex: "#355E3B" },
      { name: "Brick Red", hex: "#CB4154" },
      { name: "Mustard", hex: "#FFDB58" },
    ],
    avoidColors: [
      { name: "Bright Orange", hex: "#FFA500" },
      { name: "Neon Green", hex: "#39FF14" },
      { name: "Hot Pink", hex: "#FF69B4" },
    ],
    accessories: [
      { name: "Antique Gold", color: "#CFB53B", icon: "gem" },
      { name: "Bronze Watch", color: "#CD7F32", icon: "watch" },
      { name: "Burgundy Clutch", color: "#800020", icon: "bag" },
    ]
  },
  tan: {
    bestColors: [
      { name: "Coral Red", hex: "#FF4040" },
      { name: "Electric Blue", hex: "#7DF9FF" },
      { name: "Fuchsia", hex: "#FF00FF" },
      { name: "Tangerine", hex: "#FF9966" },
      { name: "Aqua", hex: "#00FFFF" },
      { name: "Hot Pink", hex: "#FF69B4" },
      { name: "Lime", hex: "#32CD32" },
      { name: "Violet", hex: "#EE82EE" },
    ],
    avoidColors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Khaki", hex: "#C3B091" },
      { name: "Tan", hex: "#D2B48C" },
    ],
    accessories: [
      { name: "Silver Jewelry", color: "#C0C0C0", icon: "gem" },
      { name: "White Watch", color: "#FFFFFF", icon: "watch" },
      { name: "Neon Bag", color: "#39FF14", icon: "bag" },
    ]
  },
  brown: {
    bestColors: [
      { name: "Gold", hex: "#FFD700" },
      { name: "Orange", hex: "#FFA500" },
      { name: "Red", hex: "#FF0000" },
      { name: "Yellow", hex: "#FFFF00" },
      { name: "Ivory", hex: "#FFFFF0" },
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Amber", hex: "#FFBF00" },
      { name: "Copper", hex: "#B87333" },
    ],
    avoidColors: [
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" },
      { name: "Dark Grey", hex: "#A9A9A9" },
    ],
    accessories: [
      { name: "Gold Hoops", color: "#FFD700", icon: "gem" },
      { name: "Gold Watch", color: "#D4AF37", icon: "watch" },
      { name: "Camel Bag", color: "#C19A6B", icon: "bag" },
    ]
  },
  dark: {
    bestColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Bright Yellow", hex: "#FFFF00" },
      { name: "Fuchsia", hex: "#FF00FF" },
      { name: "Cobalt", hex: "#0047AB" },
      { name: "Emerald", hex: "#50C878" },
      { name: "Royal Purple", hex: "#7851A9" },
      { name: "Coral", hex: "#FF7F50" },
      { name: "Turquoise", hex: "#40E0D0" },
    ],
    avoidColors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Olive", hex: "#808000" },
      { name: "Muted Brown", hex: "#8B7355" },
    ],
    accessories: [
      { name: "Bold Gold", color: "#FFD700", icon: "gem" },
      { name: "Statement Watch", color: "#FFD700", icon: "watch" },
      { name: "White Bag", color: "#FFFFFF", icon: "bag" },
    ]
  }
};

const getAccessoryIcon = (icon: string) => {
  switch (icon) {
    case "watch": return Watch;
    case "gem": return Gem;
    case "bag": return ShoppingBag;
    default: return Sparkles;
  }
};

const ColorPaletteForYou = ({ skinTone = "medium", season = "summer" }: ColorPaletteProps) => {
  const normalizedSkinTone = skinTone.toLowerCase();
  const recommendation = colorRecommendations[normalizedSkinTone] || colorRecommendations.medium;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-medium mb-4">
            <Palette className="w-4 h-4" />
            Personalized for You
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Your <span className="text-gradient-gold">Color Palette</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Based on your {skinTone} skin tone and {season} season preference
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Best Colors */}
          <div className="luxury-card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Best Colors</h3>
                <p className="text-sm text-muted-foreground">8 colors that make you glow</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {recommendation.bestColors.map((color, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div
                    className="w-full aspect-square rounded-xl shadow-lg border-2 border-border/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {color.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid Colors */}
          <div className="luxury-card p-6 animate-fade-in delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Avoid These</h3>
                <p className="text-sm text-muted-foreground">Colors to skip</p>
              </div>
            </div>
            <div className="space-y-4">
              {recommendation.avoidColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/30"
                >
                  <div
                    className="w-12 h-12 rounded-lg shadow-md relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-destructive rotate-45 transform" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{color.name}</p>
                    <p className="text-xs text-muted-foreground">May wash out your complexion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matching Accessories */}
          <div className="luxury-card p-6 animate-fade-in delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Perfect Accessories</h3>
                <p className="text-sm text-muted-foreground">Complete your look</p>
              </div>
            </div>
            <div className="space-y-4">
              {recommendation.accessories.map((accessory, index) => {
                const IconComponent = getAccessoryIcon(accessory.icon);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: accessory.color }}
                    >
                      <IconComponent className="w-6 h-6 text-background" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{accessory.name}</p>
                      <p className="text-xs text-muted-foreground">Recommended for your tone</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: accessory.color }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Seasonal Tip */}
        <div className="mt-8 luxury-card p-6 text-center animate-fade-in delay-300">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Seasonal Styling Tip</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            For {season}, focus on layering with your best colors. Mix textures and add 
            accessories in complementary tones to create depth and visual interest in your outfits.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ColorPaletteForYou;
