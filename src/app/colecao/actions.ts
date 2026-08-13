"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function addToCollection(formData: FormData) {
  const cardId = text(formData, "card_id");
  const quantity = Number.parseInt(text(formData, "quantity"), 10);
  if (!cardId || !Number.isInteger(quantity) || quantity < 1) redirect("/colecao?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("collection_entries").insert({ owner_id: user.id, card_id: cardId, quantity, language: text(formData, "language") || "pt-BR", condition: text(formData, "condition") || null, notes: text(formData, "notes") || null });
  if (error) redirect("/colecao?error=nao-foi-possivel-adicionar");
  revalidatePath("/colecao");
  redirect("/colecao?message=carta-adicionada");
}
