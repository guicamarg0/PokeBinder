import { CollectionSearch } from "@/app/colecao/collection-search";
import { CollectionCardList, type CollectionEntry } from "@/app/colecao/collection-card-list";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const { createSupabaseServerClient } = await import("@/lib/supabase-server");
  const client = await createSupabaseServerClient();
  const { data: entries } = await client.from("collection_entries").select("id,quantity,language,condition,paid_amount_cents,market_value_cents,card_catalog(name,card_number,set_name,rarity,variant,image_url),binder_placements(quantity,binder_slots(slot_number,binder_pages(page_number,binders(id,name))))").order("created_at", { ascending: false });
  return <section className="space-y-6"><div><h1 className="text-2xl font-black">Minha coleção</h1><p className="mt-2 text-sm text-slate-500">Pesquise enquanto digita e clique em uma carta para ver todos os detalhes.</p></div>{params.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Não foi possível concluir a operação.</p>}{params.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Operação concluída.</p>}<CollectionSearch /><CollectionCardList entries={(entries ?? []) as unknown as CollectionEntry[]} /></section>;
}
