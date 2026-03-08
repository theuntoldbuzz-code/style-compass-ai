import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomeButton from "@/components/HomeButton";
import BottomNav from "@/components/BottomNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import goldBokehBg from "@/assets/gold-bokeh-bg.png";

// Preload profile background image
const preloadImg = new Image();
preloadImg.src = goldBokehBg;

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const StyleWizard = lazy(() => import("./pages/StyleWizard"));
const StyleQuiz = lazy(() => import("./pages/StyleQuiz"));
const Reports = lazy(() => import("./pages/Reports"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Auth = lazy(() => import("./pages/Auth"));
const Closet = lazy(() => import("./pages/Closet"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StyleAIChatbot = lazy(() => import("./components/StyleAIChatbot"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,        // 5 min - reduce API calls
      gcTime: 30 * 60 * 1000,           // 30 min garbage collection
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,             // Don't refetch when component remounts
    },
    mutations: {
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse">
      <Sparkles className="w-5 h-5 text-primary-foreground" />
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><PageTransition><Index /></PageTransition></ProtectedRoute>} />
        <Route path="/get-outfit" element={<ProtectedRoute><PageTransition><StyleWizard /></PageTransition></ProtectedRoute>} />
        <Route path="/style-quiz" element={<ProtectedRoute><PageTransition><StyleQuiz /></PageTransition></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><PageTransition><Reports /></PageTransition></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><PageTransition><Recommendations /></PageTransition></ProtectedRoute>} />
        <Route path="/closet" element={<ProtectedRoute><PageTransition><Closet /></PageTransition></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><PageTransition><Explore /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <div className="pb-16 md:pb-0">
                <AnimatedRoutes />
              </div>
              
              <BottomNav />
              <StyleAIChatbot />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
