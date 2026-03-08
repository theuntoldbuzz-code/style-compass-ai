import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PremiumState {
  isPremium: boolean;
  generationCount: number;
  loading: boolean;
  canGenerate: boolean;
  recordGeneration: () => Promise<void>;
}

const FREE_GENERATION_LIMIT = 2;

export const usePremium = (): PremiumState => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const [premiumRes, genRes] = await Promise.all([
        supabase
          .from('premium_users')
          .select('is_active')
          .eq('email', user.email!)
          .single(),
        supabase
          .from('outfit_generations' as any)
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      if (premiumRes.data?.is_active) setIsPremium(true);
      setGenerationCount((genRes as any).count ?? 0);
      setLoading(false);
    };

    fetchStatus();
  }, [user]);

  const canGenerate = isPremium || generationCount < FREE_GENERATION_LIMIT;

  const recordGeneration = async () => {
    if (!user) return;
    await (supabase.from('outfit_generations' as any) as any).insert({ user_id: user.id });
    setGenerationCount((prev) => prev + 1);
  };

  return { isPremium, generationCount, loading, canGenerate, recordGeneration };
};
