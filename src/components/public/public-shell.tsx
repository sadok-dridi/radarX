import Link from "next/link";

import { publicNavigation } from "@/lib/navigation";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-accent-cyan/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-accent-amber/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-[20rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-radar-grid bg-[size:82px_82px] opacity-[0.05]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-12 pt-6 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-20 mb-8 rounded-full border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-slate-100 uppercase">
              <span className="h-3 w-3 rounded-full bg-gradient-to-br from-accent-amber to-accent-cyan shadow-[0_0_24px_rgba(89,199,255,0.7)]" />
              Opportunity Radar
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              {publicNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/request-access" className="transition hover:text-white">
                Access
              </Link>
              <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-white/30 hover:bg-white/5">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-400">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>Private opportunity intelligence, designed for high-signal workflow review.</p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
              <Link href="/request-access" className="transition hover:text-white">
                Request access
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
