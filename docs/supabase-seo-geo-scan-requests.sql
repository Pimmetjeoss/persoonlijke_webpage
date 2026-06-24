create table if not exists public.seo_geo_scan_requests (
  id uuid primary key default gen_random_uuid(),
  uuid uuid not null unique,
  name text not null,
  email text not null,
  phone text,
  website text not null,
  current_score numeric,
  notes text,
  source text not null default 'google-score-level-up',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seo_geo_scan_requests_status_check
    check (status in ('new', 'contacted', 'done'))
);

alter table public.seo_geo_scan_requests enable row level security;

-- No anon/authenticated policies: requests are inserted server-side with
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
