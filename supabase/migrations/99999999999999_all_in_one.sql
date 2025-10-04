-- Consolidated, idempotent migration to converge schema
set search_path = public;

-- Utility: updated_at trigger function
do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'update_updated_at_column' and n.nspname = 'public'
  ) then
    create or replace function public.update_updated_at_column()
    returns trigger as $f$
    begin
      new.updated_at = now();
      return new;
    end;
    $f$ language plpgsql;
  end if;
end $$;

-- Enums for programs
do $$
begin
  if not exists (select 1 from pg_type where typname = 'program_status') then
    create type program_status as enum ('active', 'scheduled', 'draft', 'normal');
  end if;
  if not exists (select 1 from pg_type where typname = 'program_category') then
    create type program_category as enum ('fitness', 'nutrition', 'mental health');
  end if;
end $$;

-- programs table
create table if not exists public.programs (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  status program_status not null default 'draft',
  category program_category not null,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  scheduled_date timestamptz,
  plan jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.programs enable row level security;

drop policy if exists "Coaches can view their own programs" on public.programs;
create policy "Coaches can view their own programs"
on public.programs
for select
using (auth.uid() = coach_id);

drop policy if exists "Coaches can create their own programs" on public.programs;
create policy "Coaches can create their own programs"
on public.programs
for insert
with check (auth.uid() = coach_id);

drop policy if exists "Coaches can update their own programs" on public.programs;
create policy "Coaches can update their own programs"
on public.programs
for update
using (auth.uid() = coach_id);

drop policy if exists "Coaches can delete their own programs" on public.programs;
create policy "Coaches can delete their own programs"
on public.programs
for delete
using (auth.uid() = coach_id);

-- Customers can view assigned programs
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Customers can view assigned programs' and tablename = 'programs'
  ) then
    create policy "Customers can view assigned programs"
    on public.programs
    for select
    using (auth.uid() = assigned_to);
  end if;
end $$;

create index if not exists idx_programs_coach_id on public.programs(coach_id);
create index if not exists idx_programs_status on public.programs(status);
create index if not exists idx_programs_category on public.programs(category);
create index if not exists idx_programs_assigned_to on public.programs(assigned_to);

drop trigger if exists update_programs_updated_at on public.programs;
create trigger update_programs_updated_at
before update on public.programs
for each row
execute function public.update_updated_at_column();

-- AI flag and profile trial tracking
alter table if exists public.programs
  add column if not exists is_ai_generated boolean not null default false;

alter table if exists public.profiles
  add column if not exists has_used_trial boolean not null default false;

create or replace function public.mark_trial_used()
returns trigger as $$
begin
  if new.plan = 'trial' then
    new.has_used_trial := true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_mark_trial_used on public.profiles;
create trigger trg_mark_trial_used
before insert or update on public.profiles
for each row
execute function public.mark_trial_used();

-- daily_checkins and payouts
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default (now() at time zone 'utc')::date,
  water_liters numeric(4,2),
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  sleep_hours numeric(4,2),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.daily_checkins enable row level security;

drop policy if exists "Daily checkins are viewable by owner" on public.daily_checkins;
create policy "Daily checkins are viewable by owner" on public.daily_checkins
  for select using (auth.uid() = user_id);

drop policy if exists "Daily checkins are insertable by owner" on public.daily_checkins;
create policy "Daily checkins are insertable by owner" on public.daily_checkins
  for insert with check (auth.uid() = user_id);

drop policy if exists "Daily checkins are updatable by owner" on public.daily_checkins;
create policy "Daily checkins are updatable by owner" on public.daily_checkins
  for update using (auth.uid() = user_id);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null,
  platform_fee_cents integer not null,
  net_amount_cents integer not null,
  status text not null check (status in ('pending','paid','failed')),
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

drop policy if exists "Payouts are viewable by coach" on public.payouts;
create policy "Payouts are viewable by coach" on public.payouts
  for select using (auth.uid() = coach_id);

