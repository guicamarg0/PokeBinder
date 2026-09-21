"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Início", "/", "⌂"],
  ["Fichários", "/ficharios", "▣"],
  ["Trocas", "/trocas", "⇄"],
  ["Perfil", "/perfil", "♙"]
] as const;

export function ShellNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 py-2 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur md:static md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none">
      <div className="mx-auto flex max-w-5xl justify-around gap-1 md:justify-end md:gap-2">
        {links.map(([label, href, icon]) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link className={`nav-item ${active ? "nav-item-active" : ""}`} href={href} key={href}><span className="nav-icon">{icon}</span><span>{label}</span></Link>; })}
      </div>
    </nav>
  );
}
