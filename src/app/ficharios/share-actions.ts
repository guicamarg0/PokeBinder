"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function enableBinderSharing(formData: FormData) {
  const binderId = String(formData.get("binder_id") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("binders").update({ is_public: true }).eq("id", binderId);
  if (error) redirect("/ficharios?error=nao-foi-possivel-compartilhar");
  revalidatePath("/ficharios");
  redirect("/ficharios?message=compartilhamento-ativado");
}

export async function disableBinderSharing(formData: FormData) {
  const binderId = String(formData.get("binder_id") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("binders").update({ is_public: false }).eq("id", binderId);
  if (error) redirect("/ficharios?error=nao-foi-possivel-revogar");
  revalidatePath("/ficharios");
  redirect("/ficharios?message=compartilhamento-revogado");
}
