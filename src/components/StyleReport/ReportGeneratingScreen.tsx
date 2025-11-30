import { useEffect, useState } from "react";
import { Sparkles, Palette, Shirt, Check } from "lucide-react";

interface ReportGeneratingScreenProps {
  onComplete: () => void;
  duration?: number;
}

const steps = [
  { icon: Palette, label: "Analyzing your color profile...", duration: 25 },
  { icon: Shirt, label: "Identifying your body type...", duration: 25 },
  { icon: Sparkles, label: "Curating your signature looks...", duration: 25 },
  { icon: Check, label: "Generating personalized report...", duration: 25 },
];

const ReportGeneratingScreen = ({ onComplete, duration = 90 }: ReportGeneratingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = steps.length;
    const stepDuration = (duration * 1000) / totalSteps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration * 10));
        return Math.min(newProgress, 100);
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated Logo */}
        <div className="relative mb-12">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center animate-pulse-gold">
            <Sparkles className="w-16 h-16 text-primary-foreground animate-float" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary to-gold-dark opacity-50 blur-xl animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          Creating Your <span className="text-gradient-gold">Style Report</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Our AI is analyzing your unique features to craft a personalized style guide
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div 
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-primary/10 border border-primary/30' 
                    : isComplete 
                      ? 'bg-secondary/30' 
                      : 'opacity-40'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isComplete 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                }`}>
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`text-sm ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timer */}
        <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          90-second magic in progress...
        </p>
      </div>
    </div>
  );
};

export default ReportGeneratingScreen;
