import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import StyleWizard from "./pages/StyleWizard";
import StyleQuiz from "./pages/StyleQuiz";
import Recommendations from "./pages/Recommendations";
import Auth from "./pages/Auth";
import Closet from "./pages/Closet";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import StyleAIChatbot from "./components/StyleAIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/style-wizard" element={<StyleWizard />} />
            <Route path="/style-quiz" element={<StyleQuiz />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/closet" element={<Closet />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <StyleAIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;