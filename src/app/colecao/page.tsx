import { CollectionSearch } from "@/app/colecao/collection-search";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const { createSupabaseServerClient } = await import("@/lib/supabase-server");
  const client = await createSupabaseServerClient();
  const { data: entries } = await client.from("collection_entries").select("id,quantity,language,condition,card_catalog(name,set_name)").order("created_at", { ascending: false });
  return <section className="space-y-6"><div><h1 className="text-2xl font-black">Minha coleção</h1><p className="mt-2 text-sm text-slate-500">Pesquise enquanto digita e adicione cartas sem sair desta tela.</p></div>{params.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Não foi possível adicionar a carta.</p>}{params.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Carta adicionada à coleção.</p>}<CollectionSearch /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{entries?.length ? entries.map((entry) => <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={entry.id}><div className="flex min-h-32 items-center justify-center bg-slate-100 p-2"><p className="text-center text-4xl font-black text-slate-300">{entry.quantity}×</p></div><div className="p-3"><p className="truncate text-sm font-bold">{((Array.isArray(entry.card_catalog) ? entry.card_catalog[0] : entry.card_catalog) as { name: string } | null)?.name ?? "Carta"}</p><p className="mt-1 text-xs text-slate-500">{entry.language}</p></div></article>) : <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Sua coleção está vazia. Comece pela busca acima.</div>}</div></section>;
}
