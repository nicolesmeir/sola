-- SOLA initial schema. Run in Supabase SQL editor (or `supabase db push`).
-- Every table is per-user and protected by Row Level Security: a user can only
-- ever read or write rows where user_id = auth.uid().

-- ───────────────────────── profiles ─────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  -- required onboarding (PRD §4.2): style → inspiration → wardrobe → review → done
  onboarding_step text not null default 'style'
    check (onboarding_step in ('style', 'inspiration', 'wardrobe', 'review', 'done')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically for every new auth user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  insert into public.style_profiles (user_id) values (new.id);
  return new;
end;
$$;

-- ───────────────────────── clothing_items ─────────────────────────
create table public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null,             -- storage path in bucket "wardrobe": {user_id}/{uuid}.jpg
  name text not null default '',
  category text not null
    check (category in ('top', 'bottom', 'dress', 'outerwear', 'shoes', 'bag', 'accessory')),
  colors text[] not null default '{}',
  style_tags text[] not null default '{}',
  season text,                           -- e.g. 'all', 'warm', 'cold'
  formality text,                        -- 'casual' | 'smart-casual' | 'formal'
  ai_confidence real,
  user_corrected boolean not null default false,
  created_at timestamptz not null default now()
);
create index clothing_items_user_idx on public.clothing_items (user_id, created_at);

-- ───────────────────────── style_profiles ─────────────────────────
create table public.style_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  questionnaire jsonb not null default '{}'::jsonb,
  inspiration_paths text[] not null default '{}',   -- storage paths in bucket "inspiration"
  ai_summary jsonb,                                  -- {aesthetic, palette[], key_formulas[], summary}
  updated_at timestamptz not null default now()
);

-- trigger defined after style_profiles exists
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────── chat + outfits ─────────────────────────
create table public.outfit_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  request_text text not null,
  status text not null default 'pending' check (status in ('pending', 'success', 'insufficient', 'error')),
  created_at timestamptz not null default now()
);
create index outfit_requests_user_idx on public.outfit_requests (user_id, created_at);

create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  request_id uuid not null references public.outfit_requests (id) on delete cascade,
  item_ids uuid[] not null,
  title text not null,
  occasion text,
  explanation text not null default '',
  collage_url text,                      -- unused in v1 (collages rendered client-side)
  selected boolean not null default false,
  selected_at timestamptz,
  created_at timestamptz not null default now()
);
create index outfits_request_idx on public.outfits (request_id);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  request_id uuid references public.outfit_requests (id) on delete set null,
  created_at timestamptz not null default now()
);
create index chat_messages_user_idx on public.chat_messages (user_id, created_at);

-- ───────────────────────── events (pilot metrics) ─────────────────────────
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,      -- item_uploaded | outfit_request_success | outfit_request_failure | outfit_selected | onboarding_completed
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index events_name_idx on public.events (name, created_at);

-- ───────────────────────── Row Level Security ─────────────────────────
alter table public.profiles enable row level security;
alter table public.clothing_items enable row level security;
alter table public.style_profiles enable row level security;
alter table public.outfit_requests enable row level security;
alter table public.outfits enable row level security;
alter table public.chat_messages enable row level security;
alter table public.events enable row level security;

create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "own items" on public.clothing_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own style profile" on public.style_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own requests" on public.outfit_requests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own outfits" on public.outfits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own messages" on public.chat_messages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- events: users may insert their own events but not read/alter them
create policy "insert own events" on public.events
  for insert with check (user_id = auth.uid());

-- ───────────────────────── Storage (private buckets) ─────────────────────────
insert into storage.buckets (id, name, public)
values ('wardrobe', 'wardrobe', false), ('inspiration', 'inspiration', false)
on conflict (id) do nothing;

-- Objects must live under a folder named after the owner's user id: {user_id}/file.jpg
create policy "own wardrobe files" on storage.objects
  for all to authenticated
  using (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'wardrobe' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "own inspiration files" on storage.objects
  for all to authenticated
  using (bucket_id = 'inspiration' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'inspiration' and (storage.foldername(name))[1] = auth.uid()::text);
