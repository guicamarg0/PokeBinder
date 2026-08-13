import type { CatalogProvider } from "@/features/catalog/types";

export type CatalogSearchResult = {
  external_id: string;
  name: string;
  card_number: string | null;
  set_name: string | null;
  language: string;
  rarity: string | null;
  image_url: string | null;
  variant: string;
  source: "pokemon-tcg-api" | "tcgdex";
};

type PokemonTcgCard = { id: string; name: string; number?: string; rarity?: string; images?: { small?: string; large?: string }; set?: { name?: string; printedTotal?: number; total?: number } };

function mapPokemonTcgCard(card: PokemonTcgCard): CatalogSearchResult {
  const total = card.set?.printedTotal ?? card.set?.total;
  return { external_id: card.id, name: card.name, card_number: total ? `${card.number ?? ""}/${total}` : card.number ?? null, set_name: card.set?.name ?? null, language: "en", rarity: card.rarity ?? null, image_url: card.images?.large ?? card.images?.small ?? null, variant: "normal", source: "pokemon-tcg-api" };
}

export class PokemonTcgCatalogProvider implements CatalogProvider {
  async search(query: string): Promise<ReadonlyArray<CatalogSearchResult>> {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return [];
    try {
      const headers: HeadersInit = { accept: "application/json" };
      if (process.env.POKEMON_TCG_API_KEY) headers["X-Api-Key"] = process.env.POKEMON_TCG_API_KEY;
      const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"*${encodeURIComponent(cleanQuery)}*"&pageSize=12`, { headers, next: { revalidate: 3600 } });
      if (response.ok) {
        const body = await response.json() as { data?: PokemonTcgCard[] };
        if (body.data?.length) return body.data.map(mapPokemonTcgCard);
      }
    } catch { /* fallback abaixo */ }
    return this.searchTcgdex(cleanQuery);
  }

  private async searchTcgdex(query: string): Promise<ReadonlyArray<CatalogSearchResult>> {
    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } });
      if (!response.ok) return [];
      const cards = await response.json() as Array<{ id: string; name: string; localId?: string; image?: string }>;
      return cards.slice(0, 12).map((card) => ({ external_id: card.id, name: card.name, card_number: card.localId ?? null, set_name: card.id.split("-")[0]?.toUpperCase() ?? null, language: "en", rarity: null, image_url: card.image ? `${card.image}/high.png` : null, variant: "normal", source: "tcgdex" }));
    } catch { return []; }
  }
}
