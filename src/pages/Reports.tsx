import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleReport } from "@/types/styleReport";
import StyleReportCard from "@/components/StyleReport/StyleReportCard";
import reportsBg from "@/assets/reports-bg.png";

const Reports = () => {
  const navigate = useNavigate();
  const [lastReport, setLastReport] = useState<StyleReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxfit-last-report");
      if (saved) {
        setLastReport(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <img src={reportsBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
        <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (!lastReport) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
        <img src={reportsBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card/60 border border-border/30 flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-9 h-9 text-muted-foreground/50" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-3">No Report Yet</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Take our style quiz to get your personalized AI-powered Style Dossier with color analysis, styling guidance, and more.
          </p>
          <Button variant="luxury" size="lg" onClick={() => navigate("/style-quiz")} className="w-full">
            <Sparkles className="w-5 h-5 mr-2" />
            Take Style Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <StyleReportCard report={lastReport} />
      </main>
    </div>
  );
};

export default Reports;
