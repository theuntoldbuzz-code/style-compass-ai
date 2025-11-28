import { User, Palette, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttributesFormProps {
  gender: string;
  skinTone: string;
  hairColor: string;
  bodyType: string;
  onGenderChange: (value: string) => void;
  onSkinToneChange: (value: string) => void;
  onHairColorChange: (value: string) => void;
  onBodyTypeChange: (value: string) => void;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
];

const skinToneOptions = [
  { value: "fair", label: "Fair" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "olive", label: "Olive" },
  { value: "tan", label: "Tan" },
  { value: "brown", label: "Brown" },
  { value: "dark", label: "Dark" },
];

const hairColorOptions = [
  { value: "black", label: "Black" },
  { value: "brown", label: "Brown" },
  { value: "blonde", label: "Blonde" },
  { value: "red", label: "Red" },
  { value: "gray", label: "Gray" },
  { value: "white", label: "White" },
];

const bodyTypeOptions = [
  { value: "slim", label: "Slim" },
  { value: "athletic", label: "Athletic" },
  { value: "average", label: "Average" },
  { value: "muscular", label: "Muscular" },
  { value: "heavy", label: "Heavy" },
];

const AttributesForm = ({
  gender,
  skinTone,
  hairColor,
  bodyType,
  onGenderChange,
  onSkinToneChange,
  onHairColorChange,
  onBodyTypeChange,
}: AttributesFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          Tell Us About <span className="text-gradient-gold">Yourself</span>
        </h2>
        <p className="text-muted-foreground">
          These details help us find colors and styles that suit you perfectly
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gender */}
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <Label className="font-serif text-lg text-foreground">Gender</Label>
          </div>
          <Select value={gender} onValueChange={onGenderChange}>
            <SelectTrigger className="luxury-input w-full">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {genderOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-primary/10 focus:bg-primary/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skin Tone */}
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <Label className="font-serif text-lg text-foreground">Skin Tone</Label>
          </div>
          <Select value={skinTone} onValueChange={onSkinToneChange}>
            <SelectTrigger className="luxury-input w-full">
              <SelectValue placeholder="Select your skin tone" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {skinToneOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-primary/10 focus:bg-primary/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hair Color */}
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <Label className="font-serif text-lg text-foreground">Hair Color</Label>
          </div>
          <Select value={hairColor} onValueChange={onHairColorChange}>
            <SelectTrigger className="luxury-input w-full">
              <SelectValue placeholder="Select your hair color" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {hairColorOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-primary/10 focus:bg-primary/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Body Type */}
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <Label className="font-serif text-lg text-foreground">Body Type</Label>
          </div>
          <Select value={bodyType} onValueChange={onBodyTypeChange}>
            <SelectTrigger className="luxury-input w-full">
              <SelectValue placeholder="Select your body type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {bodyTypeOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-primary/10 focus:bg-primary/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AttributesForm;
