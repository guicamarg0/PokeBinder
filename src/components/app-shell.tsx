import { ShellNav } from "@/components/shell-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen pb-20 md:pb-0"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"><div><p className="text-lg font-black tracking-tight">PokeBinder</p><p className="text-xs text-slate-500">Sua coleção, do seu jeito.</p></div><ShellNav /></div></header><main className="mx-auto max-w-5xl px-4 py-6">{children}</main></div>;
}
