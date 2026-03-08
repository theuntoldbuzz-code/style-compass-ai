import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowLeft, Heart, ExternalLink, Tag, Star, 
  Grid, LayoutGrid, ShoppingBag
} from "lucide-react";
import fashionExplore from "@/assets/fashion-10.avif";
import exploreSparkle from "@/assets/explore-sparkle-bg.jpg";
import exploreMobileBg from "@/assets/explore-mobile-bg.png";
import { Button } from "@/components/ui/button";
import { infiniteScrollProducts } from "@/data/trendingData";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { Product } from "@/types/outfit";
import { motion } from "framer-motion";

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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const shuffledProducts = [...infiniteScrollProducts]
        .sort(() => Math.random() - 0.5)
        .map((p, i) => ({ ...p, id: `${p.id}-${page}-${i}` }));
      if (page === 1) {
        setProducts(shuffledProducts.slice(0, 8));
      } else {
        setProducts(prev => [...prev, ...shuffledProducts.slice(0, 8)]);
      }
      if (page >= 5) setHasMore(false);
      setLoading(false);
    }, 500);
  }, [page]);

  const handleSaveToggle = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate('/auth'); return; }
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
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] bg-primary/6 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero Section (Reference-inspired) ── */}
      <div className="relative overflow-hidden">
        {/* Full-width sparkle background */}
        <div className="absolute inset-x-0 top-0 h-[260px] sm:h-[220px]">
          <img 
            src={exploreSparkle} 
            alt="" 
            className="w-full h-full object-cover object-top" 
          />
          {/* Seamless fade into page background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="flex justify-center pt-40 sm:pt-32 mb-3 relative z-10">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-center font-serif text-[28px] sm:text-3xl text-foreground leading-tight mb-2 relative z-10">
          Curated Collections
        </h1>

        {/* Subtitle */}
        <p className="text-center text-primary/80 text-[13px] sm:text-sm italic font-serif leading-relaxed px-10 mb-6 relative z-10">
          Discover handpicked styles from the world's finest fashion houses, tailored to your unique taste.
        </p>

        {/* Category pills — centered, wrapping */}
        <div className="flex flex-wrap justify-center gap-2.5 px-6 pb-6 relative z-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-300 border ${
                filter === cat
                  ? 'bg-primary text-primary-foreground border-primary/40 shadow-gold'
                  : 'bg-transparent text-muted-foreground/80 border-border/30 hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sticky header on scroll (compact) ── */}
      <header className="sticky top-0 z-50 border-b border-border/20 md:block hidden"
        style={{ background: "linear-gradient(180deg, hsl(0 0% 4% / 0.95), hsl(0 0% 4% / 0.85))", backdropFilter: "blur(20px) saturate(1.8)" }}
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-9 h-9 rounded-xl bg-card/60 border border-border/20 flex items-center justify-center transition-colors hover:bg-card">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="font-serif text-lg text-foreground leading-tight">Explore</h1>
          </div>
          <div className="flex items-center gap-1 bg-card/40 border border-border/20 rounded-xl p-1">
            <button onClick={() => setLayout('grid')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${layout === 'grid' ? 'bg-primary/15 text-primary' : 'text-muted-foreground/50'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setLayout('masonry')} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${layout === 'masonry' ? 'bg-primary/15 text-primary' : 'text-muted-foreground/50'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Products Grid ── */}
      <main className="px-3 py-4 max-w-7xl mx-auto">
        <div className={`grid gap-3 ${
          layout === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}>
          {filteredProducts.map((product, index) => {
            const originalId = product.id.split('-')[0];
            const isSaved = isItemSaved(originalId);
            const isLast = index === filteredProducts.length - 1;
            
            return (
              <motion.div
                key={product.id}
                ref={isLast ? lastProductRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                className={`group rounded-2xl overflow-hidden border border-border/15 bg-card/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_20px_hsl(45_66%_52%/0.08)] ${
                  layout === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden ${
                  layout === 'masonry' && index % 3 === 0 ? 'aspect-[3/5]' : 'aspect-[3/4]'
                }`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Discount Badge — compact pill */}
                  {product.discount > 0 && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-[3px] rounded-lg text-[10px] font-bold shadow-lg">
                      <Tag className="w-2.5 h-2.5" />
                      {product.discount}% Off
                    </div>
                  )}

                  {/* Store Badge */}
                  <div className="absolute top-2.5 right-11 bg-card/80 backdrop-blur-md text-foreground/90 px-2 py-[3px] rounded-lg text-[10px] font-semibold border border-border/10">
                    {product.store}
                  </div>

                  {/* Save Heart */}
                  <button
                    onClick={(e) => handleSaveToggle(product, e)}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 ${
                      isSaved
                        ? 'bg-primary text-primary-foreground shadow-gold'
                        : 'bg-card/60 text-foreground/80 border border-border/20'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Hover overlay — desktop only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex flex-col items-center justify-end pb-4 px-3">
                    <div className="w-full mb-2 p-2.5 rounded-xl bg-card/90 backdrop-blur-sm border border-primary/15">
                      <div className="flex items-center gap-1.5 text-primary text-[10px] mb-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-semibold">Why this suits you</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">
                        This {product.color} {product.category.toLowerCase()} complements warm undertones beautifully.
                      </p>
                    </div>
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); window.open(product.storeUrl, '_blank'); }}
                      className="w-full text-xs h-9"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      Quick Buy
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>

                  {/* Mobile tap buy button — visible on mobile */}
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(product.storeUrl, '_blank'); }}
                    className="absolute bottom-2.5 left-2.5 right-2.5 sm:hidden flex items-center justify-center gap-1.5 bg-card/85 backdrop-blur-md border border-primary/20 text-foreground rounded-xl py-2 text-[11px] font-semibold transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    Quick Buy
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-primary text-[11px] font-semibold truncate">{product.brand}</p>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-[10px] text-muted-foreground font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-serif text-[13px] text-foreground line-clamp-1 leading-snug mb-0.5">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground/60 mb-1.5 capitalize">
                    {product.color}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-sm text-foreground font-bold">
                      {formatCurrency(product.discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-[10px] text-muted-foreground/50 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* End Message */}
        {!hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-border/15 bg-card/30 max-w-lg mx-auto my-10"
          >
            <div className="relative aspect-video">
              <img src={fashionExplore} alt="Fashion inspiration" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-center">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-serif text-lg text-foreground mb-1">You've seen it all!</h3>
                <p className="text-xs text-muted-foreground">Check back tomorrow for fresh inspiration.</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Explore;
