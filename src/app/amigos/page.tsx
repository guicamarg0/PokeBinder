import { sendFriendRequest } from "@/app/amigos/actions";

export const dynamic = "force-dynamic";

export default async function FriendsPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const client = await (await import("@/lib/supabase-server")).createSupabaseServerClient();
  const { data: requests } = await client.from("friendships").select("requester_id,addressee_id,status,created_at").order("created_at", { ascending: false });
  const { data: notifications } = await client.from("notifications").select("kind,read_at,created_at").order("created_at", { ascending: false }).limit(20);
  return <section className="space-y-6"><div><h1 className="text-2xl font-black">Amigos</h1><p className="mt-2 text-sm text-slate-500">Envie solicitações sem conceder acesso automático à sua coleção.</p></div>{params.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Não foi possível enviar a solicitação.</p>}{params.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">Solicitação enviada.</p>}<form action={sendFriendRequest} className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-4"><input className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3" name="username" placeholder="nome_de_usuario" required /><button className="rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white" type="submit">Adicionar</button></form><div className="rounded-2xl border border-slate-200 bg-white p-4"><h2 className="font-bold">Solicitações</h2><p className="mt-2 text-sm text-slate-500">{requests?.length ?? 0} registro(s) · aceite e bloqueio serão adicionados na próxima etapa.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><h2 className="font-bold">Notificações</h2><p className="mt-2 text-sm text-slate-500">{notifications?.length ?? 0} notificação(ões).</p></div></section>;
}
