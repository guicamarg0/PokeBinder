create or replace function public.add_card_and_place(
  p_slot_id uuid,
  p_name text,
  p_card_number text,
  p_set_name text,
  p_language text,
  p_condition text,
  p_variant text,
  p_rarity text,
  p_image_url text,
  p_collection_quantity integer,
  p_placement_quantity integer
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_card_id uuid;
  v_entry_id uuid;
  v_placement_id uuid;
begin
  if auth.uid() is null or p_name is null or trim(p_name) = '' or p_collection_quantity < 1 or p_placement_quantity < 1 or p_placement_quantity > p_collection_quantity then
    raise exception 'invalid card allocation';
  end if;

  select id into v_card_id from public.card_catalog
  where name = trim(p_name)
    and card_number is not distinct from nullif(trim(p_card_number), '')
    and set_name is not distinct from nullif(trim(p_set_name), '')
    and language = coalesce(nullif(trim(p_language), ''), 'en')
    and variant = coalesce(nullif(trim(p_variant), ''), 'normal')
  limit 1;

  if v_card_id is null then
    insert into public.card_catalog (name, card_number, set_name, language, variant, rarity, image_url)
    values (trim(p_name), nullif(trim(p_card_number), ''), nullif(trim(p_set_name), ''), coalesce(nullif(trim(p_language), ''), 'en'), coalesce(nullif(trim(p_variant), ''), 'normal'), nullif(trim(p_rarity), ''), nullif(trim(p_image_url), ''))
    returning id into v_card_id;
  end if;

  insert into public.collection_entries (owner_id, card_id, quantity, language, condition)
  values (auth.uid(), v_card_id, p_collection_quantity, coalesce(nullif(trim(p_language), ''), 'en'), nullif(trim(p_condition), ''))
  returning id into v_entry_id;

  v_placement_id := public.place_card(p_slot_id, v_entry_id, p_placement_quantity);
  return v_placement_id;
end;
$$;

grant execute on function public.add_card_and_place(uuid, text, text, text, text, text, text, text, text, integer, integer) to authenticated;
