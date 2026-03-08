import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCloset } from "@/hooks/useCloset";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, ArrowLeft, Crown, User, Mail, Calendar, Heart,
  ShoppingBag, Shield, Settings, LogOut, ChevronRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { savedItems, savedOutfits } = useCloset();
  const [isPremium, setIsPremium] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

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

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Style Enthusiast";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    { label: "Saved Items", value: savedItems.length, icon: Heart },
    { label: "Saved Outfits", value: savedOutfits.length, icon: ShoppingBag },
  ];

  const menuItems = [
    { label: "My Closet", icon: Heart, onClick: () => navigate("/closet") },
    { label: "Explore Styles", icon: Sparkles, onClick: () => navigate("/explore") },
    { label: "Get Outfit", icon: Star, onClick: () => navigate("/get-outfit") },
    { label: "Style Quiz", icon: Settings, onClick: () => navigate("/style-quiz") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="font-serif text-lg text-foreground">Profile</span>
        <div className="w-10" />
      </nav>

      <div className="relative z-10 container mx-auto px-4 pb-24 max-w-lg">
        {/* Avatar + Name Card */}
        <div className="luxury-card p-8 text-center mb-6 relative overflow-hidden">
          {/* Decorative glow behind avatar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative inline-block mb-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary/30 shadow-gold"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center shadow-gold">
                <span className="text-2xl font-serif text-gradient-gold">{initials}</span>
              </div>
            )}
            {/* Premium / Free badge on avatar */}
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background ${
              isPremium
                ? "bg-gradient-to-br from-primary to-gold-dark shadow-gold"
                : "bg-muted border-border"
            }`}>
              {isPremium ? (
                <Crown className="w-4 h-4 text-primary-foreground" />
              ) : (
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
          </div>

          <h2 className="font-serif text-2xl text-foreground mb-1">{displayName}</h2>

          {/* Tier Badge */}
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mt-3 ${
            isPremium
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-muted text-muted-foreground border border-border"
          }`}>
            {isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5" />
                PREMIUM MEMBER
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                FREE PLAN
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="luxury-card p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-serif text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Account Info */}
        <div className="luxury-card p-6 mb-6">
          <h3 className="font-serif text-sm text-muted-foreground uppercase tracking-wider mb-4">Account</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm text-foreground">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="luxury-card overflow-hidden mb-6">
          <h3 className="font-serif text-sm text-muted-foreground uppercase tracking-wider px-6 pt-5 pb-3">Quick Links</h3>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-primary/5 transition-colors ${
                  i < menuItems.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Upgrade CTA (for free users) */}
        {!isPremium && (
          <div className="luxury-card p-6 mb-6 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold flex-shrink-0">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-foreground mb-1">Upgrade to Premium</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlock unlimited outfits, advanced style reports, and exclusive collections.
                </p>
                <Button variant="luxury" size="sm" className="text-xs">
                  <Crown className="w-3.5 h-3.5 mr-1.5" />
                  Go Premium
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
