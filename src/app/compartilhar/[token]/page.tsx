import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function SharedBinderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_shared_binder", { p_share_token: token });
  const binder = data?.[0];
  if (error || !binder) notFound();
  return <section className="space-y-6"><div className="rounded-3xl bg-ink p-6 text-white"><p className="text-sm text-slate-300">Fichário compartilhado</p><h1 className="mt-2 text-3xl font-black">{binder.name}</h1><p className="mt-2 text-sm text-slate-300">Por {binder.owner_name} · {binder.page_count} página(s)</p></div><div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">A visualização das cartas será adicionada na próxima etapa.</div></section>;
}
