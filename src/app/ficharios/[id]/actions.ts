"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function placeCard(formData: FormData) {
  const binderId = String(formData.get("binder_id") ?? "");
  const slotId = String(formData.get("slot_id") ?? "");
  const entryId = String(formData.get("collection_entry_id") ?? "");
  const quantity = Number.parseInt(String(formData.get("quantity") ?? "1"), 10);
  const client = await createSupabaseServerClient();
  if (!binderId || !slotId || !entryId || !Number.isInteger(quantity) || quantity < 1) redirect(`/ficharios/${binderId}?error=dados-invalidos`);
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await client.rpc("place_card", { p_slot_id: slotId, p_collection_entry_id: entryId, p_quantity: quantity });
  if (error) redirect(`/ficharios/${binderId}?error=nao-foi-possivel-alocar`);
  revalidatePath(`/ficharios/${binderId}`);
  redirect(`/ficharios/${binderId}?message=carta-alocada`);
}

export async function addCatalogCardAndPlace(formData: FormData) {
  const binderId = String(formData.get("binder_id") ?? "");
  const slotId = String(formData.get("slot_id") ?? "");
  const quantity = Number.parseInt(String(formData.get("quantity") ?? "1"), 10);
  const collectionQuantity = Number.parseInt(String(formData.get("collection_quantity") ?? "1"), 10);
  const client = await createSupabaseServerClient();
  if (!binderId || !slotId || !String(formData.get("name") ?? "") || !Number.isInteger(quantity) || !Number.isInteger(collectionQuantity) || quantity < 1 || collectionQuantity < quantity) redirect(`/ficharios/${binderId}?error=dados-invalidos`);
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await client.rpc("add_card_and_place", {
    p_slot_id: slotId,
    p_name: String(formData.get("name") ?? ""),
    p_card_number: String(formData.get("card_number") ?? ""),
    p_set_name: String(formData.get("set_name") ?? ""),
    p_language: String(formData.get("language") ?? "en"),
    p_condition: String(formData.get("condition") ?? ""),
    p_variant: String(formData.get("variant") ?? "normal"),
    p_rarity: String(formData.get("rarity") ?? ""),
    p_image_url: String(formData.get("image_url") ?? ""),
    p_collection_quantity: collectionQuantity,
    p_placement_quantity: quantity,
  });
  if (error) redirect(`/ficharios/${binderId}?error=nao-foi-possivel-alocar`);
  revalidatePath(`/ficharios/${binderId}`);
  redirect(`/ficharios/${binderId}?message=carta-alocada`);
}
