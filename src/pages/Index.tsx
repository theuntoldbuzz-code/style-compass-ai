import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Star, ShoppingBag, Palette, Zap, Heart, User, LogOut, Compass, Crown } from "lucide-react";
import heroImage from "@/assets/fashion-1.avif";
import fashionImage2 from "@/assets/fashion-2.avif";
import fashionImage3 from "@/assets/fashion-3.avif";
import fashionImage4 from "@/assets/fashion-4.avif";
import fashionImage5 from "@/assets/fashion-5.avif";
import fashionImage6 from "@/assets/fashion-6.avif";
import fashionImage7 from "@/assets/fashion-7.avif";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/SplashScreen";
import TrendingSection from "@/components/TrendingSection";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { usePremium } from "@/hooks/usePremium";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import goldBokehBg from "@/assets/gold-bokeh-bg.png";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Styling",
    description: "Our AI analyzes your features to recommend perfect color palettes.",
    image: fashionImage2,
  },
  {
    icon: ShoppingBag,
    title: "Price Comparison",
    description: "Find the best deals across Amazon, Myntra, Ajio, and more.",
    image: fashionImage3,
  },
  {
    icon: Palette,
    title: "Skin Tone Matching",
    description: "Outfits curated to complement your unique complexion.",
    image: fashionImage4,
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get complete outfit recommendations in seconds.",
    image: fashionImage5,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { savedItems, savedOutfits } = useCloset();
  const { isPremium } = usePremium();
  const totalSaved = savedItems.length + savedOutfits.length;
  const [showSplash, setShowSplash] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation - Desktop only */}
      <nav className="relative z-10 container mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl md:text-2xl text-foreground">
            <span className="text-gradient-gold">Lux</span>Fit
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/explore')} className="text-muted-foreground hover:text-primary w-10 h-10">
            <Compass className="w-5 h-5" />
          </Button>
          {!loading && user ? (
            <>
              {isPremium && (
                <Button variant="ghost" size="icon" onClick={() => navigate('/closet')} className="relative text-muted-foreground hover:text-primary w-10 h-10">
                  <Heart className="w-5 h-5" />
                  {totalSaved > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                      {totalSaved > 99 ? '99+' : totalSaved}
                    </span>
                  )}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground w-10 h-10">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/explore')}>
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Styles
                  </DropdownMenuItem>
                  {isPremium ? (
                    <DropdownMenuItem onClick={() => navigate('/closet')}>
                      <Heart className="w-4 h-4 mr-2" />
                      My Closet
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/closet')} className="text-muted-foreground">
                      <Crown className="w-4 h-4 mr-2 text-primary" />
                      My Closet
                      <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">PRO</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-foreground text-sm px-3">
              Sign In
            </Button>
          )}
          <Button variant="luxuryOutline" onClick={() => navigate("/get-outfit")} className="text-xs sm:text-sm px-3 sm:px-4">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10">
        {/* Gold Bokeh Background */}
        <div className="absolute top-0 left-0 right-0 h-[420px] md:h-[500px] overflow-hidden pointer-events-none">
          <img src={goldBokehBg} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative container mx-auto px-4 pt-4 md:pt-16 pb-10 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 px-4 py-2 rounded-full text-primary text-xs md:text-sm font-medium tracking-widest mb-6 md:mb-8 uppercase">
                AI-Powered Fashion Styling
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4 md:mb-6">
                Discover
                <br />
                Your
                <br />
                <span className="text-gradient-gold italic">Perfect Style</span>
              </h1>

              {/* Hero Image - Mobile only */}
              <div className="lg:hidden mb-6">
                <div className="relative max-w-[220px] mx-auto">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-gold-dark/20 rounded-2xl blur-xl" />
                  <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-gold bg-card">
                    <img src={heroImage} alt="AI Fashion Styling" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>

              {/* Subheadline */}
              <p className="text-muted-foreground text-sm md:text-lg max-w-md mx-auto lg:mx-0 mb-8 md:mb-10 font-serif italic leading-relaxed">
                Upload your photo, tell us the occasion, and let AI curate personalized outfits that match your skin tone, body type, and budget.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center lg:items-start gap-3 md:gap-4">
                <Button variant="luxury" size="xl" onClick={() => navigate("/style-quiz")} className="w-full sm:w-auto min-w-[260px] uppercase tracking-wider text-sm font-semibold">
                  Take Style Quiz
                </Button>
                <Button variant="luxuryOutline" size="xl" onClick={() => navigate("/get-outfit")} className="w-full sm:w-auto min-w-[260px] uppercase tracking-wider text-sm">
                  Upload Photo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 md:mt-12 flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-xs md:text-sm">10k+ Happy Users</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs md:text-sm">50+ Partner Stores</span>
              </div>
            </div>

            {/* Hero Image - Desktop only */}
            <div className={`hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-gold-dark/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-gold">
                  <img src={heroImage} alt="Luxury fashion" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-sm text-primary font-medium mb-1">Featured Collection</p>
                    <p className="text-foreground font-serif text-lg">AI-Curated Luxury Picks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-16">
        <div className={`mb-8 md:mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-serif text-lg md:text-4xl text-foreground uppercase tracking-wider">
            <span className="inline-block w-1 h-5 md:h-7 bg-primary mr-3 align-middle rounded-full" />
            How <span className="text-gradient-gold">Aurion AI</span> Works
          </h2>
        </div>

        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="luxury-card overflow-hidden group hover:shadow-gold transition-all duration-500">
                {/* Feature Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Icon Badge */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold z-10 border-2 border-card">
                    <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-7 pb-4 px-3 md:pt-8 md:pb-5 md:px-4 text-center">
                  <h3 className="font-serif text-xs md:text-base text-foreground mb-1 md:mb-2 font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Styles Section */}
      <TrendingSection />

      {/* Curated Fashion Inspiration Gallery */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-16">
        <div className={`mb-6 md:mb-10 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-serif text-lg md:text-4xl text-foreground mb-2 md:mb-3 uppercase tracking-wider">
            <span className="inline-block w-1 h-5 md:h-7 bg-primary mr-3 align-middle rounded-full" />
            Curated <span className="text-gradient-gold italic">Fashion Inspiration</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-base ml-4 md:ml-5">
            Explore premium styles handpicked by our AI.
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-3 md:gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left: Tall image */}
          <div className="relative row-span-2 rounded-xl md:rounded-2xl overflow-hidden group luxury-card aspect-[3/5]">
            <img src={fashionImage6} alt="Boutique Collections" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 md:bottom-5 left-3 md:left-5 right-3 md:right-5">
              <p className="text-sm md:text-lg text-foreground font-serif font-semibold">Boutique Collections</p>
            </div>
          </div>

          {/* Right top */}
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden group luxury-card aspect-[4/3]">
            <img src={fashionImage4} alt="Resort Elegance" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
              <p className="text-xs md:text-base text-foreground font-serif font-semibold">Resort Elegance</p>
            </div>
          </div>

          {/* Right bottom */}
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden group luxury-card aspect-[4/3]">
            <img src={fashionImage7} alt="Evening Gowns" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
              <p className="text-xs md:text-base text-foreground font-serif font-semibold">Evening Gowns</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-16">
        <div className={`luxury-card p-6 md:p-12 text-left max-w-3xl mx-auto relative overflow-hidden transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />

          <div className="relative">
            <h2 className="font-serif text-xl md:text-4xl text-foreground mb-3 md:mb-4">
              Ready to Transform Your Style?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8 max-w-lg">
              Join thousands of fashion-forward individuals who've discovered their perfect look.
            </p>
            <Button variant="luxury" size="xl" onClick={() => navigate("/get-outfit")} className="w-full sm:w-auto uppercase tracking-wider text-sm font-semibold">
              Get Your Personalized Outfits
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-8 md:mt-16 py-6 md:py-8 pb-24 sm:pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-xl">LuxFit AI</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2024 LuxFit AI. Your Personal Style Curator.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
