"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { appNavigation } from "@/lib/navigation";
import { TransitionLink } from "@/components/layout/page-transition";
import { PanelLeftClose, PanelLeftOpen, LayoutDashboard, Activity, Settings, LogOut, Shield, Search, Command, X } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "owner" | "member";
  };
};

const iconMap: Record<string, React.ElementType> = {
  "/app": LayoutDashboard,
  "/app/opportunities": Activity,
  "/app/reviews": Shield,
  "/app/sources": Activity,
  "/app/access": Shield,
  "/app/settings": Settings,
};

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const getNavIcon = (href: string) => {
    const Icon = iconMap[href];
    return Icon ? <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} /> : null;
  };

  const currentItem = appNavigation.find((i) => pathname.startsWith(i.href));
  const activeTitle = currentItem?.label || "Dashboard";

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-zinc-950">
      <div className="relative w-full h-screen bg-zinc-900/20 flex overflow-hidden">
        {/* ============ SIDEBAR ============ */}
        <div
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-zinc-950 border-r border-zinc-800/50 ${
            sidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 border-none"
          }`}
        >
          <div className="flex flex-col w-[260px] h-full p-3">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-2 mb-6">
              <img src="/paragon.png" alt="" className="h-5 w-auto" />
              <span className="font-display text-xl font-bold tracking-wide text-white uppercase">Paragon</span>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-cyan-400">
                BETA
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-1">
              <span className="px-2.5 mb-2 text-[11px] font-bold tracking-wider text-zinc-600 uppercase">Menu</span>
              {appNavigation.map((item) => {
                if (item.requireOwner && user.role !== "owner") return null;
                const isActive = pathname.startsWith(item.href);
                const Icon = iconMap[item.href];
                return (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none text-[13px] tracking-wide ${
                      isActive
                        ? "bg-white/10 text-white font-bold"
                        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {Icon && (
                        <Icon
                          className={`w-[16px] h-[16px] transition-colors ${
                            isActive ? "text-cyan-400" : "text-zinc-600 group-hover:text-zinc-400"
                          }`}
                          strokeWidth={1.5}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>
                  </TransitionLink>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3">
                <div className="font-semibold text-white text-sm truncate">{user.name}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-cyan-400 px-2 py-1 bg-cyan-400/10 rounded-md border border-cyan-400/20">
                    {user.role}
                  </span>
                  <form action={logoutAction}>
                    <button type="submit" className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                      <LogOut className="w-3 h-3" strokeWidth={1.5} />
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ MAIN CONTENT ============ */}
        <div className="flex-1 bg-zinc-950 flex flex-col min-w-0 transition-all duration-300">
          {/* TOP BAR */}
          <div className="h-14 border-b border-zinc-800/50 flex items-center px-4 justify-between bg-zinc-950 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
              >
                {sidebarOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
              </button>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="font-bold text-zinc-300 truncate">{activeTitle}</span>
              </div>
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </div>
        </div>

        {/* ============ SEARCH OVERLAY ============ */}
        {searchOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-zinc-950/40 backdrop-blur-sm px-4">
            <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />
            <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center px-4 border-b border-zinc-800/50">
                <Search className="w-[18px] h-[18px] text-zinc-500 mr-3 shrink-0" strokeWidth={1.5} />
                <input
                  autoFocus
                  className="flex-1 bg-transparent py-4 outline-none text-[14px] font-mono font-bold text-white placeholder:text-zinc-600"
                  placeholder="Search pages, opportunities..."
                />
                <kbd
                  onClick={() => setSearchOpen(false)}
                  className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-bold font-mono text-zinc-600 bg-white/5 border border-white/10 rounded-[4px] cursor-pointer hover:text-zinc-300 hover:bg-white/10 transition-colors"
                >
                  ESC
                </kbd>
                <button onClick={() => setSearchOpen(false)} className="ml-3 p-1 rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-2 py-8 flex flex-col items-center justify-center">
                <Command className="w-6 h-6 text-zinc-700 mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-zinc-600 font-bold">Type a command or search...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
