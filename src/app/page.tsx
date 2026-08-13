const cards = [
  { label: "Cartas na coleção", value: "0" },
  { label: "Em fichários", value: "0" },
  { label: "Disponíveis", value: "0" }
];

export default function HomePage() {
  return <section className="space-y-6"><div className="rounded-3xl bg-ink p-6 text-white"><p className="text-sm text-slate-300">Visão geral</p><h1 className="mt-2 text-3xl font-black tracking-tight">Monte seu próximo fichário.</h1><p className="mt-2 max-w-xl text-sm text-slate-300">A base está pronta para você cadastrar cartas, organizar páginas e acompanhar seus Pulls.</p><button className="mt-5 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white">Adicionar carta</button></div><div className="grid gap-3 sm:grid-cols-3">{cards.map((card) => <div className="rounded-2xl border border-slate-200 bg-white p-4" key={card.label}><p className="text-sm text-slate-500">{card.label}</p><p className="mt-2 text-3xl font-black">{card.value}</p></div>)}</div><div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-bold">Tudo começa com uma carta</p><p className="mt-1 text-sm text-slate-500">Sua coleção ainda está vazia. Cadastre a primeira carta para começar.</p></div></section>;
}
