alter table public.binders add column share_token text not null default encode(gen_random_bytes(16), 'hex');
create unique index binders_share_token_idx on public.binders(share_token);

create or replace function public.get_shared_binder(p_share_token text)
returns table (id uuid, name text, description text, owner_id uuid, owner_name text, page_count integer)
language sql
security definer
set search_path = public
as $$
  select b.id, b.name, b.description, b.owner_id, p.display_name, b.page_count
  from public.binders b
  join public.profiles p on p.id = b.owner_id
  where b.share_token = p_share_token and b.is_public = true;
$$;
grant execute on function public.get_shared_binder(text) to anon, authenticated;
