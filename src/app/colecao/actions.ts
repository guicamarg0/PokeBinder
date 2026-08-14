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

export async function addSearchedCardToCollection(formData: FormData) {
  const quantity = Number.parseInt(text(formData, "quantity"), 10);
  const name = text(formData, "name");
  if (!name || !Number.isInteger(quantity) || quantity < 1) redirect("/colecao?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const cardNumber = text(formData, "card_number") || null;
  const setName = text(formData, "set_name") || null;
  const language = text(formData, "language") || "en";
  const variant = text(formData, "variant") || "normal";
  const { data: existingCard } = await supabase.from("card_catalog").select("id").eq("name", name).eq("language", language).eq("variant", variant).eq("card_number", cardNumber).eq("set_name", setName).maybeSingle();
  const { data: card, error: cardError } = existingCard
    ? { data: existingCard, error: null }
    : await supabase.from("card_catalog").insert({ name, card_number: cardNumber, set_name: setName, language, variant, rarity: text(formData, "rarity") || null, image_url: text(formData, "image_url") || null }).select("id").single();
  if (cardError || !card) redirect("/colecao?error=nao-foi-possivel-importar");
  const { error } = await supabase.from("collection_entries").insert({ owner_id: user.id, card_id: card.id, quantity, language: text(formData, "language") || "en" });
  if (error) redirect("/colecao?error=nao-foi-possivel-adicionar");
  revalidatePath("/colecao");
  revalidatePath("/catalogo");
  redirect("/colecao?message=carta-adicionada");
}

export async function updateCollectionEntry(formData: FormData) {
  const entryId = text(formData, "entry_id");
  const quantity = Number.parseInt(text(formData, "quantity"), 10);
  const paid = text(formData, "paid_amount_cents");
  const market = text(formData, "market_value_cents");
  if (!entryId || !Number.isInteger(quantity) || quantity < 1) redirect("/colecao?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: placements } = await supabase.from("binder_placements").select("quantity").eq("collection_entry_id", entryId);
  const allocated = (placements ?? []).reduce((sum, placement) => sum + placement.quantity, 0);
  if (quantity < allocated) redirect("/colecao?error=quantidade-menor-que-alocada");
  const { error } = await supabase.from("collection_entries").update({ quantity, language: text(formData, "language") || "en", condition: text(formData, "condition") || null, paid_amount_cents: paid ? Number.parseInt(paid, 10) : null, market_value_cents: market ? Number.parseInt(market, 10) : null }).eq("id", entryId).eq("owner_id", user.id);
  if (error) redirect("/colecao?error=nao-foi-possivel-atualizar");
  revalidatePath("/colecao");
  redirect("/colecao?message=carta-atualizada");
}

export async function removeCollectionEntry(formData: FormData) {
  const entryId = text(formData, "entry_id");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { count } = await supabase.from("binder_placements").select("id", { count: "exact", head: true }).eq("collection_entry_id", entryId);
  if ((count ?? 0) > 0) redirect("/colecao?error=desaloque-antes-de-remover");
  const { error } = await supabase.from("collection_entries").delete().eq("id", entryId).eq("owner_id", user.id);
  if (error) redirect("/colecao?error=nao-foi-possivel-remover");
  revalidatePath("/colecao");
  redirect("/colecao?message=carta-removida");
}
