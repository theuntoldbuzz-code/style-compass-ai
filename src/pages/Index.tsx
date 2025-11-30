import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Star, ShoppingBag, Palette, Zap, Heart, User, LogOut, Compass } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";
import { Button } from "@/components/ui/button";
import SplashScreen from "@/components/SplashScreen";
import TrendingSection from "@/components/TrendingSection";
import ColorPaletteForYou from "@/components/ColorPaletteForYou";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Styling",
    description: "Our AI analyzes your features to recommend perfect color palettes and styles"
  },
  {
    icon: ShoppingBag,
    title: "Price Comparison",
    description: "Find the best deals across Amazon, Myntra, Ajio, and more stores"
  },
  {
    icon: Palette,
    title: "Skin Tone Matching",
    description: "Outfits curated to complement your unique complexion"
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get complete outfit recommendations in seconds"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
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

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-2xl text-foreground">
            <span className="text-gradient-gold">Lux</span>Fit
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/explore')}
            className="text-muted-foreground hover:text-primary"
          >
            <Compass className="w-5 h-5" />
          </Button>
          {!loading && user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/closet')}
                className="text-muted-foreground hover:text-primary"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/explore')}>
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Styles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/closet')}>
                    <Heart className="w-4 h-4 mr-2" />
                    My Closet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
          )}
          <Button 
            variant="luxuryOutline" 
            onClick={() => navigate("/style-wizard")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-12 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`text-center lg:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4 fill-primary" />
            AI-Powered Fashion Styling
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6">
            Discover Your
            <br />
            <span className="text-gradient-gold">Perfect Style</span>
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10">
            Upload your photo, tell us the occasion, and let AI curate personalized 
            outfits that match your skin tone, body type, and budget.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button 
              variant="luxury" 
              size="xl"
              onClick={() => navigate("/style-wizard")}
              className="min-w-[220px]"
            >
              Start Your Style Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="dark" 
              size="xl"
              onClick={() => navigate("/explore")}
            >
              <Compass className="w-5 h-5 mr-2" />
              Explore Styles
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm">10k+ Happy Users</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="hidden sm:flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm">50+ Partner Stores</span>
            </div>
          </div>
        </div>

          {/* Hero Image */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-gold-dark/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-gold">
                <img 
                  src={heroImage} 
                  alt="Luxury fashion accessories" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm text-primary font-medium mb-1">Featured Collection</p>
                  <p className="text-foreground font-serif text-lg">AI-Curated Luxury Picks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Styles Section */}
      <TrendingSection />

      {/* Color Palette Section */}
      <ColorPaletteForYou skinTone="medium" season="winter" />

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            How <span className="text-gradient-gold">LuxFit AI</span> Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our intelligent styling engine combines AI with fashion expertise
          </p>
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="luxury-card p-6 text-center group hover:shadow-gold transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-gold-dark transition-all duration-500">
                  <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className={`luxury-card p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          
          <div className="relative">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Ready to Transform Your Style?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of fashion-forward individuals who've discovered their perfect look with LuxFit AI
            </p>
            <Button 
              variant="luxury" 
              size="xl"
              onClick={() => navigate("/style-wizard")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Your Personalized Outfits
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-xl">LuxFit AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 LuxFit AI. Your Personal Style Curator.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
