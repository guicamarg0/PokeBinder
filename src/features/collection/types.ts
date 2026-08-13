export type CollectionEntry = {
  id: string;
  owner_id: string;
  card_id: string;
  quantity: number;
  language: string;
  condition: string | null;
  paid_amount_cents: number | null;
  notes: string | null;
  is_wanted: boolean;
  is_for_trade: boolean;
  is_for_sale: boolean;
};
