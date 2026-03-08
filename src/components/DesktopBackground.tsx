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
    {/* Page-specific background image */}
    <img
      src={bgMap[variant]}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
    />
    
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-background/70" />
    
    {/* Top edge vignette */}
    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
    
    {/* Bottom fade */}
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
    
    {/* Side vignettes */}
    <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background/60 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background/60 to-transparent" />
    
    {/* Subtle noise texture */}
    <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
  </div>
);

export default DesktopBackground;
