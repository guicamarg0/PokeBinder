create or replace function public.create_binder_page_slots()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.binder_slots (page_id, slot_number)
  select new.id, generate_series(1, 9)
  on conflict (page_id, slot_number) do nothing;
  return new;
end;
$$;

drop trigger if exists binder_page_slots on public.binder_pages;
create trigger binder_page_slots
  after insert on public.binder_pages
  for each row execute function public.create_binder_page_slots();

insert into public.binder_slots (page_id, slot_number)
select p.id, slots.slot_number
from public.binder_pages p
cross join generate_series(1, 9) as slots(slot_number)
on conflict (page_id, slot_number) do nothing;
