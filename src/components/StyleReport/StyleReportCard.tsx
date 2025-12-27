import { StyleReport } from "@/types/styleReport";
import { 
  Sparkles, 
  Palette, 
  Ban, 
  Grid3X3, 
  Shirt, 
  Lightbulb,
  Crown,
  Gem,
  ShoppingBag,
  Footprints,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface StyleReportCardProps {
  report: StyleReport;
  userName?: string;
}

const StyleReportCard = ({ report, userName = "Style Enthusiast" }: StyleReportCardProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  // HTML escape function to prevent XSS
  const escapeHtml = (str: string): string => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LuxFit AI - Your Personal Style Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Georgia', serif; 
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
              color: #fff;
              padding: 40px;
              min-height: 100vh;
            }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #d4af37; }
            .header h1 { font-size: 36px; color: #d4af37; margin-bottom: 10px; }
            .header p { color: #888; font-size: 14px; }
            .section { margin-bottom: 30px; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 12px; }
            .section h2 { color: #d4af37; font-size: 20px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
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
            .signature-look .pieces { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
            .signature-look .piece { background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 12px; }
            .section-icon { display: inline-block; width: 24px; height: 24px; background: #d4af37; border-radius: 6px; margin-right: 10px; vertical-align: middle; }
            @media print {
              body { background: #fff; color: #000; }
              .section { background: #f5f5f5; }
              .section h2 { color: #b8860b; }
              .section p, .tips-list li { color: #333; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LuxFit AI</h1>
            <p>Your Personal Style Report • Generated ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Skin Tone Analysis</h2>
            <p><strong>Undertone:</strong> ${escapeHtml(report.skinToneAnalysis.undertone)}</p>
            <p><strong>Season Type:</strong> ${escapeHtml(report.skinToneAnalysis.seasonType)}</p>
            <p style="margin-top: 10px;">${escapeHtml(report.skinToneAnalysis.description)}</p>
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Body Type Analysis</h2>
            <p><strong>Body Type:</strong> ${escapeHtml(report.bodyTypeAnalysis.type)}</p>
            <p><strong>Strengths:</strong> ${report.bodyTypeAnalysis.strengths.map(s => escapeHtml(s)).join(', ')}</p>
            <p style="margin-top: 10px;">${escapeHtml(report.bodyTypeAnalysis.stylingFocus)}</p>
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Your Best Colors</h2>
            <div class="color-grid">
              ${report.bestColors.map(c => `
                <div class="color-item">
                  <div class="color-swatch" style="background-color: ${escapeHtml(c.hex)}"></div>
                  <div class="color-info">
                    <div class="color-name">${escapeHtml(c.color)}</div>
                    <div class="color-reason">${escapeHtml(c.reason)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Colors to Avoid</h2>
            <div class="color-grid">
              ${report.colorsToAvoid.map(c => `
                <div class="color-item">
                  <div class="color-swatch" style="background-color: ${escapeHtml(c.hex)}"></div>
                  <div class="color-info">
                    <div class="color-name">${escapeHtml(c.color)}</div>
                    <div class="color-reason">${escapeHtml(c.reason)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Your 3 Signature Looks</h2>
            ${report.signatureLooks.map(look => `
              <div class="signature-look">
                <h3>${escapeHtml(look.name)}</h3>
                <p>${escapeHtml(look.description)}</p>
                <p style="margin-top: 8px; font-size: 12px; color: #888;">Best for: ${escapeHtml(look.occasion)}</p>
                <div class="pieces">
                  ${look.keyPieces.map(piece => `<span class="piece">${escapeHtml(piece)}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2><span class="section-icon"></span>Personalized Styling Tips</h2>
            <ul class="tips-list">
              ${report.stylingTips.map(tip => `<li>• ${escapeHtml(tip)}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div ref={reportRef} className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-border/50">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Generated Style Report
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
          Your Personal <span className="text-gradient-gold">Style DNA</span>
        </h2>
        <p className="text-muted-foreground">
          Curated exclusively for you by LuxFit AI
        </p>
        
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="luxury" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button variant="luxuryOutline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Skin Tone Analysis */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-foreground">Skin Tone Analysis</h3>
            <p className="text-sm text-muted-foreground">Your color season: {report.skinToneAnalysis.seasonType}</p>
          </div>
        </div>
        <div className="bg-secondary/30 rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-1">Undertone</p>
          <p className="text-foreground font-medium capitalize">{report.skinToneAnalysis.undertone}</p>
        </div>
        <p className="text-muted-foreground leading-relaxed">{report.skinToneAnalysis.description}</p>
      </div>

      {/* Body Type Analysis */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Shirt className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-foreground">Body Type Analysis</h3>
            <p className="text-sm text-muted-foreground">Type: {report.bodyTypeAnalysis.type}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {report.bodyTypeAnalysis.strengths.map((strength, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              {strength}
            </span>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed">{report.bodyTypeAnalysis.stylingFocus}</p>
      </div>

      {/* Best Colors */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Your Best Colors</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {report.bestColors.map((color, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <div 
                className="w-12 h-12 rounded-full border-2 border-border shadow-lg flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{color.color}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{color.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colors to Avoid */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <Ban className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Colors to Avoid</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {report.colorsToAvoid.map((color, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              <div 
                className="w-10 h-10 rounded-full border-2 border-border opacity-60 flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{color.color}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{color.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Patterns */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Best Patterns for You</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {report.bestPatterns.map((pattern, i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="font-medium text-foreground mb-1">{pattern.pattern}</p>
              <p className="text-sm text-muted-foreground">{pattern.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Looks */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Your 3 Signature Looks</h3>
        </div>
        <div className="space-y-4">
          {report.signatureLooks.map((look, i) => (
            <div key={i} className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-serif text-lg text-foreground">{look.name}</h4>
                  <p className="text-sm text-primary">{look.occasion}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif">
                  {i + 1}
                </div>
              </div>
              <p className="text-muted-foreground mb-3">{look.description}</p>
              <div className="flex flex-wrap gap-2">
                {look.keyPieces.map((piece, j) => (
                  <span key={j} className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styling Tips */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Personalized Styling Tips</h3>
        </div>
        <div className="space-y-3">
          {report.stylingTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accessory Guide */}
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
            <Gem className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">Accessory Guide</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <Gem className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-foreground mb-1">Jewelry</p>
            <p className="text-sm text-muted-foreground">{report.accessoryGuide.jewelry}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-foreground mb-1">Bags</p>
            <p className="text-sm text-muted-foreground">{report.accessoryGuide.bags}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <Footprints className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-foreground mb-1">Shoes</p>
            <p className="text-sm text-muted-foreground">{report.accessoryGuide.shoes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleReportCard;
