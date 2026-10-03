-- ===================================================================
-- CVBuilder - resumes table + Row Level Security
--
-- Safe to run on a project that already has a `resumes` table: every
-- statement is idempotent. It creates what is missing, adds any
-- missing columns, and replaces the RLS policies with owner-only ones.
--
-- Run this in Supabase Studio -> SQL Editor -> New query -> Run.
-- ===================================================================

-- 1. TABLE ----------------------------------------------------------

create table if not exists public.resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'My Resume',
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. COLUMNS (for an existing table that predates this migration) ----

alter table public.resumes
  add column if not exists user_id    uuid references auth.users (id) on delete cascade,
  add column if not exists title      text,
  add column if not exists data       jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.resumes alter column title set default 'My Resume';
alter table public.resumes alter column data  set default '{}'::jsonb;

update public.resumes set title = 'My Resume' where title is null;
update public.resumes set data  = '{}'::jsonb  where data  is null;

-- 3. INDEX ----------------------------------------------------------

create index if not exists resumes_user_id_updated_at_idx
  on public.resumes (user_id, updated_at desc);

-- 4. updated_at TRIGGER ---------------------------------------------
-- Keeps updated_at correct even if a client forgets to send it.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists resumes_set_updated_at on public.resumes;

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row
  execute function public.set_updated_at();

-- 5. ROW LEVEL SECURITY ---------------------------------------------
-- RLS stays ON. Each policy is owner-only: a user can never read or
-- change another user's CV.

alter table public.resumes enable row level security;

drop policy if exists "Users can read their own resumes"   on public.resumes;
drop policy if exists "Users can insert their own resumes" on public.resumes;
drop policy if exists "Users can update their own resumes" on public.resumes;
drop policy if exists "Users can delete their own resumes" on public.resumes;

create policy "Users can read their own resumes"
  on public.resumes
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 6. NOT NULL on user_id --------------------------------------------
-- Only applied once no orphan rows remain, so the migration cannot
-- fail on a table that already contains legacy data.

do $$
begin
  if not exists (select 1 from public.resumes where user_id is null) then
    alter table public.resumes alter column user_id set not null;
  end if;
end;
$$;
