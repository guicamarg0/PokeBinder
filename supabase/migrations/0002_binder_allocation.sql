create or replace function public.place_card(
  p_slot_id uuid,
  p_collection_entry_id uuid,
  p_quantity integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_card_id uuid;
  v_binder_id uuid;
  v_allocated integer;
  v_existing_card uuid;
  v_placement_id uuid;
begin
  if auth.uid() is null or p_quantity is null or p_quantity < 1 then
    raise exception 'invalid placement';
  end if;

  select c.owner_id, c.card_id into v_owner_id, v_card_id
    from public.collection_entries c where c.id = p_collection_entry_id for update;
  if v_owner_id is null or v_owner_id <> auth.uid() then
    raise exception 'collection entry is not owned by current user';
  end if;

  select b.id into v_binder_id
    from public.binder_slots s
    join public.binder_pages p on p.id = s.page_id
    join public.binders b on b.id = p.binder_id
    where s.id = p_slot_id
      and (b.owner_id = auth.uid() or exists (select 1 from public.binder_members m where m.binder_id = b.id and m.user_id = auth.uid()));
  if v_binder_id is null then
    raise exception 'slot is not accessible';
  end if;

  select c.card_id into v_existing_card from public.binder_placements bp join public.collection_entries c on c.id = bp.collection_entry_id where bp.slot_id = p_slot_id;
  if v_existing_card is not null and v_existing_card <> v_card_id then
    raise exception 'slot already contains another card';
  end if;

  select coalesce(sum(quantity), 0) into v_allocated from public.binder_placements where collection_entry_id = p_collection_entry_id and slot_id <> p_slot_id;
  if v_allocated + p_quantity > (select quantity from public.collection_entries where id = p_collection_entry_id) then
    raise exception 'insufficient available quantity';
  end if;

  insert into public.binder_placements (slot_id, collection_entry_id, quantity)
    values (p_slot_id, p_collection_entry_id, p_quantity)
    on conflict (slot_id) do update set collection_entry_id = excluded.collection_entry_id, quantity = excluded.quantity
    returning id into v_placement_id;
  return v_placement_id;
end;
$$;

grant execute on function public.place_card(uuid, uuid, integer) to authenticated;
