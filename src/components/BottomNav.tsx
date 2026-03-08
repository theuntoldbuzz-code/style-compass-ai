import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, ShoppingBag, FileText, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Explore", icon: Compass, path: "/explore" },
  { label: "Closet", icon: ShoppingBag, path: "/closet" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Profile", icon: UserRound, path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenPaths = ["/auth", "/get-outfit", "/recommendations"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Top edge glow */}
      <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <div
        className="relative border-t border-primary/10 px-1"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 6% / 0.97) 0%, hsl(0 0% 4% / 0.99) 100%)",
          backdropFilter: "blur(20px) saturate(1.8)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Subtle gold shimmer line at top */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center justify-around h-[62px] max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center gap-[3px] flex-1 h-full"
              >
                {/* Active background glow */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-x-2 top-1 bottom-1 rounded-2xl"
                      style={{
                        background: "radial-gradient(ellipse at center top, hsl(45 66% 52% / 0.08) 0%, transparent 70%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Gold indicator line — inline, directly above icon */}
                <div className="h-[2px] w-6 rounded-full" style={{
                  background: isActive
                    ? "linear-gradient(90deg, hsl(45 66% 52%), hsl(35 41% 61%))"
                    : "transparent",
                  boxShadow: isActive ? "0 0 8px hsl(45 66% 52% / 0.5)" : "none",
                }} />

                <div className="relative z-10">
                  <Icon
                    className={`w-[21px] h-[21px] transition-all duration-300 ${
                      isActive ? "text-primary drop-shadow-[0_0_6px_hsl(45_66%_52%/0.4)]" : "text-muted-foreground/60"
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </div>

                <span
                  className={`relative z-10 text-[9px] uppercase tracking-[0.12em] transition-all duration-300 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-muted-foreground/50 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
