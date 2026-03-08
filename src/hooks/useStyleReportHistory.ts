import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StyleReport } from "@/types/styleReport";

export interface StyleReportRecord {
  id: string;
  report_data: StyleReport;
  quiz_inputs: Record<string, unknown> | null;
  created_at: string;
}

export const useStyleReportHistory = () => {
  const [reports, setReports] = useState<StyleReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("style_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReports(data.map((r: any) => ({
          id: r.id,
          report_data: r.report_data as unknown as StyleReport,
          quiz_inputs: r.quiz_inputs as Record<string, unknown> | null,
          created_at: r.created_at,
        })));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const saveReport = useCallback(async (report: StyleReport, quizInputs?: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("style_reports").insert({
        user_id: user.id,
        report_data: report as any,
        quiz_inputs: (quizInputs ?? null) as any,
      });

      // Also keep localStorage for quick access
      try { localStorage.setItem("luxfit-last-report", JSON.stringify(report)); } catch { }

      // Refresh list
      fetchReports();
    } catch {
      // fallback to localStorage only
      try { localStorage.setItem("luxfit-last-report", JSON.stringify(report)); } catch { }
    }
  }, [fetchReports]);

  const deleteReport = useCallback(async (id: string) => {
    await supabase.from("style_reports").delete().eq("id", id);
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  return { reports, loading, saveReport, deleteReport, refetch: fetchReports };
};
