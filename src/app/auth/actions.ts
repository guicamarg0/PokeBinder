"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function value(formData: FormData, name: string) { return String(formData.get(name) ?? "").trim(); }

export async function signIn(formData: FormData) {
  const email = value(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/login?error=preencha-os-campos");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=credenciais-invalidas");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = value(formData, "email");
  const password = String(formData.get("password") ?? "");
  const username = value(formData, "username").toLowerCase();
  const displayName = value(formData, "display_name");
  if (!email || password.length < 8 || !username || !displayName) redirect("/cadastro?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username, display_name: displayName } } });
  if (error || !data.user) redirect("/cadastro?error=nao-foi-possivel-cadastrar");
  redirect("/login?message=confirme-seu-email");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
