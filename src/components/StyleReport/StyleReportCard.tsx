import { StyleReport } from "@/types/styleReport";
import { 
  Sparkles, Palette, Sun, Crown, CheckCircle2, X,
  Heart, Download, Share2, Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import heroFashion from "@/assets/hero-fashion.jpg";

interface StyleReportCardProps {
  report: StyleReport;
  userName?: string;
}

const StyleReportCard = ({ report, userName = "Style Enthusiast" }: StyleReportCardProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const escapeHtml = (str: string): string => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Aurion AI - Your Personal Style Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: #fff; padding: 40px; min-height: 100vh; }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #d4af37; }
            .header h1 { font-size: 36px; color: #d4af37; margin-bottom: 10px; }
            .header p { color: #888; font-size: 14px; }
            .section { margin-bottom: 30px; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 12px; }
            .section h2 { color: #d4af37; font-size: 20px; margin-bottom: 15px; }
            .section p { color: #ccc; line-height: 1.7; }
            .color-grid { display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px; }
            .color-item { display: flex; align-items: center; gap: 10px; }
            .color-swatch { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #333; }
            .color-info { font-size: 12px; }
            .color-name { font-weight: bold; color: #fff; }
            .color-reason { color: #888; font-size: 11px; }
            .tips-list { list-style: none; margin-top: 15px; }
            .tips-list li { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ccc; }
            .tips-list li:last-child { border-bottom: none; }
            .signature-look { background: rgba(212,175,55,0.1); padding: 20px; border-radius: 8px; margin-top: 15px; border-left: 3px solid #d4af37; }
            .signature-look h3 { color: #d4af37; margin-bottom: 10px; }
            .pieces { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
            .piece { background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 12px; }
            .stylist-note { background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)); padding: 30px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.3); text-align: center; margin-top: 30px; }
            .stylist-note p { color: #d4af37; font-style: italic; font-size: 16px; line-height: 1.8; }
            @media print { body { background: #fff; color: #000; } .section { background: #f5f5f5; } .section h2 { color: #b8860b; } .section p, .tips-list li { color: #333; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Aurion AI</h1>
            <p>Your Personal Style Report &bull; Generated ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${report.styleProfileSummary ? `<div class="section"><h2>Style Profile Summary</h2><p>${escapeHtml(report.styleProfileSummary)}</p></div>` : ''}
          
          <div class="section">
            <h2>Skin Tone Analysis</h2>
            <p><strong>Undertone:</strong> ${escapeHtml(report.skinToneAnalysis.undertone)}</p>
            <p><strong>Season Type:</strong> ${escapeHtml(report.skinToneAnalysis.seasonType)}</p>
            <p style="margin-top: 10px;">${escapeHtml(report.skinToneAnalysis.description)}</p>
          </div>
          
          <div class="section">
            <h2>Body Type Analysis</h2>
            <p><strong>Body Type:</strong> ${escapeHtml(report.bodyTypeAnalysis.type)}</p>
            <p><strong>Strengths:</strong> ${report.bodyTypeAnalysis.strengths.map(s => escapeHtml(s)).join(', ')}</p>
            <p style="margin-top: 10px;">${escapeHtml(report.bodyTypeAnalysis.stylingFocus)}</p>
          </div>
          
          <div class="section">
            <h2>Your Best Colors</h2>
            <div class="color-grid">
              ${report.bestColors.map(c => `<div class="color-item"><div class="color-swatch" style="background-color: ${escapeHtml(c.hex)}"></div><div class="color-info"><div class="color-name">${escapeHtml(c.color)}</div><div class="color-reason">${escapeHtml(c.reason)}</div></div></div>`).join('')}
            </div>
          </div>

          <div class="section">
            <h2>Signature Looks</h2>
            ${report.signatureLooks.map(look => `<div class="signature-look"><h3>${escapeHtml(look.name)}</h3><p>${escapeHtml(look.description)}</p><p style="margin-top: 8px; font-size: 12px; color: #888;">Best for: ${escapeHtml(look.occasion)}</p><div class="pieces">${look.keyPieces.map(piece => `<span class="piece">${escapeHtml(piece)}</span>`).join('')}</div></div>`).join('')}
          </div>
          
          <div class="section">
            <h2>Styling Tips</h2>
            <ul class="tips-list">${report.stylingTips.map(tip => `<li>&bull; ${escapeHtml(tip)}</li>`).join('')}</ul>
          </div>

          ${report.finalStylistNote ? `<div class="stylist-note"><p>"${escapeHtml(report.finalStylistNote)}"</p></div>` : ''}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My Style Dossier - Aurion AI',
        text: 'Check out my personalized style report from Aurion AI!',
        url: window.location.href,
      });
    }
  };

  const styleIdentityTitle = report.signatureLooks?.[0]?.name || report.bodyTypeAnalysis.type;
  const styleIdentityDesc = report.styleProfileSummary || report.skinToneAnalysis.description;

  const idealFabrics: string[] = [];
  if (report.stylePersonalityDeepDive?.fabrics) {
    idealFabrics.push(...report.stylePersonalityDeepDive.fabrics.split(',').map(f => f.trim()).filter(Boolean).slice(0, 4));
  }
  if (idealFabrics.length === 0 && report.bestPatterns.length > 0) {
    idealFabrics.push(...report.bestPatterns.slice(0, 3).map(p => p.pattern));
  }

  // ── Desktop / Tablet Layout ──
  if (!isMobile) {
    return (
      <div ref={reportRef} className="space-y-8">
        {/* Hero Section - Wide banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden aspect-[21/7] border border-border/20"
        >
          <img src={heroFashion} alt="Style Dossier" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-12">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 bg-primary/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-primary text-xs font-semibold tracking-wider uppercase mb-4 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Analysis
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-foreground italic leading-tight mb-2">Style Dossier</h2>
              <p className="text-sm text-muted-foreground">
                Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Signature Style Identity */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-7"
            >
              <div className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full text-primary text-[11px] font-semibold tracking-wider uppercase mb-4">
                <Sparkles className="w-3 h-3" />
                Signature Style Identity
              </div>
              <h3 className="font-serif text-3xl text-foreground leading-snug mb-3">
                {styleIdentityTitle}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {styleIdentityDesc}
              </p>
            </motion.div>

            {/* Styling Guidance */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SectionHeader icon={<Crown className="w-4 h-4 text-primary" />} label="Styling Guidance" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-1.5 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Best For You</span>
                  </div>
                  <div className="space-y-3">
                    {(report.stylingDos || report.bodyTypeAnalysis.strengths || []).slice(0, 4).map((item, i) => (
                      <p key={i} className="text-[13px] text-foreground/90 leading-snug">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-1.5 mb-4">
                    <X className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Avoid</span>
                  </div>
                  <div className="space-y-3">
                    {(report.stylingDonts || report.bodyTypeAnalysis.avoidStyles || []).slice(0, 4).map((item, i) => (
                      <p key={i} className="text-[13px] text-muted-foreground leading-snug">{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ideal Fabrics */}
            {idealFabrics.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SectionHeader icon={<Heart className="w-4 h-4 text-primary" />} label="Ideal Fabrics" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {idealFabrics.map((fabric, i) => (
                    <span key={i} className="px-5 py-2.5 rounded-xl bg-card/60 border border-border/30 text-sm text-foreground font-medium backdrop-blur-sm">
                      {fabric}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Color Analysis */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <SectionHeader icon={<Sun className="w-4 h-4 text-primary" />} label="Color Analysis" />
              <div className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 mt-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-4">Power Colors</p>
                <div className="flex gap-4 flex-wrap mb-6">
                  {report.bestColors.slice(0, 6).map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-14 h-14 rounded-full border-2 border-border/40 shadow-lg transition-transform hover:scale-110" 
                        style={{ backgroundColor: color.hex }} 
                      />
                      <span className="text-[11px] text-muted-foreground">{color.color}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-4">Colors to Avoid</p>
                <div className="flex gap-4 flex-wrap">
                  {report.colorsToAvoid.slice(0, 5).map((color, i) => (
                    <div key={i} className="relative flex flex-col items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-border/40 opacity-70" 
                        style={{ backgroundColor: color.hex }} 
                      />
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-destructive-foreground" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{color.color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Signature Looks */}
            {report.signatureLooks?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <SectionHeader icon={<Gem className="w-4 h-4 text-primary" />} label="Signature Looks" />
                <div className="space-y-3 mt-4">
                  {report.signatureLooks.slice(0, 3).map((look, i) => (
                    <div key={i} className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-5">
                      <h4 className="font-serif text-lg text-foreground mb-1.5">{look.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{look.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-primary/80 uppercase tracking-wider font-semibold">Key Pieces:</span>
                        {look.keyPieces.map((piece, j) => (
                          <span key={j} className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-xs text-foreground/80">
                            {piece}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stylist Note - Full width */}
        {report.finalStylistNote && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm p-8 text-center"
          >
            <Gem className="w-6 h-6 text-primary mx-auto mb-3" />
            <p className="font-serif text-lg text-foreground/90 italic leading-relaxed max-w-2xl mx-auto">
              "{report.finalStylistNote}"
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4 pt-2 pb-10"
        >
          <Button 
            variant="luxury" 
            className="gap-2 h-12 px-10 text-sm font-semibold uppercase tracking-wider"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download PDF Report
          </Button>
          <Button 
            variant="luxuryOutline" 
            className="gap-2 h-12 px-10 text-sm font-semibold uppercase tracking-wider"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Mobile Layout (original) ──
  return (
    <div ref={reportRef} className="space-y-5 max-w-lg mx-auto px-1">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/7]">
        <img 
          src={heroFashion} 
          alt="Style Dossier" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-4 left-5 z-10">
          <h2 className="font-serif text-2xl text-foreground italic leading-tight">Style Dossier</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* ── Signature Style Identity ── */}
      <div className="rounded-2xl border border-border/30 bg-card/40 p-5">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full text-primary text-[11px] font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3 h-3" />
          Signature Style Identity
        </div>
        <h3 className="font-serif text-2xl text-foreground leading-snug mb-2">
          {styleIdentityTitle}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {styleIdentityDesc}
        </p>
      </div>

      {/* ── Color Analysis ── */}
      <SectionHeader icon={<Sun className="w-4 h-4 text-primary" />} label="Color Analysis" />
      <div className="rounded-2xl border border-border/30 bg-card/40 p-5">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">Power Colors</p>
        <div className="flex gap-3 flex-wrap mb-5">
          {report.bestColors.slice(0, 5).map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div 
                className="w-11 h-11 rounded-full border-2 border-border/40 shadow-lg" 
                style={{ backgroundColor: color.hex }} 
              />
              <span className="text-[10px] text-muted-foreground">{color.color}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">Colors to Avoid</p>
        <div className="flex gap-3 flex-wrap">
          {report.colorsToAvoid.slice(0, 4).map((color, i) => (
            <div key={i} className="relative flex flex-col items-center gap-1.5">
              <div 
                className="w-8 h-8 rounded-full border-2 border-border/40 opacity-70" 
                style={{ backgroundColor: color.hex }} 
              />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                <X className="w-2.5 h-2.5 text-destructive-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">{color.color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Styling Guidance ── */}
      <SectionHeader icon={<Crown className="w-4 h-4 text-primary" />} label="Styling Guidance" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-primary/20 bg-card/40 p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Best For You</span>
          </div>
          <div className="space-y-2">
            {(report.stylingDos || report.bodyTypeAnalysis.strengths || []).slice(0, 3).map((item, i) => (
              <p key={i} className="text-[13px] text-foreground/90 leading-snug">{item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/30 bg-card/40 p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <X className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Avoid</span>
          </div>
          <div className="space-y-2">
            {(report.stylingDonts || report.bodyTypeAnalysis.avoidStyles || []).slice(0, 3).map((item, i) => (
              <p key={i} className="text-[13px] text-muted-foreground leading-snug">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ideal Fabrics ── */}
      {idealFabrics.length > 0 && (
        <>
          <SectionHeader icon={<Heart className="w-4 h-4 text-primary" />} label="Ideal Fabrics" />
          <div className="flex flex-wrap gap-2">
            {idealFabrics.map((fabric, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-card/60 border border-border/30 text-sm text-foreground font-medium">
                {fabric}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── Action Buttons ── */}
      <div className="space-y-3 pt-2 pb-8">
        <Button 
          variant="luxury" 
          className="w-full gap-2 h-12 text-sm font-semibold uppercase tracking-wider"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
        <Button 
          variant="luxuryOutline" 
          className="w-full gap-2 h-12 text-sm font-semibold uppercase tracking-wider"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </div>
    </div>
  );
};

/* ── Reusable Section Header ── */
const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2.5 pt-1">
    {icon}
    <div className="w-1 h-4 rounded-full bg-primary" />
    <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
  </div>
);

export default StyleReportCard;
