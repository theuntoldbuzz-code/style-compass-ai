import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowLeft, Heart, ExternalLink, Tag, Star, 
  Filter, Grid, LayoutGrid, ChevronDown, ShoppingBag
} from "lucide-react";
import fashionExplore from "@/assets/fashion-10.avif";
import { Button } from "@/components/ui/button";
import { infiniteScrollProducts } from "@/data/trendingData";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { Product } from "@/types/outfit";

const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isItemSaved, saveItem, removeItem } = useCloset();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [filter, setFilter] = useState<string>('all');
  
  const observer = useRef<IntersectionObserver>();
  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Simulate infinite scroll by duplicating and shuffling products
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const startIndex = (page - 1) * 8;
      const shuffledProducts = [...infiniteScrollProducts]
        .sort(() => Math.random() - 0.5)
        .map((p, i) => ({ ...p, id: `${p.id}-${page}-${i}` }));
      
      if (page === 1) {
        setProducts(shuffledProducts.slice(0, 8));
      } else {
        setProducts(prev => [...prev, ...shuffledProducts.slice(0, 8)]);
      }
      
      // Limit to 5 pages for demo
      if (page >= 5) {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 500);
  }, [page]);

  const handleSaveToggle = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const originalId = product.id.split('-')[0];
    if (isItemSaved(originalId)) {
      await removeItem(originalId);
    } else {
      await saveItem({ ...product, id: originalId });
    }
  };

  const categories = ['all', 'Jacket', 'Pants', 'Shoes', 'Jewelry', 'Accessory', 'Dress', 'Top'];

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-serif text-xl text-foreground">Explore Styles</h1>
                <p className="text-sm text-muted-foreground">Endless fashion inspiration</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLayout('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={layout === 'masonry' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setLayout('masonry')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-[73px] z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  filter === cat
                    ? 'bg-gradient-gold text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className={`grid gap-4 ${
          layout === 'grid' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {filteredProducts.map((product, index) => {
            const originalId = product.id.split('-')[0];
            const isSaved = isItemSaved(originalId);
            const isLast = index === filteredProducts.length - 1;
            
            return (
              <div
                key={product.id}
                ref={isLast ? lastProductRef : null}
                className={`luxury-card overflow-hidden group animate-fade-in cursor-pointer ${
                  layout === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''
                }`}
                style={{ animationDelay: `${(index % 8) * 50}ms` }}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${
                  layout === 'masonry' && index % 3 === 0 ? 'aspect-[3/5]' : 'aspect-[3/4]'
                }`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-gold text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse-gold">
                      <Tag className="w-3 h-3" />
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Store Badge */}
                  <div className="absolute top-3 right-12 bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {product.store}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={(e) => handleSaveToggle(product, e)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      isSaved
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background/60 text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-6 px-4">
                    {/* AI Styling Tip */}
                    <div className="w-full mb-3 p-3 rounded-xl bg-background/90 backdrop-blur-sm border border-primary/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-primary text-xs mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-medium">Why this suits you</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        This {product.color} {product.category.toLowerCase()} complements warm undertones beautifully.
                      </p>
                    </div>
                    
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(product.storeUrl, '_blank');
                      }}
                      className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Quick Buy
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>

                  {/* Color Palette Indicator */}
                  <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-4 h-4 rounded-full border-2 border-background shadow-md" style={{ backgroundColor: '#D4AF37' }} />
                    <div className="w-4 h-4 rounded-full border-2 border-background shadow-md" style={{ backgroundColor: '#1a365d' }} />
                    <div className="w-4 h-4 rounded-full border-2 border-background shadow-md" style={{ backgroundColor: '#f7fafc' }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-primary text-xs font-medium">{product.brand}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-serif text-sm text-foreground line-clamp-1 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.color}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-base text-foreground font-semibold">
                      {formatCurrency(product.discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* End Message */}
        {!hasMore && (
          <div className="luxury-card overflow-hidden max-w-2xl mx-auto my-12">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto">
                <img 
                  src={fashionExplore} 
                  alt="Fashion inspiration" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2">You've seen it all!</h3>
                <p className="text-muted-foreground">Check back tomorrow for fresh fashion inspiration.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