-- coach_checkins and customer_states
create table if not exists public.coach_checkins (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  message text,
  due_date date,
  status text not null default 'open' check (status in ('open','completed','dismissed')),
  created_at timestamptz not null default now()
);
alter table public.coach_checkins enable row level security;

drop policy if exists "Coach checkins readable by coach or customer" on public.coach_checkins;
create policy "Coach checkins readable by coach or customer" on public.coach_checkins
for select using (auth.uid() = coach_id or auth.uid() = customer_id);

drop policy if exists "Coach checkins insertable by coach" on public.coach_checkins;
create policy "Coach checkins insertable by coach" on public.coach_checkins
for insert with check (auth.uid() = coach_id);

drop policy if exists "Coach checkins updatable by coach or customer" on public.coach_checkins;
create policy "Coach checkins updatable by coach or customer" on public.coach_checkins
for update using (auth.uid() = coach_id or auth.uid() = customer_id);

drop materialized view if exists public.customer_states;
create materialized view public.customer_states as
select p.id as customer_id,
  case when pr.last_program is null then true else false end as missing_program,
  case when coalesce(cc.any_open, false) then true else false end as needs_feedback,
  case when p.plan_expiry is not null and p.plan_expiry::date <= (now() at time zone 'utc')::date + interval '7 days' then true else false end as soon_to_expire,
  case when dc.date is null or dc.date < (now() at time zone 'utc')::date - interval '3 days' then true else false end as off_track,
  case when p.plan_expiry is not null and p.plan_expiry::date < (now() at time zone 'utc')::date then true else false end as program_expired
from profiles p
left join (
  select assigned_to as customer_id, max(updated_at) as last_program
  from programs where assigned_to is not null
  group by assigned_to
) pr on pr.customer_id = p.id
left join (
  select user_id, max(date) as date from daily_checkins group by user_id
) dc on dc.user_id = p.id
left join (
  select customer_id, max(created_at) as last_checkin,
         bool_or(status = 'open') as any_open
  from coach_checkins
  group by customer_id
) cc on cc.customer_id = p.id
where p.role = 'customer';

create index if not exists idx_customer_states_customer_id on public.customer_states(customer_id);

-- program_entries
create table if not exists public.program_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  date date not null default (now() at time zone 'utc')::date,
  type text not null check (type in ('fitness','nutrition','mental')),
  notes text,
  data jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, program_id, date)
);

alter table public.program_entries enable row level security;

drop policy if exists "Entries readable by owner" on public.program_entries;
create policy "Entries readable by owner" on public.program_entries
  for select using (auth.uid() = user_id);

drop policy if exists "Entries writeable by owner" on public.program_entries;
create policy "Entries writeable by owner" on public.program_entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "Entries updatable by owner" on public.program_entries;
create policy "Entries updatable by owner" on public.program_entries
  for update using (auth.uid() = user_id);

-- Coach blog + price range
alter table if exists public.profiles
  add column if not exists price_min_cents integer,
  add column if not exists price_max_cents integer;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  introduction text,
  content text,
  category text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;

drop policy if exists "Blog readable by anyone" on public.blog_posts;
create policy "Blog readable by anyone" on public.blog_posts
  for select using (true);

drop policy if exists "Blog insertable by coach" on public.blog_posts;
create policy "Blog insertable by coach" on public.blog_posts
  for insert with check (auth.uid() = coach_id);

drop policy if exists "Blog updatable by owner" on public.blog_posts;
create policy "Blog updatable by owner" on public.blog_posts
  for update using (auth.uid() = coach_id);

drop policy if exists "Blog deletable by owner" on public.blog_posts;
create policy "Blog deletable by owner" on public.blog_posts
  for delete using (auth.uid() = coach_id);

drop trigger if exists set_blog_updated_at on public.blog_posts;
create trigger set_blog_updated_at
before update on public.blog_posts
for each row execute procedure public.update_updated_at_column();

