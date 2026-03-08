import desktopBgHome from "@/assets/desktop-bg-home.jpg";
import desktopBgProfile from "@/assets/desktop-bg-profile.jpg";
import desktopBgExplore from "@/assets/desktop-bg-explore.jpg";
import desktopBgCloset from "@/assets/desktop-bg-closet.jpg";
import desktopBgReports from "@/assets/desktop-bg-reports.jpg";
import desktopBgWizard from "@/assets/desktop-bg-wizard.jpg";
import desktopBgRecommendations from "@/assets/desktop-bg-recommendations.jpg";

const bgMap = {
  home: desktopBgHome,
  profile: desktopBgProfile,
  explore: desktopBgExplore,
  closet: desktopBgCloset,
  reports: desktopBgReports,
  wizard: desktopBgWizard,
  recommendations: desktopBgRecommendations,
} as const;

export type DesktopBgVariant = keyof typeof bgMap;

interface DesktopBackgroundProps {
  variant?: DesktopBgVariant;
}

const DesktopBackground = ({ variant = "home" }: DesktopBackgroundProps) => (
  <div className="hidden md:block fixed inset-0 pointer-events-none z-0">
    {/* Page-specific background image - more visible */}
    <img
      src={bgMap[variant]}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    />
    
    {/* Light overlay for text readability - much lighter */}
    <div className="absolute inset-0 bg-background/30" />
    
    {/* Soft top edge vignette */}
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/50 to-transparent" />
    
    {/* Soft bottom fade */}
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/50 to-transparent" />
    
    {/* Subtle side vignettes */}
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/30 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/30 to-transparent" />
  </div>
);

export default DesktopBackground;
