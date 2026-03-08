
CREATE TABLE public.style_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_data jsonb NOT NULL,
  quiz_inputs jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.style_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own style reports" ON public.style_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own style reports" ON public.style_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own style reports" ON public.style_reports
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_style_reports_user_id ON public.style_reports(user_id);
CREATE INDEX idx_style_reports_created_at ON public.style_reports(created_at DESC);
