alter table public.collection_entries
  add column if not exists market_value_cents integer check (market_value_cents is null or market_value_cents >= 0);
