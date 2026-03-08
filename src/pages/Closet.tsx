import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowLeft, Heart, ShoppingBag, 
  ExternalLink, Trash2, Tag, Crown, Lock, Gift
} from 'lucide-react';
import BackButton from '@/components/BackButton';
import fashionEmpty from '@/assets/fashion-9.avif';
import heroBannerAll from '@/assets/closet-all.jpg';
import heroBannerWedding from '@/assets/closet-wedding.jpg';
import heroBannerOffice from '@/assets/closet-office.jpg';
import heroBannerCasual from '@/assets/closet-casual.jpg';
import heroBannerParty from '@/assets/closet-party.jpg';

const heroImages: Record<string, string> = {
  All: heroBannerAll,
  Wedding: heroBannerWedding,
  Office: heroBannerOffice,
  Casual: heroBannerCasual,
  Party: heroBannerParty,
};
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCloset, SavedItem, SavedOutfit } from '@/hooks/useCloset';
import { usePremium } from '@/hooks/usePremium';

const occasionFilters = ['All', 'Wedding', 'Office', 'Casual', 'Party'];

const Closet = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { savedItems, savedOutfits, loading, removeItem, removeOutfit } = useCloset();
  const { isPremium, loading: premiumLoading } = usePremium();
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileTab, setMobileTab] = useState<'outfits' | 'items'>('outfits');

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

  // Filter outfits by occasion
  const filteredOutfits = activeFilter === 'All' 
    ? savedOutfits 
    : savedOutfits.filter(o => 
        o.outfit_occasion?.some(occ => 
          occ.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );

  const filteredItems = savedItems;

  // ---- MOBILE VIEW ----
  const MobileView = () => (
    <div className="md:hidden min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-[120px] overflow-hidden rounded-b-2xl mx-auto max-w-[calc(100%-32px)] mt-3">
        <img 
          src={heroBanner} 
          alt="Your Virtual Closet" 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h1 className="font-serif text-xl text-foreground font-bold leading-tight">Your Virtual Closet</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Curated by Aurion AI</p>
        </div>
      </div>

      {/* Outfits / Items Tabs */}
      <div className="flex gap-1 mx-4 mt-5 rounded-xl overflow-hidden border border-primary/20 bg-card/80 backdrop-blur-sm p-1">
        <button
          onClick={() => setMobileTab('outfits')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
            mobileTab === 'outfits'
              ? 'bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.3)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Outfits ({savedOutfits.length})
        </button>
        <button
          onClick={() => setMobileTab('items')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
            mobileTab === 'items'
              ? 'bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground shadow-[0_2px_12px_hsl(var(--primary)/0.3)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Items ({savedItems.length})
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2.5 px-4 mt-4 overflow-x-auto no-scrollbar">
        {occasionFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`min-w-[56px] h-9 px-5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-300 border inline-flex items-center justify-center ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-[hsl(45,75%,52%)] to-[hsl(45,80%,40%)] text-[hsl(0,0%,5%)] border-[hsl(45,75%,52%)] shadow-[0_2px_16px_hsl(45,75%,52%,0.3)]'
                : 'bg-card/60 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground backdrop-blur-sm'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Outfits Grid */}
      {mobileTab === 'outfits' && (
        filteredOutfits.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4 mt-5">
            {filteredOutfits.map(outfit => (
              <MobileOutfitCard key={outfit.id} outfit={outfit} onRemove={() => removeOutfit(outfit.outfit_id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 px-6 text-center">
            <div className="w-18 h-18 mb-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/20 shadow-[0_4px_20px_hsl(var(--primary)/0.1)]">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-2">No saved outfits yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Start exploring and save outfits you love</p>
            <button 
              onClick={() => navigate('/get-outfit')}
              className="h-12 px-10 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-[hsl(45,75%,52%)] to-[hsl(45,80%,40%)] text-[hsl(0,0%,5%)] shadow-[0_4px_24px_hsl(45,75%,52%,0.3)] hover:shadow-[0_8px_32px_hsl(45,75%,52%,0.4)] hover:scale-105 active:scale-100 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Discover Outfits
            </button>
          </div>
        )
      )}

      {/* Items Grid */}
      {mobileTab === 'items' && (
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-4 mt-5">
            {filteredItems.map(item => (
              <MobileItemCard key={item.id} item={item} onRemove={() => removeItem(item.product_id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 px-6 text-center">
            <div className="w-18 h-18 mb-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/20 shadow-[0_4px_20px_hsl(var(--primary)/0.1)]">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-2">No saved items yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Save products you love to build your wardrobe</p>
            <button 
              onClick={() => navigate('/get-outfit')}
              className="h-12 px-10 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-[hsl(45,75%,52%)] to-[hsl(45,80%,40%)] text-[hsl(0,0%,5%)] shadow-[0_4px_24px_hsl(45,75%,52%,0.3)] hover:shadow-[0_8px_32px_hsl(45,75%,52%,0.4)] hover:scale-105 active:scale-100 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Browse Items
            </button>
          </div>
        )
      )}
    </div>
  );

  // Mobile Outfit Card
  const MobileOutfitCard = ({ outfit, onRemove }: { outfit: SavedOutfit; onRemove: () => void }) => {
    const firstProduct = outfit.outfit_products?.[0];
    const imageUrl = firstProduct?.imageUrl;
    const itemCount = outfit.outfit_products?.length || 0;

    return (
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/30">
        {/* Image or Placeholder */}
        <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
          {imageUrl ? (
            <img src={imageUrl} alt={outfit.outfit_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-primary/40" />
            </div>
          )}
          {/* Remove button */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* Info */}
        <div className="p-3 pt-2.5">
          <h4 className="font-serif text-sm text-primary leading-tight line-clamp-1">{outfit.outfit_name}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">{itemCount} items</p>
        </div>
      </div>
    );
  };

  // Mobile Item Card
  const MobileItemCard = ({ item, onRemove }: { item: SavedItem; onRemove: () => void }) => {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/30">
        <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
          {item.product_image_url ? (
            <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gift className="w-10 h-10 text-primary/40" />
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-3 pt-2.5">
          <h4 className="font-serif text-sm text-primary leading-tight line-clamp-1">{item.product_name}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">{item.product_brand || item.product_store}</p>
        </div>
      </div>
    );
  };

  // ---- DESKTOP VIEW (unchanged) ----
  const DesktopView = () => (
    <div className="hidden md:block min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
};

// Empty State Component (Desktop)
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

// Saved Outfit Card (Desktop)
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

        <div className="grid grid-cols-4 gap-2">
          {outfit.outfit_products.slice(0, 4).map((product, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Saved Item Card (Desktop)
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
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={item.product_image_url || '/placeholder.svg'}
          alt={item.product_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-primary text-sm font-medium">{item.product_brand}</span>
          <span className="text-xs text-muted-foreground">{item.product_store}</span>
        </div>
        <h4 className="font-serif text-lg text-foreground mb-2 line-clamp-1">
          {item.product_name}
        </h4>
        {item.product_color && (
          <p className="text-sm text-muted-foreground mb-3">Color: {item.product_color}</p>
        )}
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
        <Button variant="luxury" className="w-full" onClick={() => window.open(item.product_store_url || '#', '_blank')}>
          Shop Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Closet;
