import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/OutfitCard";
import { mockOutfits } from "@/data/mockOutfits";

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter outfits based on budget (mock implementation)
  const filteredOutfits = mockOutfits.filter(
    outfit => outfit.totalDiscountedPrice <= (profile?.budgetMax || 100000)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/style-wizard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Modify Preferences</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg">LuxFit AI</span>
          </div>

          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Curated Just For You
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Your Perfect <span className="text-gradient-gold">Outfits</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Based on your style profile, we've curated {filteredOutfits.length} stunning outfits 
            within your budget of {formatCurrency(profile?.budgetMax || 25000)}
          </p>

          {/* Profile Summary */}
          {profile && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {profile.occasion && (
                <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground capitalize">
                  {profile.occasion.replace('-', ' ')}
                </span>
              )}
              {profile.season && (
                <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground capitalize">
                  {profile.season}
                </span>
              )}
              {profile.skinTone && (
                <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground capitalize">
                  {profile.skinTone} Skin Tone
                </span>
              )}
            </div>
          )}
        </div>

        {/* Outfits List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredOutfits.map((outfit, index) => (
            <OutfitCard key={outfit.id} outfit={outfit} index={index} />
          ))}
        </div>

        {/* Load More / Regenerate */}
        <div className="text-center mt-12 space-y-4">
          <Button variant="luxuryOutline" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Show More Outfits
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Not finding what you love?{" "}
            <button 
              onClick={() => navigate("/style-wizard")}
              className="text-primary hover:underline"
            >
              Adjust your preferences
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-xl">LuxFit AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your Personal AI Style Curator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Recommendations;
