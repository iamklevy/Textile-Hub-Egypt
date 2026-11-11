-- Textile Hub Egypt: database schema.
-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- companies
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified boolean not null default false,
  name text not null,
  name_ar text,
  name_zh text,
  category text not null,
  city text not null,
  description text,
  capabilities text,
  employees integer,
  min_order text,
  certifications text,
  export_markets text,
  open_to text[] not null default '{}',
  contact_name text,
  phone text,
  whatsapp text,
  email text,
  website text
);

-- --------------------------------------------------------------------- jobs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  title text not null,
  company_name text not null,
  role text not null,
  city text not null,
  job_type text not null default 'full_time',
  salary_min integer,
  salary_max integer,
  languages text,
  description text,
  phone text,
  email text
);

-- ----------------------------------------------------------------- machines
create table if not exists public.machines (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  title text not null,
  category text not null,
  brand text,
  model text,
  year integer,
  condition text not null,
  price_egp bigint,
  negotiable boolean not null default false,
  city text not null,
  description text,
  seller_name text,
  phone text,
  email text
);

-- ---------------------------------------------------------------- inquiries
-- Messages from visitors: contact a company, apply for a job, ask about a
-- machine, or the Chinese-investor request form (kind = 'investor').
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('company', 'job', 'machine', 'investor')),
  target_id text,
  target_label text,
  name text not null,
  company text,
  phone text,
  email text,
  wechat text,
  interests text[] not null default '{}',
  message text,
  locale text,
  handled boolean not null default false
);

create index if not exists companies_live_idx on public.companies (status, created_at desc);
create index if not exists jobs_live_idx on public.jobs (status, created_at desc);
create index if not exists machines_live_idx on public.machines (status, created_at desc);

-- ------------------------------------------------------- row-level security
-- The website uses the public "anon" key, so these policies are the real
-- security boundary:
--   * anyone can READ listings you have approved
--   * anyone can SUBMIT a listing, but only as 'pending' (and never verified)
--   * anyone can SEND an inquiry, but nobody can read inquiries from the site
-- You review everything in the Supabase Table Editor, which bypasses RLS.

alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.machines enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "read approved companies" on public.companies;
create policy "read approved companies" on public.companies
  for select to anon, authenticated using (status = 'approved');
drop policy if exists "submit pending companies" on public.companies;
create policy "submit pending companies" on public.companies
  for insert to anon, authenticated with check (status = 'pending' and verified = false);

drop policy if exists "read approved jobs" on public.jobs;
create policy "read approved jobs" on public.jobs
  for select to anon, authenticated using (status = 'approved');
drop policy if exists "submit pending jobs" on public.jobs;
create policy "submit pending jobs" on public.jobs
  for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "read approved machines" on public.machines;
create policy "read approved machines" on public.machines
  for select to anon, authenticated using (status = 'approved');
drop policy if exists "submit pending machines" on public.machines;
create policy "submit pending machines" on public.machines
  for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "send inquiries" on public.inquiries;
create policy "send inquiries" on public.inquiries
  for insert to anon, authenticated with check (handled = false);

grant select, insert on public.companies, public.jobs, public.machines to anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
