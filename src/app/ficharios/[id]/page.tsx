import Link from "next/link";
import { notFound } from "next/navigation";
import { BinderGrid } from "@/app/ficharios/[id]/binder-grid";

export const dynamic = "force-dynamic";

export default async function BinderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; error?: string; message?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const client = await (await import("@/lib/supabase-server")).createSupabaseServerClient();
  const { data: binder } = await client.from("binders").select("id,name,description,page_count").eq("id", id).maybeSingle();
  if (!binder) notFound();
  const safePage = Math.min(pageNumber, binder.page_count);
  const { data: page } = await client.from("binder_pages").select("id,page_number,binder_slots(id,slot_number,binder_placements(quantity,collection_entries(id,card_catalog(name,set_name,card_number,image_url))))").eq("binder_id", id).eq("page_number", safePage).maybeSingle();
  if (!page) notFound();
  const { data: entries } = await client.from("collection_entries").select("id,quantity,language,condition,card_catalog(name,set_name,card_number,image_url)").order("created_at", { ascending: false });
  return <section className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link className="text-sm font-bold text-accent" href="/ficharios">← Fichários</Link><h1 className="mt-2 text-2xl font-black">{binder.name}</h1>{binder.description && <p className="mt-1 text-sm text-slate-500">{binder.description}</p>}</div><p className="rounded-xl bg-white px-3 py-2 text-sm font-bold shadow-sm">Página {safePage} de {binder.page_count}</p></div>{query.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Não foi possível alocar esta carta.</p>}{query.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Carta alocada com sucesso.</p>}<div className="flex items-center justify-between"><Link className={`rounded-lg border px-3 py-2 text-sm font-bold ${safePage <= 1 ? "pointer-events-none opacity-40" : ""}`} href={`/ficharios/${id}?page=${safePage - 1}`}>← Anterior</Link><span className="text-sm text-slate-500">Grade 3 × 3</span><Link className={`rounded-lg border px-3 py-2 text-sm font-bold ${safePage >= binder.page_count ? "pointer-events-none opacity-40" : ""}`} href={`/ficharios/${id}?page=${safePage + 1}`}>Próxima →</Link></div><BinderGrid binderId={id} pageNumber={safePage} slots={(page.binder_slots ?? []) as never} entries={(entries ?? []) as never} /></section>;
}
