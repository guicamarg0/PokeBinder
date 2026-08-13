export type PullStatus = "purchased" | "awaiting_shipping" | "shipped" | "delivered" | "cancelled";

export type Pull = {
  id: string;
  seller_id: string | null;
  status: PullStatus;
  shipping_cents: number;
  notes: string | null;
  collection_confirmed_at: string | null;
};