-- Security utilities & RLS tightening
create or replace function public.is_coach_customer_relationship(coach_user_id uuid, customer_user_id uuid)
returns boolean
language sql
stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles 
    where id = customer_user_id 
    and coach_id = coach_user_id
  );
$$;

-- onboarding_details visibility
drop policy if exists "Coaches can view all onboarding details" on public.onboarding_details;
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Coaches can view their assigned customers onboarding details' and tablename = 'onboarding_details'
  ) then
    create policy "Coaches can view their assigned customers onboarding details"
    on public.onboarding_details
    for select
    using (
      auth.uid() = user_id or 
      public.is_coach_customer_relationship(auth.uid(), user_id)
    );
  end if;
end $$;

-- Public coach profile helper and policies
create or replace function public.can_view_coach_public_profile(viewer_id uuid, coach_id uuid)
returns boolean
language sql
stable security definer
set search_path = public
as $$
  select exists (
    select 1 
    from public.profiles 
    where id = coach_id 
    and role = 'coach'
  );
$$;

drop policy if exists "Public can view coach profiles" on public.profiles;
drop policy if exists "Public can view coach public profiles only" on public.profiles;
create policy "Public can view coach public profiles only" 
on public.profiles 
for select 
using (
  role = 'coach' and (
    auth.uid() = id or 
    public.can_view_coach_public_profile(auth.uid(), id)
  )
);

-- app_role type and user_roles table
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'coach', 'customer');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  assigned_at timestamptz default now(),
  assigned_by uuid references auth.users(id),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.get_primary_user_role(_user_id uuid)
returns text
language sql
stable security definer
set search_path = public
as $$
  select coalesce(
    (select role::text from public.user_roles where user_id = _user_id limit 1),
    (select role from public.profiles where id = _user_id)
  );
$$;

drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
on public.user_roles
for select
using (auth.uid() = user_id);

drop policy if exists "Admins can manage all roles" on public.user_roles;
create policy "Admins can manage all roles"
on public.user_roles
for all
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.assign_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role, assigned_by)
  values (new.id, new.role::app_role, new.id)
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
  after insert or update of role on public.profiles
  for each row
  execute function public.assign_user_role();

-- Public profiles RPC
create or replace function public.get_public_profiles(ids uuid[])
returns table (
  id uuid,
  full_name text,
  avatar_url text,
  email text
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.full_name, p.avatar_url, p.email
  from public.profiles p
  where p.id = any(ids);
$$;

revoke all on function public.get_public_profiles(uuid[]) from public;
grant execute on function public.get_public_profiles(uuid[]) to authenticated, anon;

-- Weight tracking table for progress monitoring
create table if not exists public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  date date not null default (now() at time zone 'utc')::date,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Photo progress table for progression photos
create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  date date not null default (now() at time zone 'utc')::date,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.weight_entries enable row level security;
alter table public.progress_photos enable row level security;

-- Weight entries policies
create policy "Weight entries are viewable by owner" on public.weight_entries
  for select using (auth.uid() = user_id);

create policy "Weight entries are insertable by owner" on public.weight_entries
  for insert with check (auth.uid() = user_id);

create policy "Weight entries are updatable by owner" on public.weight_entries
  for update using (auth.uid() = user_id);

create policy "Weight entries are deletable by owner" on public.weight_entries
  for delete using (auth.uid() = user_id);

-- Progress photos policies
create policy "Progress photos are viewable by owner" on public.progress_photos
  for select using (auth.uid() = user_id);

create policy "Progress photos are insertable by owner" on public.progress_photos
  for insert with check (auth.uid() = user_id);

create policy "Progress photos are updatable by owner" on public.progress_photos
  for update using (auth.uid() = user_id);

create policy "Progress photos are deletable by owner" on public.progress_photos
  for delete using (auth.uid() = user_id);

-- Indexes for better performance
create index if not exists idx_weight_entries_user_id_date on public.weight_entries(user_id, date desc);
create index if not exists idx_progress_photos_user_id_date on public.progress_photos(user_id, date desc);

-- End of consolidated migration


