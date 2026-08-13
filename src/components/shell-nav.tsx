import Link from "next/link";

const links = [
  ["Início", "/"],
  ["Coleção", "/colecao"],
  ["Fichários", "/ficharios"],
  ["Pulls", "/pulls"]
] as const;

export function ShellNav() {
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-2 py-2 md:static md:border-0 md:bg-transparent md:px-0 md:py-0">
      <div className="mx-auto flex max-w-5xl justify-around gap-1 md:justify-start md:gap-6">
        {links.map(([label, href]) => <Link className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100" href={href} key={href}>{label}</Link>)}
      </div>
    </nav>
  );
}
