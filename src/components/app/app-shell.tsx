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
    <div className="min-h-screen bg-ink text-slate-100 bg-radar-grid bg-[size:40px_40px] flex flex-col lg:flex-row">
      {/* 
        =========================================================
        MOBILE HEADER & NAVIGATION
        =========================================================
      */}
      <header className="lg:hidden sticky top-0 z-50 flex flex-col border-b border-accent-purple/30 bg-ink/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-glow-blue animate-pulse-slow" />
            <span className="font-display font-bold tracking-wider text-white text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">RadarX</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-accent-purple/20 border border-accent-purple/50 flex items-center justify-center text-xs font-bold text-accent-cyan shadow-glow">
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
        <nav className="flex overflow-x-auto px-4 pb-3 gap-3 no-scrollbar border-t border-white/5 pt-3">
          {appNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-slate-300 transition hover:bg-accent-purple/20 hover:text-white border border-transparent hover:border-accent-purple/30 bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* 
        =========================================================
        DESKTOP SIDEBAR
        =========================================================
      */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r border-accent-purple/20 bg-slate-950/60 backdrop-blur-2xl p-6 shadow-glow z-40">
        <div className="mb-12 flex items-center gap-3 relative">
          <div className="absolute -inset-4 bg-accent-purple/10 blur-xl rounded-full z-0" />
          <span className="h-4 w-4 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-glow-blue animate-pulse-slow relative z-10" />
          <span className="font-display font-bold text-2xl tracking-wide text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            RadarX
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Menu</p>
          {appNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-300 transition-all hover:bg-accent-purple/10 hover:text-white border border-transparent hover:border-accent-purple/30 hover:shadow-[0_0_20px_rgba(147,51,234,0.1)] relative overflow-hidden"
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="rounded-2xl border border-accent-purple/20 bg-slate-900/60 p-4 mb-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-accent-purple/20 blur-2xl rounded-full" />
             <div className="font-semibold text-white truncate relative z-10">{user.name}</div>
             <div className="text-xs mt-1 text-slate-400 truncate relative z-10">{user.email}</div>
             <div className="mt-4 flex items-center justify-between relative z-10">
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent-mint px-2.5 py-1 bg-accent-purple/20 rounded-md border border-accent-purple/40">
                  {user.role}
                </span>
                <form action={logoutAction}>
                  <button type="submit" className="text-xs font-semibold text-accent-cyan hover:text-white transition-colors">Logout</button>
                </form>
             </div>
          </div>
          
          <div className="rounded-xl border border-accent-cyan/20 bg-slate-950/90 p-3 shadow-[0_0_15px_rgba(56,189,248,0.1)] flex items-center gap-3">
             <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse shadow-glow-blue" />
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-cyan">System Online</p>
          </div>
        </div>
      </aside>

      {/* 
        =========================================================
        MAIN CONTENT AREA
        =========================================================
      */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 relative z-10">
         <div className="mx-auto max-w-6xl">
           {children}
         </div>
      </main>
    </div>
  );
}
