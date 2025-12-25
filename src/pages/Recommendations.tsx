import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Sparkles, RefreshCw, Filter, Heart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/OutfitCard";
import { getRecommendations } from "@/data/mockOutfits";
import { occasionCategories, getOccasionOutfits } from "@/data/occasionOutfits";
import { UserProfile } from "@/types/outfit";
import { StyleReport, PhotoAnalysisResult } from "@/types/styleReport";
import StyleReportCard from "@/components/StyleReport/StyleReportCard";
import OccasionSection from "@/components/StyleReport/OccasionSection";
import ReportGeneratingScreen from "@/components/StyleReport/ReportGeneratingScreen";
import { useStyleReport } from "@/hooks/useStyleReport";

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile as UserProfile | undefined;
  const photoAnalysisFromWizard = location.state?.photoAnalysis as PhotoAnalysisResult | undefined;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<StyleReport | null>(null);
  const [activeTab, setActiveTab] = useState<"outfits" | "report" | "occasions">("outfits");
  
  const { generateReport, isLoading } = useStyleReport();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const recommendations = getRecommendations({
    gender: profile?.gender || "male",
    occasion: profile?.occasion || "casual",
    season: profile?.season || "summer",
    budgetMax: profile?.budgetMax || 100000,
    skinTone: profile?.skinTone || "medium",
  });

  const handleGenerateReport = async () => {
    if (!profile) return;
    setIsGenerating(true);
  };

  const handleReportComplete = async () => {
    if (!profile) {
      setIsGenerating(false);
      return;
    }
    // Pass photo analysis to generate a more personalized report
    const report = await generateReport(profile, photoAnalysisFromWizard);
    if (report) {
      setGeneratedReport(report);
      setActiveTab("report");
    }
    setIsGenerating(false);
  };

  const getOccasionLabel = (occasion: string) => {
    const labels: Record<string, string> = {
      "wedding": "Wedding", "diwali": "Diwali", "office": "Office",
      "date-night": "Date Night", "party": "Party", "casual": "Casual",
      "formal": "Formal Event", "christmas": "Christmas",
    };
    return labels[occasion] || occasion;
  };

  const getSeasonLabel = (season: string) => {
    const labels: Record<string, string> = {
      "summer": "Summer", "winter": "Winter", "monsoon": "Monsoon", "spring": "Spring",
    };
    return labels[season] || season;
  };

  if (isGenerating) {
    return <ReportGeneratingScreen onComplete={handleReportComplete} duration={10} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/style-wizard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Modify Preferences</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg">LuxFit AI</span>
          </div>
          <Button variant="ghost" size="icon"><Filter className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />AI-Curated Just For You
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Your Perfect <span className="text-gradient-gold">Style</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Personalized recommendations within your budget of {formatCurrency(profile?.budgetMax || 25000)}
          </p>
          {profile && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {profile.gender && <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground capitalize flex items-center gap-2"><Heart className="w-3 h-3 text-primary" />{profile.gender === "female" ? "Women's" : "Men's"} Fashion</span>}
              {profile.occasion && <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground">{getOccasionLabel(profile.occasion)}</span>}
              {profile.season && <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground">{getSeasonLabel(profile.season)}</span>}
              {profile.skinTone && <span className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground capitalize">{profile.skinTone} Skin</span>}
            </div>
          )}
          {!generatedReport && (
            <div className="mt-8">
              <Button variant="luxury" size="lg" onClick={handleGenerateReport} disabled={isLoading} className="gap-2">
                <FileText className="w-5 h-5" />Generate AI Style Report (90-sec magic!)
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Get personalized color analysis, body type insights & signature looks</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Button variant={activeTab === "outfits" ? "luxury" : "luxuryOutline"} onClick={() => setActiveTab("outfits")} className="gap-2"><Sparkles className="w-4 h-4" />Outfits</Button>
          {generatedReport && <Button variant={activeTab === "report" ? "luxury" : "luxuryOutline"} onClick={() => setActiveTab("report")} className="gap-2"><FileText className="w-4 h-4" />Style Report</Button>}
          <Button variant={activeTab === "occasions" ? "luxury" : "luxuryOutline"} onClick={() => setActiveTab("occasions")} className="gap-2"><Heart className="w-4 h-4" />Shop by Occasion</Button>
        </div>

        {activeTab === "outfits" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {recommendations.map((outfit, index) => <OutfitCard key={outfit.id} outfit={outfit} index={index} />)}
            {recommendations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"><Sparkles className="w-10 h-10 text-primary" /></div>
                <h3 className="font-serif text-2xl text-foreground mb-2">No Outfits Found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your budget or preferences.</p>
                <Button variant="luxury" onClick={() => navigate("/style-wizard")}>Adjust Preferences</Button>
              </div>
            )}
            {recommendations.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="luxuryOutline" size="lg" onClick={() => window.location.reload()}><RefreshCw className="w-5 h-5 mr-2" />Show More</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "report" && generatedReport && <div className="max-w-4xl mx-auto"><StyleReportCard report={generatedReport} /></div>}

        {activeTab === "occasions" && (
          <div className="max-w-5xl mx-auto">
            {occasionCategories.map((category) => (
              <OccasionSection key={category.id} title={category.title} subtitle={category.subtitle} icon={category.icon} outfits={getOccasionOutfits(profile?.gender || "male", category.id)} stylingTip={category.stylingTip} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-primary" /><span className="font-serif text-xl">LuxFit AI</span></div>
          <p className="text-sm text-muted-foreground">Your Personal AI Style Curator</p>
        </div>
      </footer>
    </div>
  );
};

export default Recommendations;
