import { ShellNav } from "@/components/shell-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen pb-24 md:pb-0"><header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><div><p className="brand-mark">Poke<span>Binder</span></p><p className="brand-tagline">Sua coleção, sempre com você.</p></div><button aria-label="Abrir notificações" className="notification-button">♧<span /></button><div className="hidden md:block"><ShellNav /></div></div></header><main className="mx-auto max-w-6xl px-5 py-6 md:py-8">{children}</main><div className="md:hidden"><ShellNav /></div></div>;
}
