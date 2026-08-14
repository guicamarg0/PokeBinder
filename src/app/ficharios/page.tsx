import Link from "next/link";
import { createBinder } from "@/app/ficharios/actions";
import { disableBinderSharing, enableBinderSharing } from "@/app/ficharios/share-actions";

export const dynamic = "force-dynamic";

export default async function BindersPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const { createSupabaseServerClient } = await import("@/lib/supabase-server");
  const client = await createSupabaseServerClient();
  const { data: binders } = await client.from("binders").select("id,name,description,is_public,page_count,share_token").order("created_at", { ascending: false });

  return (
    <section className="space-y-6">
      <div><h1 className="text-2xl font-black">Meus fichários</h1><p className="mt-2 text-sm text-slate-500">Organize sua coleção em páginas 3x3.</p></div>
      {params.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Não foi possível concluir a operação.</p>}
      {params.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Operação concluída.</p>}
      <form action={createBinder} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Nome<input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" name="name" required /></label>
        <label className="text-sm font-semibold">Páginas<input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" defaultValue="1" min="1" max="500" name="page_count" required type="number" /></label>
        <label className="text-sm font-semibold sm:col-span-2">Descrição<textarea className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" name="description" /></label>
        <button className="rounded-xl bg-ink px-4 py-3 font-bold text-white sm:col-span-2" type="submit">Criar fichário</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2">
        {binders?.length ? binders.map((binder) => <article className="rounded-2xl border border-slate-200 bg-white p-4" key={binder.id}>
          <Link className="block" href={`/ficharios/${binder.id}`}><p className="font-bold hover:text-accent">{binder.name}</p><p className="mt-1 text-sm text-slate-500">{binder.page_count} página(s) · {binder.is_public ? "Público" : "Privado"}</p>{binder.description && <p className="mt-2 text-sm text-slate-600">{binder.description}</p>}<p className="mt-3 text-xs font-bold text-accent">Abrir fichário →</p></Link>
          <div className="mt-3 flex flex-wrap gap-2">{binder.is_public ? <form action={disableBinderSharing}><input name="binder_id" type="hidden" value={binder.id} /><button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold" type="submit">Revogar link</button></form> : <form action={enableBinderSharing}><input name="binder_id" type="hidden" value={binder.id} /><button className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white" type="submit">Compartilhar</button></form>}</div>
          {binder.is_public && <p className="mt-2 break-all text-xs text-slate-500">/compartilhar/{binder.share_token}</p>}
        </article>) : <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Nenhum fichário criado ainda.</div>}
      </div>
    </section>
  );
}
