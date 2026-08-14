create or replace function public.is_binder_owner(p_binder_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.binders
    where id = p_binder_id and owner_id = p_user_id
  );
$$;

create or replace function public.is_binder_member(p_binder_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.binder_members
    where binder_id = p_binder_id and user_id = p_user_id
  );
$$;

grant execute on function public.is_binder_owner(uuid, uuid) to anon, authenticated;
grant execute on function public.is_binder_member(uuid, uuid) to anon, authenticated;

drop policy if exists "public or member binders are readable" on public.binders;
drop policy if exists "members read membership" on public.binder_members;
drop policy if exists "owners manage membership" on public.binder_members;

create policy "public or member binders are readable" on public.binders
  for select to anon, authenticated
  using (is_public or owner_id = auth.uid() or public.is_binder_member(id, auth.uid()));

create policy "members read membership" on public.binder_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_binder_owner(binder_id, auth.uid()));

create policy "owners manage membership" on public.binder_members
  for all to authenticated
  using (public.is_binder_owner(binder_id, auth.uid()))
  with check (public.is_binder_owner(binder_id, auth.uid()));
