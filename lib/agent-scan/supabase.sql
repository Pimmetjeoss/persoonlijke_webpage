-- ============================================================
-- Agent-Scan (Is Agentic) — Supabase tabel
-- ------------------------------------------------------------
-- Eenmalig uitvoeren in de Supabase SQL editor.
-- Bij de waarschuwing "enable Row Level Security" kies je
-- "Run and enable RLS" (de backend gebruikt de service-role key,
-- die RLS omzeilt; anonieme/public keys kunnen zo niet meelezen).
-- ============================================================

create table public.agent_scan_reports (
  id uuid primary key default gen_random_uuid(),
  uuid uuid not null,
  domain text not null,
  url text not null,
  status text not null default 'pending', -- pending | done | error
  score numeric,
  score_label text,
  raw jsonb,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index agent_scan_reports_domain_idx
  on public.agent_scan_reports (domain);

create index agent_scan_reports_ip_hash_idx
  on public.agent_scan_reports (ip_hash);
