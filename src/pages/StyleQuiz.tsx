import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Palette, 
  User, Ruler, Calendar, Wand2, Star, Flame, Crown,
  Flower2, Zap, Heart
} from "lucide-react";
import fashionQuiz1 from "@/assets/fashion-7.avif";
import fashionQuiz2 from "@/assets/fashion-8.avif";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizAnswer {
  preferredColors: string[];
  bodyType: string;
  heightShape: string;
  occasion: string;
  stylePersonality: string;
  budget: string;
}

const questions = [
  {
    id: "preferredColors",
    title: "What colors do you love wearing?",
    subtitle: "Select up to 3 colors that make you feel confident",
    icon: Palette,
    type: "multi",
    options: [
      { value: "neutral", label: "Neutrals", colors: ["#F5F5DC", "#D4B896", "#8B7355"], desc: "Beige, Cream, Brown" },
      { value: "bold", label: "Bold & Bright", colors: ["#FF0000", "#FF6B00", "#FFD700"], desc: "Red, Orange, Yellow" },
      { value: "cool", label: "Cool Tones", colors: ["#4169E1", "#008080", "#800080"], desc: "Blue, Teal, Purple" },
      { value: "pastel", label: "Soft Pastels", colors: ["#FFB6C1", "#E6E6FA", "#98FB98"], desc: "Pink, Lavender, Mint" },
      { value: "earth", label: "Earth Tones", colors: ["#228B22", "#8B4513", "#B7410E"], desc: "Green, Rust, Terracotta" },
      { value: "monochrome", label: "Black & White", colors: ["#000000", "#FFFFFF", "#808080"], desc: "Classic Monochrome" },
    ]
  },
  {
    id: "bodyType",
    title: "What's your body type?",
    subtitle: "This helps us recommend the most flattering silhouettes",
    icon: User,
    type: "single",
    options: [
      { value: "hourglass", label: "Hourglass", desc: "Balanced bust & hips, defined waist" },
      { value: "pear", label: "Pear", desc: "Hips wider than shoulders" },
      { value: "apple", label: "Apple", desc: "Fuller midsection" },
      { value: "rectangle", label: "Rectangle", desc: "Balanced proportions, less defined waist" },
      { value: "inverted", label: "Inverted Triangle", desc: "Broader shoulders, narrower hips" },
      { value: "athletic", label: "Athletic", desc: "Toned, muscular build" },
    ]
  },
  {
    id: "heightShape",
    title: "What's your height?",
    subtitle: "Different heights suit different proportions",
    icon: Ruler,
    type: "single",
    options: [
      { value: "petite", label: "Petite", desc: "Under 5'3\" (160 cm)" },
      { value: "average", label: "Average", desc: "5'3\" - 5'6\" (160-168 cm)" },
      { value: "tall", label: "Tall", desc: "5'7\" - 5'10\" (170-178 cm)" },
      { value: "very-tall", label: "Very Tall", desc: "Above 5'10\" (178 cm)" },
    ]
  },
  {
    id: "occasion",
    title: "What do you dress for most often?",
    subtitle: "We'll prioritize outfits for your lifestyle",
    icon: Calendar,
    type: "single",
    options: [
      { value: "casual", label: "Everyday Casual", desc: "Relaxed, comfortable daily wear" },
      { value: "work", label: "Office & Work", desc: "Professional, business attire" },
      { value: "party", label: "Party & Events", desc: "Glamorous, eye-catching looks" },
      { value: "date", label: "Date Nights", desc: "Romantic, elegant styles" },
      { value: "ethnic", label: "Traditional & Ethnic", desc: "Indian wear, festivities" },
      { value: "mix", label: "Mix of Everything", desc: "Versatile wardrobe needs" },
    ]
  },
  {
    id: "stylePersonality",
    title: "What's your style personality?",
    subtitle: "Choose the vibe that resonates with you",
    icon: Wand2,
    type: "single",
    options: [
      { value: "bold", label: "Bold & Trendy", desc: "Love standing out, trying new trends", styleIcon: "Flame" },
      { value: "minimal", label: "Minimal & Clean", desc: "Less is more, timeless pieces", styleIcon: "Sparkles" },
      { value: "classic", label: "Classic & Elegant", desc: "Sophisticated, never goes out of style", styleIcon: "Crown" },
      { value: "boho", label: "Bohemian & Free", desc: "Flowy, artistic, nature-inspired", styleIcon: "Flower2" },
      { value: "edgy", label: "Edgy & Street", desc: "Urban, statement-making, cool", styleIcon: "Zap" },
      { value: "romantic", label: "Romantic & Feminine", desc: "Soft, delicate, dreamy", styleIcon: "Heart" },
    ]
  },
  {
    id: "budget",
    title: "What's your typical budget per outfit?",
    subtitle: "We'll find the best options within your range",
    icon: Star,
    type: "single",
    options: [
      { value: "budget", label: "Budget Friendly", desc: "Under ₹1,500" },
      { value: "mid", label: "Mid Range", desc: "₹1,500 - ₹5,000" },
      { value: "premium", label: "Premium", desc: "₹5,000 - ₹15,000" },
      { value: "luxury", label: "Luxury", desc: "₹15,000+" },
    ]
  }
];

const StyleQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({
    preferredColors: [],
    bodyType: "",
    heightShape: "",
    occasion: "",
    stylePersonality: "",
    budget: ""
  });
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (value: string) => {
    if (question.type === "multi") {
      const current = answers.preferredColors;
      if (current.includes(value)) {
        setAnswers({ ...answers, preferredColors: current.filter(c => c !== value) });
      } else if (current.length < 3) {
        setAnswers({ ...answers, preferredColors: [...current, value] });
      }
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const isSelected = (value: string) => {
    if (question.type === "multi") {
      return answers.preferredColors.includes(value);
    }
    return answers[question.id as keyof QuizAnswer] === value;
  };

  const canProceed = () => {
    if (question.type === "multi") {
      return answers.preferredColors.length > 0;
    }
    return answers[question.id as keyof QuizAnswer] !== "";
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleGetResults = () => {
    // Map quiz answers to UserProfile format
    const profile = {
      gender: "unisex",
      skinTone: "medium",
      hairColor: "black",
      bodyType: answers.bodyType,
      occasion: answers.occasion,
      season: "summer",
      budgetMin: answers.budget === "budget" ? 0 : answers.budget === "mid" ? 1500 : answers.budget === "premium" ? 5000 : 15000,
      budgetMax: answers.budget === "budget" ? 1500 : answers.budget === "mid" ? 5000 : answers.budget === "premium" ? 15000 : 50000,
      preferredColors: answers.preferredColors,
      stylePersonality: answers.stylePersonality,
      heightShape: answers.heightShape,
    };
    navigate("/recommendations", { state: { profile, fromQuiz: true } });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        </div>
        
        {/* Decorative Fashion Images */}
        <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 w-48 aspect-[3/4] rounded-2xl overflow-hidden opacity-30 rotate-[-6deg]">
          <img src={fashionQuiz1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-48 aspect-[3/4] rounded-2xl overflow-hidden opacity-30 rotate-[6deg]">
          <img src={fashionQuiz2} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="luxury-card p-8 md:p-12 text-center max-w-lg relative z-10 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl text-foreground mb-4">
            Your Style Profile is <span className="text-gradient-gold">Ready!</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Based on your answers, we've created a personalized style profile just for you. 
            Get ready to discover outfits that match your unique personality!
          </p>
          
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Style</p>
              <p className="text-sm font-medium text-foreground capitalize">{answers.stylePersonality}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Occasion</p>
              <p className="text-sm font-medium text-foreground capitalize">{answers.occasion}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Body Type</p>
              <p className="text-sm font-medium text-foreground capitalize">{answers.bodyType}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-medium text-foreground capitalize">{answers.budget}</p>
            </div>
          </div>
          
          <Button variant="luxury" size="xl" onClick={handleGetResults} className="w-full">
            <Sparkles className="w-5 h-5 mr-2" />
            See My Personalized Looks
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = question.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="w-20" />
        </div>
        
        {/* Progress */}
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Question */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <IconComponent className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
            {question.title}
          </h1>
          <p className="text-muted-foreground">
            {question.subtitle}
          </p>
          {question.type === "multi" && (
            <p className="text-primary text-sm mt-2">
              Selected: {answers.preferredColors.length}/3
            </p>
          )}
        </div>

        {/* Options */}
        <div className={`grid gap-3 mb-10 ${question.options.length > 4 ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          {question.options.map((option, index) => {
            const selected = isSelected(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`luxury-card p-4 text-left transition-all duration-300 animate-fade-in group ${
                  selected 
                    ? 'border-primary bg-primary/5 shadow-gold' 
                    : 'hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Color swatches for color question */}
                  {'colors' in option && (
                    <div className="flex gap-1">
                      {option.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-border/50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Icon for style personality */}
                  {'styleIcon' in option && (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {option.styleIcon === "Flame" && <Flame className="w-5 h-5 text-primary" />}
                      {option.styleIcon === "Sparkles" && <Sparkles className="w-5 h-5 text-primary" />}
                      {option.styleIcon === "Crown" && <Crown className="w-5 h-5 text-primary" />}
                      {option.styleIcon === "Flower2" && <Flower2 className="w-5 h-5 text-primary" />}
                      {option.styleIcon === "Zap" && <Zap className="w-5 h-5 text-primary" />}
                      {option.styleIcon === "Heart" && <Heart className="w-5 h-5 text-primary" />}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{option.label}</h3>
                      {selected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            variant="luxury"
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StyleQuiz;
