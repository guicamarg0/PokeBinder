alter table public.collection_entries add column source_pull_id uuid references public.pulls(id) on delete set null;

create or replace function public.create_pull_with_item(
  p_seller_name text,
  p_card_id uuid,
  p_quantity integer,
  p_unit_price_cents integer,
  p_shipping_cents integer default 0,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller_id uuid;
  v_pull_id uuid;
begin
  if auth.uid() is null or p_quantity < 1 or p_unit_price_cents < 0 or p_shipping_cents < 0 then raise exception 'invalid pull data'; end if;
  if nullif(trim(p_seller_name), '') is null then raise exception 'seller is required'; end if;
  insert into public.sellers(owner_id, name) values (auth.uid(), trim(p_seller_name)) on conflict (owner_id, name) do update set name = excluded.name returning id into v_seller_id;
  insert into public.pulls(owner_id, seller_id, shipping_cents, notes) values (auth.uid(), v_seller_id, p_shipping_cents, p_notes) returning id into v_pull_id;
  insert into public.pull_items(pull_id, card_id, quantity, unit_price_cents) values (v_pull_id, p_card_id, p_quantity, p_unit_price_cents);
  return v_pull_id;
end;
$$;

create or replace function public.confirm_pull_to_collection(p_pull_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_status text;
  v_confirmed integer := 0;
  v_item record;
begin
  select owner_id, status into v_owner_id, v_status from public.pulls where id = p_pull_id for update;
  if v_owner_id is null or v_owner_id <> auth.uid() or v_status <> 'delivered' then raise exception 'pull is not ready for confirmation'; end if;
  if exists (select 1 from public.pulls where id = p_pull_id and collection_confirmed_at is not null) then raise exception 'pull already confirmed'; end if;
  for v_item in select * from public.pull_items where pull_id = p_pull_id loop
    insert into public.collection_entries(owner_id, card_id, quantity, source_pull_id) values (v_owner_id, v_item.card_id, v_item.quantity, p_pull_id);
    v_confirmed := v_confirmed + 1;
  end loop;
  update public.pulls set collection_confirmed_at = now(), updated_at = now() where id = p_pull_id;
  return v_confirmed;
end;
$$;

grant execute on function public.create_pull_with_item(text, uuid, integer, integer, integer, text) to authenticated;
grant execute on function public.confirm_pull_to_collection(uuid) to authenticated;
