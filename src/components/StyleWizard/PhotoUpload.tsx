import { useState, useRef } from "react";
import { Upload, Camera, User, X } from "lucide-react";
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          Let's Start with <span className="text-gradient-gold">You</span>
        </h2>
        <p className="text-muted-foreground">
          Upload a photo for AI-powered style analysis, or skip to enter details manually
        </p>
      </div>

      {preview ? (
        <div className="relative max-w-sm mx-auto">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-gold">
            <img 
              src={preview} 
              alt="Your photo" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={clearPhoto}
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mt-4 text-center">
            <p className="text-primary font-medium">Photo uploaded successfully!</p>
            <p className="text-sm text-muted-foreground">Our AI will analyze your features</p>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border/50 hover:border-primary/50 hover:bg-secondary/30'
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
          
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          
          <h3 className="font-serif text-xl text-foreground mb-2">
            Drop your photo here
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            or click to browse from your device
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              variant="luxury" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Choose Photo
            </Button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="luxury-card p-6 mt-8">
        <h4 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Photo Tips for Best Results
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Use good lighting for accurate skin tone detection
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Face the camera directly for best feature analysis
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            Wear minimal makeup for accurate color matching
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;
