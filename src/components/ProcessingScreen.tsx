import { useEffect, useState, useCallback } from "react";
import { Sparkles, Scan, Palette, ShoppingBag, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhotoAnalysisResult } from "@/types/styleReport";

interface ProcessingScreenProps {
  onComplete: (photoAnalysis?: PhotoAnalysisResult | null) => void;
  photo?: File | null;
}

const processingSteps = [
  { icon: Scan, text: "Analyzing your photo with AI", duration: 3000 },
  { icon: Palette, text: "Detecting your unique coloring", duration: 2000 },
  { icon: ShoppingBag, text: "Finding matching outfits", duration: 1500 },
  { icon: Sparkles, text: "Personalizing recommendations", duration: 1500 },
];

const noPhotoSteps = [
  { icon: Palette, text: "Analyzing your style profile", duration: 1500 },
  { icon: ShoppingBag, text: "Finding matching outfits", duration: 1300 },
  { icon: Sparkles, text: "Personalizing recommendations", duration: 1200 },
];

const ProcessingScreen = ({ onComplete, photo }: ProcessingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const steps = photo ? processingSteps : noPhotoSteps;

  const analyzePhoto = useCallback(async () => {
    if (!photo) {
      setAnalysisComplete(true);
      return null;
    }

    try {
      // Convert photo to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(photo);
      });

      const imageBase64 = await base64Promise;

      // Photo sent for AI analysis

      const { data, error } = await supabase.functions.invoke('photos-analysis', {
        body: {
          image_base64: imageBase64,
        },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;
        if (status === 429) {
          throw new Error("AI is busy right now. Please wait a few seconds and try again.");
        }
        if (status === 402) {
          throw new Error("AI credits are exhausted. Please try again later.");
        }
        throw new Error(error.message);
      }

      console.log("Photo analysis result:", data);

      if (!data.isHuman) {
        setAnalysisError(data.error || "Please upload a clear photo of yourself");
        return null;
      }

      setPhotoAnalysis(data);
      return data as PhotoAnalysisResult;
    } catch (err) {
      console.error("Photo analysis error:", err);
      setAnalysisError(err instanceof Error ? err.message : "Failed to analyze photo");
      return null;
    } finally {
      setAnalysisComplete(true);
    }
  }, [photo]);

  useEffect(() => {
    // Start photo analysis immediately if photo exists
    if (photo) {
      analyzePhoto();
    }
  }, [photo, analyzePhoto]);

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Calculate which step we're on
      let stepElapsed = 0;
      for (let i = 0; i < steps.length; i++) {
        stepElapsed += steps[i].duration;
        if (elapsed < stepElapsed) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval);
        // Wait for analysis to complete if we have a photo
        if (photo && !analysisComplete) {
          const checkInterval = setInterval(() => {
            if (analysisComplete) {
              clearInterval(checkInterval);
              setTimeout(() => onComplete(photoAnalysis), 500);
            }
          }, 100);
        } else {
          setTimeout(() => onComplete(photoAnalysis), 500);
        }
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [steps, onComplete, photo, analysisComplete, photoAnalysis]);

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
                const IconComponent = steps[currentStep]?.icon || Sparkles;
                return <IconComponent className="w-12 h-12 text-primary-foreground" />;
              })()}
            </div>
          </div>
        </div>

        {/* Current step text */}
        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3 animate-fade-in">
          {steps[currentStep]?.text}
        </h2>
        <p className="text-muted-foreground mb-8">
          {photo ? "Our AI is studying your unique features..." : "Creating your perfect look..."}
        </p>

        {/* Analysis status */}
        {photo && analysisComplete && (
          <div className={`mb-6 p-4 rounded-xl ${
            analysisError 
              ? 'bg-destructive/10 border border-destructive/20' 
              : 'bg-primary/10 border border-primary/20'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {analysisError ? (
                <>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm text-destructive">{analysisError}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm text-primary">Photo analyzed successfully!</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3">
          {steps.map((step, index) => (
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
