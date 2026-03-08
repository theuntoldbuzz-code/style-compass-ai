import { Wallet, IndianRupee, Lightbulb } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface BudgetFormProps {
  budgetMin: number;
  budgetMax: number;
  onBudgetMinChange: (value: number) => void;
  onBudgetMaxChange: (value: number) => void;
}

const budgetRanges = [
  { label: "Budget Friendly", min: 2000, max: 8000, description: "Great value picks" },
  { label: "Mid Range", min: 8000, max: 20000, description: "Quality & style balance" },
  { label: "Premium", min: 20000, max: 50000, description: "Designer selections" },
  { label: "Luxury", min: 50000, max: 100000, description: "Top-tier fashion" },
];

const BudgetForm = ({
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
}: BudgetFormProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSliderChange = (values: number[]) => {
    onBudgetMinChange(values[0]);
    onBudgetMaxChange(values[1]);
  };

  const handlePresetClick = (min: number, max: number) => {
    onBudgetMinChange(min);
    onBudgetMaxChange(max);
  };

  return (
    <div className="space-y-5 md:space-y-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-2 md:mb-3">
          Set Your <span className="text-gradient-gold">Budget</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          We'll find the best outfits that match your style and budget
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <Label className="text-xs md:text-sm text-muted-foreground mb-3 block">Quick Select</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          {budgetRanges.map((range) => {
            const isSelected = budgetMin === range.min && budgetMax === range.max;
            return (
              <button
                key={range.label}
                onClick={() => handlePresetClick(range.min, range.max)}
                className={`p-3 md:p-4 rounded-xl border transition-all duration-300 text-center ${
                  isSelected
                    ? 'border-primary/50 bg-primary/8 shadow-gold'
                    : 'border-border/20 bg-card/40 hover:border-primary/20 hover:bg-card/60'
                }`}
              >
                <span className="block font-medium text-foreground text-xs md:text-sm">{range.label}</span>
                <span className="block text-[10px] md:text-xs text-muted-foreground mt-0.5">{range.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Display Card */}
      <div className="rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm p-5 md:p-8">
        <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
            <Wallet className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Your Budget Range</p>
            <p className="font-serif text-xl md:text-2xl text-foreground">
              {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2 md:px-4 mb-6 md:mb-8">
          <Slider
            value={[budgetMin, budgetMax]}
            onValueChange={handleSliderChange}
            min={1000}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-[10px] md:text-xs text-muted-foreground">
            <span>₹1,000</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div>
            <Label className="text-xs md:text-sm text-muted-foreground mb-1.5 block">Minimum</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              <Input
                type="number"
                value={budgetMin}
                onChange={(e) => onBudgetMinChange(Number(e.target.value))}
                className="luxury-input pl-8 md:pl-9 h-10 md:h-11 text-sm rounded-xl"
                min={1000}
                max={budgetMax - 1000}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs md:text-sm text-muted-foreground mb-1.5 block">Maximum</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              <Input
                type="number"
                value={budgetMax}
                onChange={(e) => onBudgetMaxChange(Number(e.target.value))}
                className="luxury-input pl-8 md:pl-9 h-10 md:h-11 text-sm rounded-xl"
                min={budgetMin + 1000}
                max={100000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="text-center px-4">
        <p className="text-xs md:text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
          We'll show you the best deals within your budget from top stores
        </p>
      </div>
    </div>
  );
};

export default BudgetForm;
