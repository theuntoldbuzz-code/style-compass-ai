import { useState } from "react";
import { TrendingUp, Flame, Tag, IndianRupee, ChevronRight, ExternalLink, Heart, Wallet } from "lucide-react";
import { trendingCategories } from "@/data/trendingData";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { useNavigate } from "react-router-dom";

const TrendingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isItemSaved, saveItem, removeItem } = useCloset();
  const [activeCategory, setActiveCategory] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSaveToggle = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (isItemSaved(product.id)) {
      await removeItem(product.id);
    } else {
      await saveItem(product);
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "top-trending": return <Flame className="w-5 h-5" />;
      case "under-999": return <Wallet className="w-5 h-5" />;
      case "best-discounts": return <Tag className="w-5 h-5" />;
      default: return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-4">
        {/* Section Header */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg md:text-4xl text-foreground uppercase tracking-wider">
              <span className="inline-block w-1 h-5 md:h-7 bg-primary mr-3 align-middle rounded-full" />
              Trending <span className="text-gradient-gold">Styles</span> Today
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-primary/[0.08] border border-primary/40 px-4 py-2 rounded-full text-primary text-[11px] md:text-xs font-semibold uppercase tracking-[0.1em] backdrop-blur-[5px] shadow-[0_0_10px_rgba(212,175,55,0.1)] flex-shrink-0">
              Updated Daily
            </div>
          </div>
          <p className="text-muted-foreground text-xs md:text-base ml-4 md:ml-5">
            Curated picks that India is loving right now.
          </p>
        </div>

        {/* Category Tabs - Hidden on mobile */}
        <div className="hidden md:flex flex-wrap justify-center gap-3 mb-8">
          {trendingCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(index)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCategory === index
                  ? 'bg-gradient-gold text-primary-foreground shadow-gold'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {getCategoryIcon(category.id)}
              <span className="hidden sm:inline">{category.title}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trendingCategories[activeCategory].products.map((product, index) => {
            const isSaved = isItemSaved(product.id);
            return (
              <div
                key={product.id}
                className="luxury-card overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-gold text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Tag className="w-3 h-3" />
                    {product.discount}% OFF
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={(e) => handleSaveToggle(product, e)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
                      isSaved
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/60 text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => window.open(product.storeUrl, '_blank')}
                      className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Quick Buy
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-primary text-xs font-medium mb-1">{product.brand}</p>
                  <h4 className="font-serif text-sm text-foreground line-clamp-1 mb-2">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg text-foreground font-semibold">
                      {formatCurrency(product.discountedPrice)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            variant="luxuryOutline"
            size="lg"
            onClick={() => navigate('/explore')}
          >
            Explore All Trending
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
