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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          Set Your <span className="text-gradient-gold">Budget</span>
        </h2>
        <p className="text-muted-foreground">
          We'll find the best outfits that match your style and budget
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <Label className="text-sm text-muted-foreground mb-4 block">Quick Select</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {budgetRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handlePresetClick(range.min, range.max)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                budgetMin === range.min && budgetMax === range.max
                  ? 'border-primary bg-primary/10 shadow-gold'
                  : 'border-border/50 bg-card/50 hover:border-primary/50'
              }`}
            >
              <span className="block font-medium text-foreground text-sm">{range.label}</span>
              <span className="block text-xs text-muted-foreground mt-1">{range.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Display Card */}
      <div className="luxury-card p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Your Budget Range</p>
            <p className="font-serif text-2xl text-foreground">
              {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="px-4 mb-8">
          <Slider
            value={[budgetMin, budgetMax]}
            onValueChange={handleSliderChange}
            min={1000}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>₹1,000</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Manual Input */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Minimum</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={budgetMin}
                onChange={(e) => onBudgetMinChange(Number(e.target.value))}
                className="luxury-input pl-9"
                min={1000}
                max={budgetMax - 1000}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Maximum</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={budgetMax}
                onChange={(e) => onBudgetMaxChange(Number(e.target.value))}
                className="luxury-input pl-9"
                min={budgetMin + 1000}
                max={100000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          We'll show you the best deals within your budget from top stores
        </p>
      </div>
    </div>
  );
};

export default BudgetForm;
