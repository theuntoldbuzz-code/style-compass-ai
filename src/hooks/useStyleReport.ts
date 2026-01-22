import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StyleReport, PhotoAnalysisResult } from "@/types/styleReport";
import { UserProfile } from "@/types/outfit";
import { toast } from "@/hooks/use-toast";

export const useStyleReport = () => {
  const [report, setReport] = useState<StyleReport | null>(null);
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePhoto = async (imageBase64: string): Promise<PhotoAnalysisResult | null> => {
    setIsAnalyzingPhoto(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('photos-analysis', {
        body: {
          image_base64: imageBase64,
        },
      });

      if (fnError) {
        const status = (fnError as any)?.context?.status ?? (fnError as any)?.status;
        if (status === 429) {
          throw new Error("AI is busy right now. Please wait a few seconds and try again.");
        }
        if (status === 402) {
          throw new Error("AI credits are exhausted. Please try again later.");
        }
        throw new Error(fnError.message);
      }

      if (data.error && !data.isHuman) {
        toast({
          title: "Photo Analysis",
          description: data.error,
          variant: "destructive",
        });
        return data as PhotoAnalysisResult;
      }

      setPhotoAnalysis(data);
      return data as PhotoAnalysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze photo";
      setError(errorMessage);
      toast({
        title: "Error analyzing photo",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const generateReport = async (
    profile: UserProfile, 
    photoAnalysisData?: PhotoAnalysisResult | null
  ): Promise<StyleReport | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const requestBody: Record<string, unknown> = {
        gender: profile.gender,
        skinTone: profile.skinTone,
        hairColor: profile.hairColor,
        bodyType: profile.bodyType,
        occasion: profile.occasion,
        season: profile.season,
      };

      // Include photo analysis if available
      if (photoAnalysisData?.analysis) {
        requestBody.photoAnalysis = {
          skin_undertone: photoAnalysisData.analysis.skin_undertone,
          face_shape: photoAnalysisData.analysis.face_shape,
          style_personality: photoAnalysisData.analysis.style_personality,
          measurements: photoAnalysisData.analysis.measurements,
          recommended_colors: photoAnalysisData.analysis.recommended_colors,
          avoid_colors: photoAnalysisData.analysis.avoid_colors,
          style_notes: photoAnalysisData.analysis.style_notes,
        };
      }

      const { data, error: fnError } = await supabase.functions.invoke('generate-style-report', {
        body: requestBody,
      });

      if (fnError) {
        const status = (fnError as any)?.context?.status ?? (fnError as any)?.status;
        if (status === 429) {
          throw new Error("AI is busy right now. Please wait a few seconds and try again.");
        }
        if (status === 402) {
          throw new Error("AI credits are exhausted. Please try again later.");
        }
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
    photoAnalysis,
    isLoading,
    isAnalyzingPhoto,
    error,
    analyzePhoto,
    generateReport,
  };
};
