import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on profile page
  if (location.pathname !== "/profile") return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/")}
      className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-primary/15 hover:bg-primary/25 text-primary shadow-md backdrop-blur-md border border-primary/30 hover:scale-110 transition-all"
      aria-label="Go to Home"
    >
      <Home className="w-5 h-5" />
    </Button>
  );
};

export default HomeButton;
