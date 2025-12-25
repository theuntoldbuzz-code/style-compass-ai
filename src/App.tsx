import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/style-wizard" element={<ProtectedRoute><StyleWizard /></ProtectedRoute>} />
            <Route path="/style-quiz" element={<ProtectedRoute><StyleQuiz /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path="/closet" element={<ProtectedRoute><Closet /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <StyleAIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
