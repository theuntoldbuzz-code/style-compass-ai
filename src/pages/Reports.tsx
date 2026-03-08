import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText, ChevronLeft, Trash2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleReport } from "@/types/styleReport";
import StyleReportCard from "@/components/StyleReport/StyleReportCard";
import { useStyleReportHistory, StyleReportRecord } from "@/hooks/useStyleReportHistory";
import reportsBg from "@/assets/reports-bg.png";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const navigate = useNavigate();
  const { reports, loading, deleteReport } = useStyleReportHistory();
  const [selectedReport, setSelectedReport] = useState<StyleReportRecord | null>(null);

  // Also check localStorage fallback for non-logged-in or old reports
  const [localReport] = useState<StyleReport | null>(() => {
    try {
      const saved = localStorage.getItem("luxfit-last-report");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleDelete = async (e: React.MouseEvent, report: StyleReportRecord) => {
    e.stopPropagation();
    await deleteReport(report.id);
    if (selectedReport?.id === report.id) setSelectedReport(null);
    toast({ title: "Report deleted" });
  };

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

  // If viewing a specific report
  if (selectedReport) {
    return (
      <div className="min-h-screen bg-background relative">
        <img src={reportsBg} alt="" className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0" />
        <div className="relative z-10">
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/20 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSelectedReport(null)}
              className="w-9 h-9 rounded-xl bg-card/60 border border-border/30 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Style Dossier</p>
              <p className="text-[11px] text-muted-foreground">
                {format(new Date(selectedReport.created_at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <main className="container mx-auto px-4 py-6 max-w-4xl pb-24">
            <StyleReportCard report={selectedReport.report_data} />
          </main>
        </div>
      </div>
    );
  }

  const hasReports = reports.length > 0;
  const hasLocalOnly = !hasReports && localReport;

  // Empty state
  if (!hasReports && !localReport) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
        <img src={reportsBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-card/60 border border-border/30 flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-9 h-9 text-muted-foreground/50" />
          </div>
          <h2 className="font-serif text-2xl text-foreground mb-3">No Reports Yet</h2>
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

  // Report history list
  return (
    <div className="min-h-screen bg-background relative">
      <img src={reportsBg} alt="" className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0" />
      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-serif text-2xl text-foreground mb-1">Style Dossiers</h1>
          <p className="text-sm text-muted-foreground">
            {reports.length} report{reports.length !== 1 ? "s" : ""} generated
          </p>
        </div>

        {/* Report list */}
        <div className="px-4 pb-28 space-y-3">
          {reports.map((report, index) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="w-full text-left rounded-2xl bg-card/60 border border-border/30 backdrop-blur-sm p-4 transition-all active:scale-[0.98] hover:border-primary/30 hover:shadow-gold/10 hover:shadow-lg"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-gold-dark/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      Style Dossier #{reports.length - index}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(report.created_at), "MMM d, yyyy")}
                    <span className="mx-1">·</span>
                    <Clock className="w-3 h-3" />
                    {format(new Date(report.created_at), "h:mm a")}
                  </div>
                  {/* Show some report highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {report.report_data?.bodyTypeAnalysis?.type && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {report.report_data.bodyTypeAnalysis.type}
                      </span>
                    )}
                    {report.report_data?.skinToneAnalysis?.seasonType && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {report.report_data.skinToneAnalysis.seasonType}
                      </span>
                    )}
                    {report.report_data?.bestColors?.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-border/40"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, report)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}

          {/* Show localStorage fallback if no DB reports */}
          {hasLocalOnly && localReport && (
            <button
              onClick={() => setSelectedReport({
                id: "local",
                report_data: localReport,
                quiz_inputs: null,
                created_at: new Date().toISOString(),
              })}
              className="w-full text-left rounded-2xl bg-card/60 border border-border/30 backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-gold-dark/10 border border-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Previous Report</p>
                  <p className="text-[12px] text-muted-foreground">Saved locally</p>
                </div>
              </div>
            </button>
          )}

          {/* Generate new */}
          <div className="pt-3">
            <Button
              variant="luxury"
              size="lg"
              onClick={() => navigate("/style-quiz")}
              className="w-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate New Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
