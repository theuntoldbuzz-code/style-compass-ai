import { useEffect, useState } from "react";
import { Sparkles, Scan, Palette, ShoppingBag } from "lucide-react";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const processingSteps = [
  { icon: Scan, text: "Analyzing your photo", duration: 1500 },
  { icon: Palette, text: "Detecting color preferences", duration: 1200 },
  { icon: ShoppingBag, text: "Finding matching outfits", duration: 1300 },
  { icon: Sparkles, text: "Comparing prices across stores", duration: 1000 },
];

const ProcessingScreen = ({ onComplete }: ProcessingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Calculate which step we're on
      let stepElapsed = 0;
      for (let i = 0; i < processingSteps.length; i++) {
        stepElapsed += processingSteps[i].duration;
        if (elapsed < stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        {/* Main icon animation */}
        <div className="mb-10 relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
            
            {/* Center icon */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse-gold">
              {(() => {
                const IconComponent = processingSteps[currentStep]?.icon || Sparkles;
                return <IconComponent className="w-12 h-12 text-primary-foreground" />;
              })()}
            </div>
          </div>
        </div>

        {/* Current step text */}
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3 animate-fade-in">
          {processingSteps[currentStep]?.text}
        </h2>
        <p className="text-muted-foreground mb-8">
          Creating your perfect look...
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3">
          {processingSteps.map((step, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-primary scale-100' 
                  : 'bg-secondary scale-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
