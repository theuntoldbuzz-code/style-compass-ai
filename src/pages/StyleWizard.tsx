import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoUpload from "@/components/StyleWizard/PhotoUpload";
import AttributesForm from "@/components/StyleWizard/AttributesForm";
import OccasionForm from "@/components/StyleWizard/OccasionForm";
import BudgetForm from "@/components/StyleWizard/BudgetForm";
import ProcessingScreen from "@/components/ProcessingScreen";
import { UserProfile } from "@/types/outfit";
import { PhotoAnalysisResult } from "@/types/styleReport";

const steps = [
  { id: 1, title: "Photo", subtitle: "Upload your photo" },
  { id: 2, title: "About You", subtitle: "Your features" },
  { id: 3, title: "Occasion", subtitle: "When & where" },
  { id: 4, title: "Budget", subtitle: "Your range" },
];

const StyleWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    photo: null,
    gender: "",
    skinTone: "",
    hairColor: "",
    bodyType: "",
    occasion: "",
    season: "",
    budgetMin: 5000,
    budgetMax: 25000,
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and process
      setIsProcessing(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProcessingComplete = (photoAnalysis?: PhotoAnalysisResult | null) => {
    navigate("/recommendations", { state: { profile, photoAnalysis } });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Photo is optional
      case 2:
        return profile.gender && profile.skinTone && profile.hairColor && profile.bodyType;
      case 3:
        return profile.occasion && profile.season;
      case 4:
        return profile.budgetMin > 0 && profile.budgetMax > profile.budgetMin;
      default:
        return false;
    }
  };

  const getValidationMessage = () => {
    switch (currentStep) {
      case 2:
        const missing = [];
        if (!profile.gender) missing.push("gender");
        if (!profile.skinTone) missing.push("skin tone");
        if (!profile.hairColor) missing.push("hair color");
        if (!profile.bodyType) missing.push("body type");
        return missing.length > 0 ? `Please select your ${missing.join(", ")}` : "";
      case 3:
        if (!profile.occasion && !profile.season) return "Please select an occasion and season";
        if (!profile.occasion) return "Please select an occasion";
        if (!profile.season) return "Please select a season";
        return "";
      default:
        return "";
    }
  };

  if (isProcessing) {
    return <ProcessingScreen onComplete={handleProcessingComplete} photo={profile.photo} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg">LuxFit AI</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 4
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-secondary">
        <div 
          className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-500"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-2 md:gap-4">
          {steps.map((step) => (
            <button 
              key={step.id}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              className={`flex items-center gap-2 transition-all ${
                step.id === currentStep 
                  ? 'text-foreground' 
                  : step.id < currentStep 
                    ? 'text-primary cursor-pointer hover:scale-105' 
                    : 'text-muted-foreground cursor-default'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                step.id === currentStep 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : step.id < currentStep 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border'
              }`}>
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-10 pb-24 sm:pb-10 max-w-4xl">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <PhotoUpload 
              photo={profile.photo}
              onPhotoChange={(photo) => setProfile({ ...profile, photo })}
            />
          )}
          {currentStep === 2 && (
            <AttributesForm
              gender={profile.gender}
              skinTone={profile.skinTone}
              hairColor={profile.hairColor}
              bodyType={profile.bodyType}
              onGenderChange={(gender) => setProfile({ ...profile, gender })}
              onSkinToneChange={(skinTone) => setProfile({ ...profile, skinTone })}
              onHairColorChange={(hairColor) => setProfile({ ...profile, hairColor })}
              onBodyTypeChange={(bodyType) => setProfile({ ...profile, bodyType })}
            />
          )}
          {currentStep === 3 && (
            <OccasionForm
              occasion={profile.occasion}
              season={profile.season}
              onOccasionChange={(occasion) => setProfile({ ...profile, occasion })}
              onSeasonChange={(season) => setProfile({ ...profile, season })}
            />
          )}
          {currentStep === 4 && (
            <BudgetForm
              budgetMin={profile.budgetMin}
              budgetMax={profile.budgetMax}
              onBudgetMinChange={(budgetMin) => setProfile({ ...profile, budgetMin })}
              onBudgetMaxChange={(budgetMax) => setProfile({ ...profile, budgetMax })}
            />
          )}
        </div>

        {/* Validation Message */}
        {!isStepValid() && getValidationMessage() && (
          <div className="mt-6 flex items-center gap-2 text-primary bg-primary/10 px-4 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{getValidationMessage()}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
          <Button
            variant="luxuryOutline"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            variant="luxury"
            size="lg"
            onClick={handleNext}
            disabled={!isStepValid()}
            className={!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentStep === 4 ? (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get Recommendations
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StyleWizard;
