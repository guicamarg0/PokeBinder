"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { placeCard } from "@/app/ficharios/[id]/actions";

type Card = { name: string; set_name: string | null; card_number: string | null; image_url: string | null };
type Entry = { id: string; quantity: number; language: string; condition: string | null; card_catalog: Card | Card[] | null };
type Slot = { id: string; slot_number: number; binder_placements: { quantity: number; collection_entries: { card_catalog: Card | Card[] | null } | null }[] };

function cardFrom(entry: { card_catalog: Card | Card[] | null } | null) { return !entry ? null : Array.isArray(entry.card_catalog) ? entry.card_catalog[0] : entry.card_catalog; }

export function BinderGrid({ binderId, pageNumber, slots, entries }: { binderId: string; pageNumber: number; slots: Slot[]; entries: Entry[] }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const slotByNumber = new Map(slots.map((slot) => [slot.slot_number, slot]));
  const availableEntries = entries.filter((entry) => entry.quantity > 0);

  return <>
    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-200 p-3">{Array.from({ length: 9 }, (_, index) => {
      const slot = slotByNumber.get(index + 1);
      const placement = slot?.binder_placements?.[0];
      const card = cardFrom(placement?.collection_entries ?? null);
      return <button className={`relative aspect-[3/4] overflow-hidden rounded-xl border bg-white text-left ${card ? "border-slate-200" : "border-dashed border-slate-400"}`} key={slot?.id ?? index} onClick={() => setSelectedSlot(slot?.id ?? null)} type="button">
        {card?.image_url ? <img alt={card.name} className="h-full w-full object-cover" src={card.image_url} /> : <span className="flex h-full items-center justify-center p-2 text-center text-xs font-bold text-slate-400">Espaço {index + 1}<br />Adicionar carta</span>}
        {placement && <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">x{placement.quantity}</span>}
      </button>;
    })}</div>
    {selectedSlot && <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center"><div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Adicionar carta</h2><p className="text-sm text-slate-500">Minha coleção · página {pageNumber}</p></div><button className="text-sm font-bold text-slate-500" onClick={() => setSelectedSlot(null)} type="button">Fechar</button></div><div className="mt-4 space-y-2">{availableEntries.length ? availableEntries.map((entry) => { const card = cardFrom(entry); return <form action={placeCard} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3" key={entry.id}><input name="binder_id" type="hidden" value={binderId} /><input name="slot_id" type="hidden" value={selectedSlot} /><input name="collection_entry_id" type="hidden" value={entry.id} /><div className="h-16 w-12 overflow-hidden rounded bg-slate-100">{card?.image_url && <img alt="" className="h-full w-full object-cover" src={card.image_url} />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{card?.name ?? "Carta"}</p><p className="text-xs text-slate-500">{card?.set_name ?? "Sem set"} · total {entry.quantity} · disponível {entry.quantity}</p><div className="mt-2 flex items-center gap-2"><input className="w-16 rounded border px-2 py-1 text-xs" defaultValue="1" min="1" max={entry.quantity} name="quantity" type="number" /><button className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white" type="submit">Adicionar</button></div></div></form>; }) : <p className="rounded-xl border border-dashed p-5 text-center text-sm text-slate-500">Sua coleção ainda não tem cartas disponíveis.</p>}</div></div></div>}
  </>;
}
