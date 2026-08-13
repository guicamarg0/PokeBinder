export type CardCatalog = {
  id: string;
  name: string;
  card_number: string | null;
  set_name: string | null;
  language: string;
  card_type: string | null;
  rarity: string | null;
  image_url: string | null;
  variant: string;
};

export interface CatalogProvider {
  search(query: string): Promise<ReadonlyArray<Partial<CardCatalog>>>;
}
