import { useState } from "react";
import { ExternalLink, Star, Tag, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types/outfit";
import { Button } from "@/components/ui/button";
import { useCloset } from "@/hooks/useCloset";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isItemSaved, saveItem, removeItem } = useCloset();
  const isSaved = isItemSaved(product.id);
  const [imgError, setImgError] = useState(false);
  const hasImage = product.imageUrl && product.imageUrl !== "" && product.imageUrl !== "/placeholder.svg" && !imgError;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (isSaved) {
      await removeItem(product.id);
    } else {
      await saveItem(product);
    }
  };

  return (
    <div className="luxury-card overflow-hidden group hover:shadow-gold transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {hasImage ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-muted/50">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground/60 font-medium px-4 text-center line-clamp-2">{product.brand} · {product.category}</span>
          </div>
        )}
        
        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          className={`absolute top-3 right-12 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
            isSaved 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background/80 text-muted-foreground hover:text-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <Tag className="w-3 h-3" />
            {product.discount}% OFF
          </div>
        )}

        {/* Store Badge */}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium">
          {product.store}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-primary text-sm font-medium">{product.brand}</span>
          <span className="text-muted-foreground text-xs">{product.category}</span>
        </div>

        {/* Name */}
        <h4 className="font-serif text-lg text-foreground mb-1 line-clamp-1">
          {product.name}
        </h4>

        {/* Color */}
        <p className="text-sm text-muted-foreground mb-3">
          Color: {product.color}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">/ 5.0</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-xl text-foreground font-semibold">
            {formatCurrency(product.discountedPrice)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Shop Button */}
        <Button 
          variant="luxury" 
          className="w-full"
          onClick={() => window.open(product.storeUrl, '_blank')}
        >
          Shop Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;