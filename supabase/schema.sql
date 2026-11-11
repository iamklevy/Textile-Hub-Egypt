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
  email text,
  photos text[] not null default '{}'
);

-- Added after the first version; safe to run again on an existing database.
alter table public.machines add column if not exists photos text[] not null default '{}';

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
--   * signed-in users listed in public.admins can see and moderate everything
--     (the /admin page); see the "admins" section at the end of this file

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

-- ------------------------------------------------------------------- admins
-- Accounts allowed to use the /admin page. Create the user in Supabase under
-- Authentication > Users, then add them here (see README):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- No policies on purpose: the table is not readable or writable through the API.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read companies" on public.companies;
create policy "admins read companies" on public.companies
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins update companies" on public.companies;
create policy "admins update companies" on public.companies
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins read jobs" on public.jobs;
create policy "admins read jobs" on public.jobs
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins update jobs" on public.jobs;
create policy "admins update jobs" on public.jobs
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins read machines" on public.machines;
create policy "admins read machines" on public.machines
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins update machines" on public.machines;
create policy "admins update machines" on public.machines
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins read inquiries" on public.inquiries;
create policy "admins read inquiries" on public.inquiries
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins update inquiries" on public.inquiries;
create policy "admins update inquiries" on public.inquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant update on public.companies, public.jobs, public.machines to authenticated;
grant select, update on public.inquiries to authenticated;

-- ----------------------------------------------------------- machine photos
-- Public bucket: approved listings show their photos to everyone. Uploads are
-- limited to images under 2 MB; the website resizes them before sending.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('machine-photos', 'machine-photos', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "upload machine photos" on storage.objects;
create policy "upload machine photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'machine-photos');
drop policy if exists "admins delete machine photos" on storage.objects;
create policy "admins delete machine photos" on storage.objects
  for delete to authenticated using (bucket_id = 'machine-photos' and (select public.is_admin()));
