import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Tag, Bookmark } from "lucide-react";
import { OutfitRecommendation } from "@/types/outfit";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface OutfitCardProps {
  outfit: OutfitRecommendation;
  index: number;
}

const OutfitCard = ({ outfit, index }: OutfitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [isSaved, setIsSaved] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const savings = outfit.totalOriginalPrice - outfit.totalDiscountedPrice;
  const savingsPercent = Math.round((savings / outfit.totalOriginalPrice) * 100);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved" : "Outfit saved!",
      description: isSaved ? "Outfit removed from your collection" : "You can find this in your saved outfits",
    });
  };

  return (
    <div 
      className={`luxury-card overflow-hidden transition-all duration-500 ${
        isExpanded ? 'shadow-elevated' : ''
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl md:text-2xl text-foreground">
                  {outfit.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {outfit.products.length} items • Complete Look
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mt-3 line-clamp-2">
              {outfit.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className={isSaved ? 'text-primary' : 'text-muted-foreground'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-primary' : ''}`} />
            </Button>

            {/* Expand/Collapse */}
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="font-serif text-2xl text-foreground font-semibold">
              {formatCurrency(outfit.totalDiscountedPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">
              Save {formatCurrency(savings)} ({savingsPercent}%)
            </span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-sm text-muted-foreground">Color Palette:</span>
          <div className="flex gap-1">
            {outfit.colorPalette.map((color, i) => (
              <div 
                key={i}
                className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50 animate-fade-in">
          {/* Why It Suits You */}
          <div className="p-6 bg-primary/5">
            <h4 className="font-serif text-lg text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Why This Look Suits You
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {outfit.whyItSuits}
            </p>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            <h4 className="font-serif text-lg text-foreground mb-4">
              Shop This Look
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {outfit.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitCard;
