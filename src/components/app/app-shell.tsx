import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";
import { appNavigation } from "@/lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "owner" | "member";
  };
};

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#09041a] text-slate-100 lg:block">
      {/* Background Elements (Matching Landing Page PublicShell exactly) */}
      <div className="pointer-events-none fixed left-[-10rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-accent-cyan/15 blur-[80px] sm:blur-3xl transform-gpu z-0" />
      <div className="pointer-events-none fixed right-[-8rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-accent-amber/15 blur-[80px] sm:blur-3xl transform-gpu z-0" />
      <div className="pointer-events-none fixed bottom-[-8rem] left-1/2 h-[20rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent-mint/10 blur-[80px] sm:blur-3xl transform-gpu z-0" />
      
      {/* Animated Grid matching Landing Page page.tsx */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-radar-grid animate-pan-grid opacity-20" />

      {/* 
        =========================================================
        MOBILE HEADER & NAVIGATION
        =========================================================
      */}
      <header className="lg:hidden sticky top-0 z-50 flex flex-col border-b border-white/10 bg-[#09041a]/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 py-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent-amber to-accent-cyan shadow-[0_0_20px_rgba(56,189,248,0.8)] animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-wider text-white uppercase">RadarX</span>
              <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-accent-cyan">
                Beta
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Exit
              </button>
            </form>
          </div>
        </div>
        
        {/* Mobile Scrollable Nav */}
        <nav className="flex overflow-x-auto px-4 pb-3 gap-3 no-scrollbar border-t border-white/10 pt-3 relative z-10">
          {appNavigation.map((item) => {
            if (item.requireOwner && user.role !== "owner") return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-slate-300 transition hover:bg-white/[0.05] hover:text-white border border-white/5 bg-white/[0.03]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 
        =========================================================
        DESKTOP SIDEBAR
        =========================================================
      */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-screen lg:w-[280px] lg:flex-col lg:border-r lg:border-white/10 lg:bg-white/[0.03] lg:p-6 lg:backdrop-blur-2xl">
        <div className="mb-12 flex items-center gap-3 relative">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-accent-amber to-accent-cyan shadow-[0_0_20px_rgba(56,189,248,0.8)] animate-pulse relative z-10" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="font-display text-2xl font-bold tracking-wide text-white uppercase">RadarX</span>
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-accent-cyan">
              Beta
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Menu</p>
          {appNavigation.map((item) => {
            if (item.requireOwner && user.role !== "owner") return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white border border-transparent hover:border-white/10 relative overflow-hidden"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-4 relative overflow-hidden transition-colors hover:border-white/[0.12]">
             <div className="font-semibold text-white truncate relative z-10">{user.name}</div>
             <div className="text-xs mt-1 text-slate-400 truncate relative z-10">{user.email}</div>
             <div className="mt-4 flex items-center justify-between relative z-10">
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent-cyan px-2.5 py-1 bg-accent-cyan/10 rounded-md border border-accent-cyan/20">
                  {user.role}
                </span>
                <form action={logoutAction}>
                  <button type="submit" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Logout</button>
                </form>
             </div>
          </div>
          
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
             <span className="h-2 w-2 rounded-full bg-accent-mint animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">System Online</p>
          </div>
        </div>
      </aside>

      {/* 
        =========================================================
        MAIN CONTENT AREA
        =========================================================
      */}
      <main className="relative z-10 w-full min-w-0 p-4 sm:p-6 lg:ml-[280px] lg:w-[calc(100%-280px)] lg:p-8 xl:p-10">
         <div className="mx-auto max-w-6xl">
           {children}
         </div>
      </main>
    </div>
  );
}
