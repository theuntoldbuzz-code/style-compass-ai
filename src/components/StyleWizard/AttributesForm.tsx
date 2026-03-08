import { User, Palette, Sparkles, CircleUser } from "lucide-react";
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

interface AttributeCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const AttributeCard = ({ icon, label, value, placeholder, options, onChange }: AttributeCardProps) => (
  <div className="rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm p-4 md:p-6 transition-all duration-300 hover:border-primary/20">
    <div className="flex items-center gap-3 mb-3 md:mb-4">
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
        {icon}
      </div>
      <Label className="font-serif text-base md:text-lg text-foreground">{label}</Label>
    </div>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="luxury-input w-full h-11 rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-card border-border rounded-xl">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

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
    <div className="space-y-4 md:space-y-6">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-2 md:mb-3">
          Tell Us About <span className="text-gradient-gold">Yourself</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          These details help us find colors and styles that suit you perfectly
        </p>
      </div>

      <div className="grid gap-3 md:gap-6 md:grid-cols-2">
        <AttributeCard
          icon={<User className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
          label="Gender"
          value={gender}
          placeholder="Select your gender"
          options={genderOptions}
          onChange={onGenderChange}
        />
        <AttributeCard
          icon={<Palette className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
          label="Skin Tone"
          value={skinTone}
          placeholder="Select your skin tone"
          options={skinToneOptions}
          onChange={onSkinToneChange}
        />
        <AttributeCard
          icon={<Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
          label="Hair Color"
          value={hairColor}
          placeholder="Select your hair color"
          options={hairColorOptions}
          onChange={onHairColorChange}
        />
        <AttributeCard
          icon={<CircleUser className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
          label="Body Type"
          value={bodyType}
          placeholder="Select your body type"
          options={bodyTypeOptions}
          onChange={onBodyTypeChange}
        />
      </div>
    </div>
  );
};

export default AttributesForm;
