/* eslint-disable @next/next/no-img-element */

import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim() ?? "";
  const supabase = await createSupabaseServerClient();
  let cardsQuery = supabase.from("card_catalog").select("id,name,card_number,set_name,language,rarity,image_url,variant").order("name");
  if (query) cardsQuery = cardsQuery.ilike("name", `%${query}%`);
  const { data: cards } = await cardsQuery;
  return <section className="space-y-6"><div><h1 className="text-2xl font-black">Catálogo</h1><p className="mt-2 text-sm text-slate-500">Consulte cartas já conhecidas, variantes, imagens e raridades.</p></div><form className="rounded-2xl border border-slate-200 bg-white p-4" method="get"><label className="sr-only" htmlFor="catalog-search">Filtrar catálogo</label><input className="w-full rounded-xl border border-slate-300 px-4 py-3" defaultValue={query} id="catalog-search" name="q" placeholder="Filtrar cartas do catálogo..." /></form><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{cards?.map((card) => <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={card.id}><div className="aspect-[3/4] bg-slate-100">{card.image_url && <img alt={card.name} className="h-full w-full object-cover" src={card.image_url} />}</div><div className="p-3"><p className="truncate text-sm font-bold">{card.name}</p><p className="mt-1 truncate text-xs text-slate-500">{card.set_name ?? "Coleção desconhecida"}</p><p className="mt-1 text-xs text-slate-500">{card.card_number ?? "Sem número"} · {card.rarity ?? "Sem raridade"}</p></div></article>)}{!cards?.length && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Nenhuma carta no catálogo ainda. Adicione pela sua coleção.</div>}</div></section>;
}
