"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function createPull(formData: FormData) {
  const cardId = text(formData, "card_id");
  const quantity = Number.parseInt(text(formData, "quantity"), 10);
  const unitPrice = Number.parseInt(text(formData, "unit_price_cents"), 10);
  const shipping = Number.parseInt(text(formData, "shipping_cents") || "0", 10);
  if (!cardId || !text(formData, "seller_name") || !Number.isInteger(quantity) || quantity < 1 || !Number.isInteger(unitPrice) || unitPrice < 0 || !Number.isInteger(shipping) || shipping < 0) redirect("/pulls?error=dados-invalidos");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("create_pull_with_item", { p_seller_name: text(formData, "seller_name"), p_card_id: cardId, p_quantity: quantity, p_unit_price_cents: unitPrice, p_shipping_cents: shipping, p_notes: text(formData, "notes") || null });
  if (error) redirect("/pulls?error=nao-foi-possivel-criar");
  revalidatePath("/pulls");
  redirect("/pulls?message=pull-criado");
}
