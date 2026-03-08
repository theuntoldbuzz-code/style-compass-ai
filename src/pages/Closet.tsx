import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, Heart, ShoppingBag, 
  ExternalLink, Star, Trash2, Tag, Crown, Lock
} from 'lucide-react';
import BackButton from '@/components/BackButton';
import fashionEmpty from '@/assets/fashion-9.avif';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCloset, SavedItem, SavedOutfit } from '@/hooks/useCloset';
import { usePremium } from '@/hooks/usePremium';
import ProductCard from '@/components/ProductCard';

const Closet = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { savedItems, savedOutfits, loading, removeItem, removeOutfit } = useCloset();
  const { isPremium, loading: premiumLoading } = usePremium();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Block free users from accessing closet
  if (!authLoading && !premiumLoading && user && !isPremium) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute top-4 left-4 z-20">
          <BackButton to="/" label="Back to Home" />
        </div>
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-serif text-3xl text-foreground mb-3">Premium Feature</h2>
          <p className="text-muted-foreground mb-8">
            Virtual Closet is exclusively available for Premium members. Upgrade to save and organize your favorite outfits and items.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="luxury" size="lg" onClick={() => navigate('/profile')}>
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse mb-4">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading your closet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl text-foreground">My Closet</h1>
                <p className="text-sm text-muted-foreground">Your saved styles</p>
              </div>
            </div>
          </div>
          <Button variant="luxuryOutline" onClick={() => navigate('/get-outfit')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Discover More
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Tabs defaultValue="outfits" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="outfits" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Outfits ({savedOutfits.length})
            </TabsTrigger>
            <TabsTrigger value="items" className="gap-2">
              <Heart className="w-4 h-4" />
              Items ({savedItems.length})
            </TabsTrigger>
          </TabsList>

          {/* Saved Outfits */}
          <TabsContent value="outfits">
            {savedOutfits.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No saved outfits yet"
                description="Start exploring and save outfits you love to see them here"
                actionLabel="Discover Outfits"
                onAction={() => navigate('/get-outfit')}
              />
            ) : (
              <div className="space-y-6">
                {savedOutfits.map((outfit) => (
                  <SavedOutfitCard 
                    key={outfit.id} 
                    outfit={outfit} 
                    onRemove={() => removeOutfit(outfit.outfit_id)}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Items */}
          <TabsContent value="items">
            {savedItems.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved items yet"
                description="Save individual products you love to build your dream wardrobe"
                actionLabel="Browse Items"
                onAction={() => navigate('/get-outfit')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                  <SavedItemCard 
                    key={item.id} 
                    item={item} 
                    onRemove={() => removeItem(item.product_id)}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => (
  <div className="luxury-card overflow-hidden max-w-2xl mx-auto">
    <div className="grid md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto">
        <img 
          src={fashionEmpty} 
          alt="Fashion inspiration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent md:bg-gradient-to-r" />
      </div>
      <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button variant="luxury" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  </div>
);

// Saved Outfit Card
interface SavedOutfitCardProps {
  outfit: SavedOutfit;
  onRemove: () => void;
  formatCurrency: (value: number) => string;
}

const SavedOutfitCard = ({ outfit, onRemove, formatCurrency }: SavedOutfitCardProps) => {
  const savings = (outfit.outfit_total_price || 0) - (outfit.outfit_discounted_price || 0);
  const savingsPercent = outfit.outfit_total_price 
    ? Math.round((savings / outfit.outfit_total_price) * 100) 
    : 0;

  return (
    <div className="luxury-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-xl text-foreground mb-1">
              {outfit.outfit_name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {outfit.outfit_description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Price Summary */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-serif text-2xl text-foreground">
            {formatCurrency(outfit.outfit_discounted_price || 0)}
          </span>
          {savings > 0 && (
            <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3 text-primary" />
              <span className="text-sm text-primary font-medium">
                Save {savingsPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Color Palette */}
        {outfit.outfit_color_palette && outfit.outfit_color_palette.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {outfit.outfit_color_palette.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-background"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Products Preview */}
        <div className="grid grid-cols-4 gap-2">
          {outfit.outfit_products.slice(0, 4).map((product, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg overflow-hidden bg-secondary"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Saved Item Card
interface SavedItemCardProps {
  item: SavedItem;
  onRemove: () => void;
  formatCurrency: (value: number) => string;
}

const SavedItemCard = ({ item, onRemove, formatCurrency }: SavedItemCardProps) => {
  const discount = item.product_price && item.product_discounted_price
    ? Math.round(((item.product_price - item.product_discounted_price) / item.product_price) * 100)
    : 0;

  return (
    <div className="luxury-card overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={item.product_image_url || '/placeholder.svg'}
          alt={item.product_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-primary text-sm font-medium">{item.product_brand}</span>
          <span className="text-xs text-muted-foreground">{item.product_store}</span>
        </div>
        
        <h4 className="font-serif text-lg text-foreground mb-2 line-clamp-1">
          {item.product_name}
        </h4>

        {item.product_color && (
          <p className="text-sm text-muted-foreground mb-3">
            Color: {item.product_color}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-xl text-foreground font-semibold">
            {formatCurrency(item.product_discounted_price || 0)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(item.product_price || 0)}
            </span>
          )}
        </div>

        {/* Shop Button */}
        <Button
          variant="luxury"
          className="w-full"
          onClick={() => window.open(item.product_store_url || '#', '_blank')}
        >
          Shop Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Closet;