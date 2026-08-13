create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.card_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  card_number text,
  set_name text,
  language text not null default 'pt-BR',
  card_type text,
  rarity text,
  image_url text,
  variant text not null default 'normal',
  created_at timestamptz not null default now(),
  unique (name, card_number, set_name, language, variant)
);

create table public.collection_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.card_catalog(id),
  quantity integer not null default 1 check (quantity > 0),
  language text not null default 'pt-BR',
  condition text,
  paid_amount_cents integer check (paid_amount_cents is null or paid_amount_cents >= 0),
  notes text,
  is_wanted boolean not null default false,
  is_for_trade boolean not null default false,
  is_for_sale boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index collection_entries_owner_idx on public.collection_entries(owner_id);

create table public.binders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text,
  cover_url text,
  is_public boolean not null default false,
  page_count integer not null default 1 check (page_count > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.binder_members (
  binder_id uuid not null references public.binders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (binder_id, user_id)
);

create table public.binder_pages (
  id uuid primary key default gen_random_uuid(),
  binder_id uuid not null references public.binders(id) on delete cascade,
  page_number integer not null check (page_number > 0),
  unique (binder_id, page_number)
);

create table public.binder_slots (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.binder_pages(id) on delete cascade,
  slot_number integer not null check (slot_number between 1 and 9),
  unique (page_id, slot_number)
);

create table public.binder_placements (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.binder_slots(id) on delete cascade,
  collection_entry_id uuid not null references public.collection_entries(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (slot_id)
);
create index binder_members_user_idx on public.binder_members(user_id);

create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table public.pulls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete set null,
  purchased_at date not null default current_date,
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  tracking_code text,
  notes text,
  status text not null default 'purchased' check (status in ('purchased','awaiting_shipping','shipped','delivered','cancelled')),
  collection_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pull_items (
  id uuid primary key default gen_random_uuid(),
  pull_id uuid not null references public.pulls(id) on delete cascade,
  card_id uuid not null references public.card_catalog(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  unique (pull_id, card_id)
);

create table public.friendships (
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8))),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Usuário')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.card_catalog enable row level security;
alter table public.collection_entries enable row level security;
alter table public.binders enable row level security;
alter table public.binder_members enable row level security;
alter table public.binder_pages enable row level security;
alter table public.binder_slots enable row level security;
alter table public.binder_placements enable row level security;
alter table public.sellers enable row level security;
alter table public.pulls enable row level security;
alter table public.pull_items enable row level security;
alter table public.friendships enable row level security;
alter table public.notifications enable row level security;

create policy "profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "users manage own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "catalog is readable" on public.card_catalog for select to anon, authenticated using (true);
create policy "authenticated users add catalog cards" on public.card_catalog for insert to authenticated with check (true);
create policy "owners manage collection" on public.collection_entries for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage binders" on public.binders for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "public or member binders are readable" on public.binders for select to anon, authenticated using (is_public or owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = id and m.user_id = auth.uid()));
create policy "members read membership" on public.binder_members for select to authenticated using (user_id = auth.uid() or exists (select 1 from public.binders b where b.id = binder_id and b.owner_id = auth.uid()));
create policy "owners manage membership" on public.binder_members for all to authenticated using (exists (select 1 from public.binders b where b.id = binder_id and b.owner_id = auth.uid())) with check (exists (select 1 from public.binders b where b.id = binder_id and b.owner_id = auth.uid()));
create policy "visible binder pages" on public.binder_pages for select to anon, authenticated using (exists (select 1 from public.binders b where b.id = binder_id and (b.is_public or b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()))));
create policy "owners manage binder pages" on public.binder_pages for all to authenticated using (exists (select 1 from public.binders b where b.id = binder_id and b.owner_id = auth.uid())) with check (exists (select 1 from public.binders b where b.id = binder_id and b.owner_id = auth.uid()));
create policy "visible binder slots" on public.binder_slots for select to anon, authenticated using (exists (select 1 from public.binder_pages p join public.binders b on b.id = p.binder_id where p.id = page_id and (b.is_public or b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()))));
create policy "owners manage binder slots" on public.binder_slots for all to authenticated using (exists (select 1 from public.binder_pages p join public.binders b on b.id = p.binder_id where p.id = page_id and b.owner_id = auth.uid())) with check (exists (select 1 from public.binder_pages p join public.binders b on b.id = p.binder_id where p.id = page_id and b.owner_id = auth.uid()));
create policy "visible binder placements" on public.binder_placements for select to anon, authenticated using (exists (select 1 from public.binder_slots s join public.binder_pages p on p.id = s.page_id join public.binders b on b.id = p.binder_id where s.id = slot_id and (b.is_public or b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()))));
create policy "members manage their binder placements" on public.binder_placements for all to authenticated using (exists (select 1 from public.binder_slots s join public.binder_pages p on p.id = s.page_id join public.binders b on b.id = p.binder_id where s.id = slot_id and (b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()))) and exists (select 1 from public.collection_entries c where c.id = collection_entry_id and c.owner_id = auth.uid())) with check (exists (select 1 from public.binder_slots s join public.binder_pages p on p.id = s.page_id join public.binders b on b.id = p.binder_id where s.id = slot_id and (b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()))) and exists (select 1 from public.collection_entries c where c.id = collection_entry_id and c.owner_id = auth.uid()));
create policy "owners manage sellers" on public.sellers for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage pulls" on public.pulls for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "owners manage pull items" on public.pull_items for all to authenticated using (exists (select 1 from public.pulls p where p.id = pull_id and p.owner_id = auth.uid())) with check (exists (select 1 from public.pulls p where p.id = pull_id and p.owner_id = auth.uid()));
create policy "participants manage friendships" on public.friendships for all to authenticated using (requester_id = auth.uid() or addressee_id = auth.uid()) with check (requester_id = auth.uid() or addressee_id = auth.uid());
create policy "users manage own notifications" on public.notifications for all to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
