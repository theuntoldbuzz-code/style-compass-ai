import { OutfitRecommendation } from "@/types/outfit";
import OutfitCard from "@/components/OutfitCard";
import { Sparkles, Heart, PartyPopper, Briefcase, Sun, Snowflake, GraduationCap, Calendar } from "lucide-react";

interface OccasionSectionProps {
  title: string;
  subtitle: string;
  icon: "wedding" | "festive" | "office" | "casual" | "winter" | "college" | "party";
  outfits: OutfitRecommendation[];
  stylingTip: string;
}

const iconMap = {
  wedding: Heart,
  festive: PartyPopper,
  office: Briefcase,
  casual: Sun,
  winter: Snowflake,
  college: GraduationCap,
  party: Calendar,
};

const OccasionSection = ({ title, subtitle, icon, outfits, stylingTip }: OccasionSectionProps) => {
  const IconComponent = iconMap[icon];

  if (outfits.length === 0) return null;

  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-gold-dark mb-4 shadow-gold">
          <IconComponent className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
      </div>

      {/* AI Styling Tip */}
      <div className="luxury-card p-5 mb-8 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-primary font-medium mb-1">AI Styling Tip</p>
            <p className="text-muted-foreground">{stylingTip}</p>
          </div>
        </div>
      </div>

      {/* Outfit Cards */}
      <div className="space-y-6">
        {outfits.map((outfit, index) => (
          <OutfitCard key={outfit.id} outfit={outfit} index={index} />
        ))}
      </div>
    </section>
  );
};

export default OccasionSection;
