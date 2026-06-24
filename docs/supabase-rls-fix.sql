-- Enable Row Level Security for scan storage tables.
--
-- This app reads and writes these tables from Next.js server routes with
-- SUPABASE_SERVICE_ROLE_KEY. Service-role access bypasses RLS, so the app keeps
-- working while anonymous/public API access is blocked by default.

alter table public.chatgpt_check_scans enable row level security;
alter table public.agent_ready_scans enable row level security;
alter table public.google_score_comparisons enable row level security;

-- Intentionally no anon/authenticated policies.
-- Add explicit select/insert policies later only if browser-side Supabase
-- access is introduced for these tables.
