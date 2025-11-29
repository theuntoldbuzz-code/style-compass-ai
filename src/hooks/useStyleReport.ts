import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StyleReport } from "@/types/styleReport";
import { UserProfile } from "@/types/outfit";
import { toast } from "@/hooks/use-toast";

export const useStyleReport = () => {
  const [report, setReport] = useState<StyleReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (profile: UserProfile): Promise<StyleReport | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-style-report', {
        body: {
          gender: profile.gender,
          skinTone: profile.skinTone,
          hairColor: profile.hairColor,
          bodyType: profile.bodyType,
          occasion: profile.occasion,
          season: profile.season,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setReport(data.report);
      return data.report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate style report";
      setError(errorMessage);
      toast({
        title: "Error generating report",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    report,
    isLoading,
    error,
    generateReport,
  };
};
