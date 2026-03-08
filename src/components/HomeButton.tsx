import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page or auth page
  if (location.pathname === "/" || location.pathname === "/auth") return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/")}
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg backdrop-blur-md border border-primary/20 hover:scale-110 transition-all"
      aria-label="Go to Home"
    >
      <Home className="w-5 h-5" />
    </Button>
  );
};

export default HomeButton;
