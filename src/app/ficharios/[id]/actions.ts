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
