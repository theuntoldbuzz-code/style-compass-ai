import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoUpload from "@/components/StyleWizard/PhotoUpload";
import AttributesForm from "@/components/StyleWizard/AttributesForm";
import OccasionForm from "@/components/StyleWizard/OccasionForm";
import BudgetForm from "@/components/StyleWizard/BudgetForm";
import ProcessingScreen from "@/components/ProcessingScreen";
import { UserProfile } from "@/types/outfit";
import { PhotoAnalysisResult } from "@/types/styleReport";
import wizardBgPhoto from "@/assets/wizard-bg-photo.png";
import wizardBgAttributes from "@/assets/wizard-bg-attributes.png";
import wizardBgOccasion from "@/assets/wizard-bg-occasion.png";
import wizardBgBudget from "@/assets/wizard-bg-budget.png";

const stepBackgrounds: Record<number, string> = {
  1: wizardBgPhoto,
  2: wizardBgAttributes,
  3: wizardBgOccasion,
  4: wizardBgBudget,
};

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
        return true;
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mobile step-specific luxury background */}
      <img 
        src={stepBackgrounds[currentStep]} 
        alt="" 
        key={currentStep}
        className="md:hidden fixed inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0 transition-opacity duration-500" 
      />
      {/* Desktop subtle gradient overlay */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-serif text-base md:text-lg text-foreground">Aurion AI</span>
          </div>

          <div className="text-xs md:text-sm text-muted-foreground font-medium">
            Step {currentStep} of 4
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-0.5 md:h-1 bg-secondary relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-primary to-gold-light transition-all duration-700 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Step Indicators - compact on mobile */}
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
        <div className="flex justify-center gap-3 md:gap-4">
          {steps.map((step) => (
            <button 
              key={step.id}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 md:gap-2 transition-all duration-300 ${
                step.id === currentStep 
                  ? 'text-foreground' 
                  : step.id < currentStep 
                    ? 'text-primary cursor-pointer hover:scale-105' 
                    : 'text-muted-foreground/50 cursor-default'
              }`}
            >
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 ${
                step.id === currentStep 
                  ? 'bg-gradient-to-br from-primary to-gold-dark text-primary-foreground shadow-gold' 
                  : step.id < currentStep 
                    ? 'bg-primary/15 text-primary border border-primary/30' 
                    : 'bg-secondary/50 border border-border/30 text-muted-foreground/50'
              }`}>
                {step.id < currentStep ? <Check className="w-3.5 h-3.5" /> : step.id}
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
      <main className="relative z-10 container mx-auto px-4 py-2 md:py-8 pb-28 sm:pb-10 max-w-4xl">
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
          <div className="mt-4 md:mt-6 flex items-center gap-2 text-primary bg-primary/8 border border-primary/15 px-4 py-3 rounded-2xl backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{getValidationMessage()}</span>
          </div>
        )}

        {/* Navigation Buttons - fixed on mobile */}
        <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto bg-background/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t md:border-t-0 border-border/30 p-4 md:p-0 md:mt-10 md:pt-6 md:border-t md:border-border/50 z-40 flex items-center justify-between gap-3">
          <Button
            variant="luxuryOutline"
            size="lg"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex-1 md:flex-none h-12 md:h-auto rounded-2xl ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            variant="luxury"
            size="lg"
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex-1 md:flex-none h-12 md:h-auto rounded-2xl ${!isStepValid() ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {currentStep === 4 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Recommendations
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StyleWizard;
