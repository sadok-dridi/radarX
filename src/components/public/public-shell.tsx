import Link from "next/link";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09041a]">
      {/* Mobile-optimized backdrops - lower blur on small screens */}
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-accent-cyan/15 blur-[80px] sm:blur-3xl transform-gpu" />
      <div className="pointer-events-none absolute right-[-8rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-accent-amber/15 blur-[80px] sm:blur-3xl transform-gpu" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-[20rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-mint/10 blur-[80px] sm:blur-3xl transform-gpu" />
      
      {/* Grid optimized for performance - simple static bg */}
      <div className="pointer-events-none absolute inset-0 bg-radar-grid bg-[size:82px_82px] opacity-[0.03]" />
      
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-50 mb-8 mx-auto w-full max-w-2xl rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-2xl shadow-glow-blue">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-100 uppercase transition-opacity hover:opacity-80">
              <span className="h-2 w-2 sm:h-3 sm:w-3 shrink-0 rounded-full bg-gradient-to-br from-accent-amber to-accent-cyan shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
              <span>RadarX</span>
              <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.24em] text-accent-cyan sm:text-[10px]">
                BETA
              </span>
            </Link>
            
            <nav className="flex items-center gap-4 text-xs sm:text-sm">
              <Link href="/request-access" className="font-medium text-slate-300 transition hover:text-white">
                Request Access
              </Link>
              <Link href="/login" className="rounded-full bg-white px-4 py-1.5 font-medium text-slate-950 transition hover:bg-slate-200">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-white/10 pt-8 pb-6 text-sm text-slate-400">
          <div className="flex flex-col gap-6 text-center sm:flex-row sm:justify-between sm:text-left lg:items-start">
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:mx-0 lg:max-w-lg">
              <p>Private opportunity intelligence, designed for high-signal workflow review.</p>
              <div className="inline-flex self-center sm:self-start items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left shadow-[0_0_24px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-amber shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                <p className="text-[11px] leading-relaxed text-slate-400 sm:text-xs">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-amber">
                    Active Build
                  </span>
                  RadarX is evolving daily with tighter workflows, cleaner scoring, and steady feature updates.
                </p>
              </div>
              <a
                href="https://sadokportfolio.mooo.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex self-center rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 transition-all hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-300 sm:mt-0 sm:self-start"
              >
                Built by <span className="ml-1 font-bold bg-gradient-to-r from-accent-cyan to-accent-mint bg-clip-text text-transparent">sadok</span>
              </a>
            </div>
            <div className="flex items-center justify-center gap-4 lg:self-start lg:pt-1">
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
