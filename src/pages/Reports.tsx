import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, FileText, ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleReport } from "@/types/styleReport";
import StyleReportCard from "@/components/StyleReport/StyleReportCard";
import reportsBg from "@/assets/reports-bg.png";
import reportsPartyBg from "@/assets/reports-party-bg.png";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import DesktopBackground from "@/components/DesktopBackground";

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const passedReport = (location.state as any)?.report as StyleReport | undefined;
  const [lastReport, setLastReport] = useState<StyleReport | null>(passedReport ?? null);
  const [loading, setLoading] = useState(!passedReport);

  useEffect(() => {
    if (passedReport) return;
    const fetchLatest = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("style_reports")
            .select("report_data")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (data?.report_data) {
            setLastReport(data.report_data as unknown as StyleReport);
            setLoading(false);
            return;
          }
        }
      } catch {}
      try {
        const saved = localStorage.getItem("luxfit-last-report");
        if (saved) setLastReport(JSON.parse(saved));
      } catch {}
      setLoading(false);
    };
    fetchLatest();
  }, [passedReport]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <img src={reportsBg} alt="" className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
        <img src={reportsPartyBg} alt="" className="md:hidden absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
        <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (!lastReport) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
        <img src={reportsBg} alt="" className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <img src={reportsPartyBg} alt="" className="md:hidden absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card/60 border border-border/30 flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-9 h-9 text-muted-foreground/50" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">No Report Yet</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Take our style quiz to get your personalized AI-powered Style Dossier with color analysis, styling guidance, and more.
          </p>
          <Button variant="luxury" size="lg" onClick={() => navigate("/style-quiz")} className="w-full md:w-auto md:px-12">
            <Sparkles className="w-5 h-5 mr-2" />
            Take Style Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  // Desktop / Tablet layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background relative">
        <DesktopBackground />

        {/* Top navigation bar */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-card/60 border border-border/30 flex items-center justify-center hover:bg-card transition-colors">
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <div>
                <h1 className="font-serif text-lg text-foreground">Style Dossier</h1>
                <p className="text-xs text-muted-foreground">Your personalized style analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="luxuryOutline" size="sm" onClick={() => navigate("/style-quiz")} className="gap-2">
                <History className="w-4 h-4" />
                Retake Quiz
              </Button>
              <Button variant="luxury" size="sm" onClick={() => navigate("/explore")} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Explore Outfits
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <StyleReportCard report={lastReport} />
        </main>
      </div>
    );
  }

  // Mobile layout (original)
  return (
    <div className="min-h-screen bg-background relative">
      <img src={reportsPartyBg} alt="" className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0" />
      <main className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <StyleReportCard report={lastReport} />
      </main>
    </div>
  );
};

export default Reports;
