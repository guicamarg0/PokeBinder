"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function createBinder(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const pageCount = Number.parseInt(String(formData.get("page_count") ?? "1"), 10);
  if (!name || !Number.isInteger(pageCount) || pageCount < 1 || pageCount > 500) redirect("/ficharios?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: binder, error } = await supabase.from("binders").insert({ owner_id: user.id, name, description: String(formData.get("description") ?? "").trim() || null, page_count: pageCount, is_public: false }).select("id").single();
  if (error || !binder) redirect("/ficharios?error=nao-foi-possivel-criar");
  const pages = Array.from({ length: pageCount }, (_, index) => ({ binder_id: binder.id, page_number: index + 1 }));
  const { error: pagesError } = await supabase.from("binder_pages").insert(pages);
  if (pagesError) redirect("/ficharios?error=nao-foi-possivel-criar");
  revalidatePath("/ficharios");
  redirect("/ficharios?message=fichario-criado");
}
