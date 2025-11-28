import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 300),
      setTimeout(() => setAnimationStage(2), 800),
      setTimeout(() => setAnimationStage(3), 1300),
      setTimeout(() => onComplete(), 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className={`absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 ${
            animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        />
        <div 
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl transition-all duration-1000 delay-200 ${
            animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo icon */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-gold-dark shadow-gold animate-pulse-gold">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Brand name */}
        <h1 
          className={`font-serif text-6xl md:text-7xl font-bold mb-4 transition-all duration-700 delay-100 ${
            animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-gradient-gold">Lux</span>
          <span className="text-foreground">Fit</span>
          <span className="text-primary ml-2">AI</span>
        </h1>

        {/* Tagline */}
        <p 
          className={`text-muted-foreground text-lg md:text-xl font-light tracking-wide transition-all duration-700 delay-200 ${
            animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Your Personal AI Style Curator
        </p>

        {/* Loading indicator */}
        <div 
          className={`mt-12 flex items-center justify-center gap-2 transition-all duration-700 delay-300 ${
            animationStage >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
};

export default SplashScreen;
