"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { addSearchedCardToCollection } from "@/app/colecao/actions";
import type { CatalogSearchResult } from "@/features/catalog/pokemon-tcg-provider";

export function CollectionSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReadonlyArray<CatalogSearchResult>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(cleanQuery)}`);
        setResults(response.ok ? await response.json() : []);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className="space-y-3">
      <div className="relative">
        <label className="sr-only" htmlFor="collection-search">Buscar carta para adicionar</label>
        <input
          autoComplete="off"
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 pr-28 text-base shadow-sm outline-none focus:border-ink"
          id="collection-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite o nome ou número da carta..."
          value={query}
        />
        {loading && <span className="absolute right-4 top-4 text-xs font-semibold text-slate-400">Buscando...</span>}
      </div>

      {query.trim().length >= 2 && !loading && (
        <div className="grid gap-2 sm:grid-cols-2">
          {results.map((card) => (
            <form action={addSearchedCardToCollection} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3" key={`${card.source}-${card.external_id}`}>
              <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {card.image_url && <img alt="" className="h-full w-full object-cover" src={card.image_url} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{card.name}</p>
                <p className="truncate text-xs text-slate-500">{card.set_name ?? "Coleção desconhecida"} · {card.card_number ?? "Sem número"}</p>
                <input name="name" type="hidden" value={card.name} />
                <input name="card_number" type="hidden" value={card.card_number ?? ""} />
                <input name="set_name" type="hidden" value={card.set_name ?? ""} />
                <input name="language" type="hidden" value={card.language} />
                <input name="rarity" type="hidden" value={card.rarity ?? ""} />
                <input name="variant" type="hidden" value={card.variant} />
                <input name="image_url" type="hidden" value={card.image_url ?? ""} />
                <div className="mt-2 flex items-center gap-2">
                  <input className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs" defaultValue="1" min="1" name="quantity" type="number" />
                  <button className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white" type="submit">Adicionar</button>
                </div>
              </div>
            </form>
          ))}
          {!results.length && <p className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 sm:col-span-2">Nenhuma carta encontrada.</p>}
        </div>
      )}
    </section>
  );
}
