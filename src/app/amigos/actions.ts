"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function sendFriendRequest(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("send_friend_request", { p_username: username });
  if (error) redirect("/amigos?error=nao-foi-possivel-enviar");
  revalidatePath("/amigos");
  redirect("/amigos?message=solicitacao-enviada");
}
