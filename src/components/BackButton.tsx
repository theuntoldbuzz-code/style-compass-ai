import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

const BackButton = ({ to, onClick, label = "Back", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`text-muted-foreground hover:text-foreground gap-2 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
};

export default BackButton;
