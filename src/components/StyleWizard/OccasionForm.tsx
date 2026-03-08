import { Calendar, Sun, Cloud, Snowflake, Leaf, PartyPopper, Briefcase, Heart, Users, Shirt } from "lucide-react";
import { Label } from "@/components/ui/label";

interface OccasionFormProps {
  occasion: string;
  season: string;
  onOccasionChange: (value: string) => void;
  onSeasonChange: (value: string) => void;
}

const occasions = [
  { value: "wedding", label: "Wedding", icon: Heart, description: "Elegant & Traditional" },
  { value: "diwali", label: "Diwali", icon: PartyPopper, description: "Festive & Bright" },
  { value: "office", label: "Office", icon: Briefcase, description: "Professional & Sharp" },
  { value: "date-night", label: "Date Night", icon: Heart, description: "Romantic & Stylish" },
  { value: "party", label: "Party", icon: PartyPopper, description: "Bold & Fun" },
  { value: "casual", label: "Casual", icon: Shirt, description: "Relaxed & Comfortable" },
  { value: "formal", label: "Formal Event", icon: Users, description: "Sophisticated & Classic" },
  { value: "christmas", label: "Christmas", icon: PartyPopper, description: "Festive & Cozy" },
];

const seasons = [
  { value: "summer", label: "Summer", icon: Sun, colors: ["#FFB347", "#FFCC33", "#FF6B6B"] },
  { value: "monsoon", label: "Monsoon", icon: Cloud, colors: ["#4A90A4", "#6B8E23", "#2F4F4F"] },
  { value: "winter", label: "Winter", icon: Snowflake, colors: ["#4169E1", "#8B4513", "#800020"] },
  { value: "spring", label: "Spring", icon: Leaf, colors: ["#98FB98", "#FFB6C1", "#DDA0DD"] },
];

const OccasionForm = ({
  occasion,
  season,
  onOccasionChange,
  onSeasonChange,
}: OccasionFormProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-2 md:mb-3">
          Where Will You <span className="text-gradient-gold">Shine</span>?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Tell us the occasion and season for perfectly tailored recommendations
        </p>
      </div>

      {/* Occasion Selection */}
      <div>
        <div className="flex items-center gap-2.5 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <Label className="font-serif text-lg md:text-xl text-foreground">Select Occasion</Label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {occasions.map((item) => {
            const IconComponent = item.icon;
            const isSelected = occasion === item.value;
            return (
              <button
                key={item.value}
                onClick={() => onOccasionChange(item.value)}
                className={`p-3 md:p-4 rounded-2xl border transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-primary/50 bg-primary/8 shadow-gold'
                    : 'border-border/20 bg-card/40 hover:border-primary/20 hover:bg-card/60'
                }`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-2.5 md:mb-3 transition-all ${
                  isSelected ? 'bg-gradient-to-br from-primary to-gold-dark text-primary-foreground shadow-gold' : 'bg-secondary/60'
                }`}>
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h4 className="font-medium text-foreground text-sm md:text-base leading-tight">{item.label}</h4>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Season Selection */}
      <div>
        <div className="flex items-center gap-2.5 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
            <Sun className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <Label className="font-serif text-lg md:text-xl text-foreground">Select Season</Label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
          {seasons.map((item) => {
            const IconComponent = item.icon;
            const isSelected = season === item.value;
            return (
              <button
                key={item.value}
                onClick={() => onSeasonChange(item.value)}
                className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-primary/50 bg-primary/8 shadow-gold'
                    : 'border-border/20 bg-card/40 hover:border-primary/20 hover:bg-card/60'
                }`}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto transition-all ${
                  isSelected ? 'bg-gradient-to-br from-primary to-gold-dark text-primary-foreground shadow-gold' : 'bg-secondary/60'
                }`}>
                  <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h4 className="font-serif text-base md:text-lg font-medium text-foreground text-center">{item.label}</h4>
                
                <div className="flex justify-center gap-1.5 mt-2.5 md:mt-3">
                  {item.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OccasionForm;
