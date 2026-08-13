create or replace function public.send_friend_request(p_username text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare v_target uuid; v_request_id uuid;
begin
  select id into v_target from public.profiles where username = lower(trim(p_username));
  if v_target is null or v_target = auth.uid() then raise exception 'invalid friend target'; end if;
  insert into public.friendships(requester_id, addressee_id) values (auth.uid(), v_target) returning requester_id into v_request_id;
  insert into public.notifications(recipient_id, kind, payload) values (v_target, 'friend_request', jsonb_build_object('requester_id', auth.uid()));
  return v_request_id;
end;
$$;

create or replace function public.invite_binder_member(p_binder_id uuid, p_username text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare v_target uuid;
begin
  select id into v_target from public.profiles where username = lower(trim(p_username));
  if v_target is null or not exists (select 1 from public.binders where id = p_binder_id and owner_id = auth.uid()) then raise exception 'invalid member invite'; end if;
  insert into public.binder_members(binder_id, user_id) values (p_binder_id, v_target) on conflict do nothing;
  insert into public.notifications(recipient_id, kind, payload) values (v_target, 'binder_invite', jsonb_build_object('binder_id', p_binder_id));
  return v_target;
end;
$$;

create or replace function public.leave_binder(p_binder_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.binder_placements bp using public.binder_slots s, public.binder_pages p where bp.slot_id = s.id and s.page_id = p.id and p.binder_id = p_binder_id and exists (select 1 from public.collection_entries c where c.id = bp.collection_entry_id and c.owner_id = auth.uid());
  delete from public.binder_members where binder_id = p_binder_id and user_id = auth.uid();
end;
$$;

grant execute on function public.send_friend_request(text), public.invite_binder_member(uuid, text), public.leave_binder(uuid) to authenticated;
