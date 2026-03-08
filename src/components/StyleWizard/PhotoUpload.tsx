import { useState, useRef } from "react";
import { Upload, Camera, User, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  photo: File | null;
  onPhotoChange: (photo: File | null) => void;
}

const PhotoUpload = ({ photo, onPhotoChange }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onPhotoChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearPhoto = () => {
    onPhotoChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="text-center mb-4 md:mb-8">
        <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-2 md:mb-3">
          Let's Start with <span className="text-gradient-gold">You</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          Upload a photo for AI-powered style analysis, or skip to enter details manually
        </p>
      </div>

      {preview ? (
        <div className="relative max-w-xs mx-auto">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-primary/20 shadow-gold-glow">
            <img 
              src={preview} 
              alt="Your photo" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={clearPhoto}
            className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-4 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <p className="text-primary font-medium text-sm">Photo uploaded successfully</p>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-2xl p-8 md:p-12 text-center transition-all duration-300 cursor-pointer border ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.01]' 
              : 'border-border/30 bg-card/40 hover:border-primary/30 hover:bg-card/60'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
            <Upload className="w-7 h-7 md:w-10 md:h-10 text-primary" />
          </div>
          
          <h3 className="font-serif text-lg md:text-xl text-foreground mb-1.5">
            Drop your photo here
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm mb-5">
            or click to browse from your device
          </p>
          
          <Button 
            variant="luxury" 
            size="lg"
            className="rounded-2xl"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Camera className="w-4 h-4 mr-2" />
            Choose Photo
          </Button>
        </div>
      )}

      {/* Tips Card */}
      <div className="rounded-2xl border border-border/20 bg-card/50 backdrop-blur-sm p-5 md:p-6">
        <h4 className="font-serif text-base md:text-lg text-foreground mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Photo Tips for Best Results
        </h4>
        <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            Use good lighting for accurate skin tone detection
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            Face the camera directly for best feature analysis
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            Wear minimal makeup for accurate color matching
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;
