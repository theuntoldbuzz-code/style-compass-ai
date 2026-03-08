import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Sparkles, Crown, User, Bell, Shield, LogOut, ChevronRight,
  HelpCircle, Shirt, Eye, FileText
} from "lucide-react";
import goldBokehBg from "@/assets/gold-bokeh-bg.png";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { savedItems, savedOutfits } = useCloset();
  const [isPremium, setIsPremium] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [profileRes, premiumRes] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single(),
        supabase.from("premium_users").select("is_active").eq("email", user.email!).single(),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (premiumRes.data?.is_active) setIsPremium(true);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Style Enthusiast";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const stats = useMemo(() => [
    { label: "CLOSET", value: savedItems.length, icon: Shirt },
    { label: "TRY-ONS", value: savedOutfits.length, icon: Eye },
    { label: "REPORTS", value: 0, icon: FileText },
  ], [savedItems.length, savedOutfits.length]);

  const settingsItems = [
    { label: "Account Information", icon: User, onClick: () => {} },
    { label: "Notifications", icon: Bell, onClick: () => {} },
    { label: "Privacy & Security", icon: Shield, onClick: () => {} },
  ];

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-gold-dark flex items-center justify-center shadow-gold animate-pulse">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gold bokeh fallback gradient + image */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[hsl(45,40%,15%,0.3)] via-background to-background">
        <img
          src={goldBokehBg}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onLoad={() => setBgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${bgLoaded ? 'opacity-60' : 'opacity-0'}`}
        />
      </div>

      <motion.div
        className="relative z-10 px-5 pt-10 pb-32 max-w-md mx-auto"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ── Avatar + Name ── */}
        <motion.div variants={fadeUp} className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-[100px] h-[100px] rounded-full p-[3px] bg-gradient-gold-dark shadow-gold-glow">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <span className="text-3xl font-serif text-gradient-gold">{initials}</span>
                </div>
              )}
            </div>
          </div>

          <h1 className="font-serif text-2xl text-foreground">{displayName}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>

          {/* Member badge */}
          <div className={`mt-3 inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase ${
            isPremium
              ? "bg-primary/15 text-primary border border-primary/40"
              : "bg-muted text-muted-foreground border border-border"
          }`}>
            {isPremium ? <Crown className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
            {isPremium ? "GOLD MEMBER" : "FREE PLAN"}
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div variants={fadeUp} className="rounded-[18px] border border-border/30 bg-card/40 backdrop-blur-md p-5 mb-7">
          <div className="grid grid-cols-3 divide-x divide-border/30">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-serif text-foreground font-semibold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground tracking-widest mt-1 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Your Plan ── */}
        <motion.div variants={fadeUp} className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-primary" />
            <h2 className="font-serif text-xs text-muted-foreground uppercase tracking-[0.2em]">Your Plan</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Gold Plan */}
            <div className="glow-border-card p-5 text-center">
              <div>
                <h3 className="font-serif text-[11px] uppercase tracking-[0.15em] text-foreground mb-2">Aurion Gold</h3>
                <div className="w-8 mx-auto border-t border-primary/40 mb-3" />
                <p className="font-serif text-[26px] text-primary leading-none">₹499</p>
                <p className="text-[10px] text-muted-foreground mt-1 mb-4">/month</p>
                <ul className="space-y-2.5 text-[11px] text-muted-foreground mb-5">
                  <li>Unlimited Outfits</li>
                  <li>Virtual Try-On Access</li>
                  <li>Priority Processing</li>
                </ul>
                <button className={`px-8 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                  isPremium
                    ? "bg-transparent text-primary border-2 border-primary"
                    : "bg-gradient-gold-dark text-primary-foreground shadow-gold"
                }`}>
                  {isPremium ? "ACTIVE" : "UPGRADE"}
                </button>
              </div>
            </div>

            {/* Platinum Plan */}
            <div className="glow-border-card p-5 text-center" style={{ animationDelay: '2s' }}>
              <div>
                <h3 className="font-serif text-[11px] uppercase tracking-[0.15em] text-foreground mb-2">Aurion Platinum</h3>
                <div className="w-8 mx-auto border-t border-primary/40 mb-3" />
                <p className="font-serif text-[26px] text-primary leading-none">₹999</p>
                <p className="text-[10px] text-muted-foreground mt-1 mb-4">/month</p>
                <ul className="space-y-2.5 text-[11px] text-muted-foreground mb-5">
                  <li>Personal Stylist</li>
                  <li>Early Access</li>
                  <li>Concierge Service</li>
                </ul>
                <button className={`px-8 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                  false
                    ? "bg-transparent text-primary border-2 border-primary"
                    : "bg-gradient-gold-dark text-primary-foreground shadow-gold rounded-full"
                }`}>
                  UPGRADE
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Settings ── */}
        <motion.div variants={fadeUp} className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-primary" />
            <h2 className="font-serif text-xs text-muted-foreground uppercase tracking-[0.2em]">Settings</h2>
          </div>

          <div className="rounded-[18px] border border-border/30 bg-card/40 backdrop-blur-md overflow-hidden">
            {settingsItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-primary/5 transition-colors ${
                    i < settingsItems.length - 1 ? "border-b border-border/20" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" style={{ color: 'hsl(45, 66%, 52%)' }} />
                  </div>
                  <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Support ── */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-primary" />
            <h2 className="font-serif text-xs text-muted-foreground uppercase tracking-[0.2em]">Support</h2>
          </div>

          <div className="rounded-[18px] border border-border/30 bg-card/40 backdrop-blur-md overflow-hidden">
            <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-primary/5 transition-colors border-b border-border/20">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground flex-1 text-left">Help Center</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-destructive/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-destructive flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
