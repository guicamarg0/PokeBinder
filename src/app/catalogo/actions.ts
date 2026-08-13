"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function importCatalogCard(formData: FormData) {
  const name = text(formData, "name");
  if (!name) redirect("/catalogo?error=carta-invalida");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("card_catalog").insert({ name, card_number: text(formData, "card_number") || null, set_name: text(formData, "set_name") || null, language: text(formData, "language") || "en", variant: text(formData, "variant") || "normal", rarity: text(formData, "rarity") || null, image_url: text(formData, "image_url") || null });
  if (error) redirect("/catalogo?error=nao-foi-possivel-salvar");
  revalidatePath("/catalogo");
  redirect("/catalogo?message=carta-importada");
}
