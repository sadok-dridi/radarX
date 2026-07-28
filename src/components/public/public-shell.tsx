"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "@/components/layout/page-transition";
import { PageEntrance } from "@/components/layout/page-entrance";
import { Lock } from "lucide-react";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    gsap.to(header, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 });
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl opacity-0"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <TransitionLink href="/" className="flex items-center gap-3">
            <img src="/paragon.png" alt="Paragon" className="h-6 w-auto" />
            <span className="text-lg font-bold tracking-tight text-white">Paragon</span>
            <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Beta
            </span>
          </TransitionLink>
          <nav className="flex items-center gap-4">
            <TransitionLink
              href="/request-access"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Request Access
            </TransitionLink>
            <TransitionLink
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
            >
              <Lock className="h-3.5 w-3.5" />
              Sign in
            </TransitionLink>
          </nav>
        </div>
      </header>
      <main className="pt-[57px]">
        <PageEntrance>{children}</PageEntrance>
      </main>
    </div>
  );
}
