import goldBokehBg from "@/assets/gold-bokeh-bg.png";

/**
 * Premium ambient background for desktop/tablet views.
 * Renders a subtle gold bokeh texture with layered gradients
 * for a luxury, depth-rich feel across all pages.
 */
const DesktopBackground = () => (
  <div className="hidden md:block fixed inset-0 pointer-events-none z-0">
    {/* Base dark gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
    
    {/* Gold bokeh texture - very subtle */}
    <img
      src={goldBokehBg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
    />
    
    {/* Layered ambient glows */}
    <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[50%] bg-[radial-gradient(ellipse_at_center,hsl(45_66%_52%/0.06),transparent_70%)]" />
    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[45%] bg-[radial-gradient(ellipse_at_center,hsl(45_66%_52%/0.04),transparent_70%)]" />
    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-[radial-gradient(ellipse_at_center,hsl(45_66%_52%/0.02),transparent_70%)]" />
    
    {/* Top edge vignette */}
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
    
    {/* Bottom fade */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    
    {/* Subtle noise texture overlay via CSS */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
  </div>
);

export default DesktopBackground;
