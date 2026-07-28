"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/layout/page-transition";
import { ChevronRight, TrendingUp, BarChart3, Sparkles, Compass, Target, Lock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Built on market signals.",
    body: "Every day, the industry tells a story. Paragon helps you understand it.",
    icon: BarChart3,
  },
  {
    title: "Clarity.",
    body: "Technology moves fast. Your decisions shouldn't rely on opinions.",
    icon: Sparkles,
  },
  {
    title: "Intelligence that evolves.",
    body: "Markets change. Skills change. Opportunities change. Stay aligned with what matters.",
    icon: Compass,
  },
  {
    title: "Built for ambitious engineers.",
    body: "Not everyone wants another job board. Some want to understand where the industry is going.",
    icon: Target,
  },
  {
    title: "Make better decisions.",
    body: "Learn with intention. Grow with confidence.",
    icon: TrendingUp,
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const heading = hero.querySelector("h1");
    const subtitle = hero.querySelectorAll("p");
    const buttons = hero.querySelector(".hero-buttons");
    const indicator = hero.querySelector(".scroll-indicator");

    const targets = [heading, subtitle[0], subtitle[1], subtitle[2], buttons, indicator].filter(Boolean);
    gsap.set(targets, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
    if (subtitle[0]) tl.to(subtitle[0], { opacity: 1, y: 0, duration: 0.7 }, 0.4);
    if (subtitle[1]) tl.to(subtitle[1], { opacity: 1, y: 0, duration: 0.6 }, 0.55);
    if (subtitle[2]) tl.to(subtitle[2], { opacity: 1, y: 0, duration: 0.5 }, 0.65);
    if (buttons) tl.to(buttons, { opacity: 1, y: 0, duration: 0.6 }, 0.8);
    if (indicator) tl.to(indicator, { opacity: 1, duration: 0.5 }, 1.2);
  }, []);

  useLayoutEffect(() => {
    const container = sectionsRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".section-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[calc(100vh-57px)] items-center overflow-hidden border-b border-zinc-800/50"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
          <h1 className="opacity-0 mx-auto mt-8 max-w-5xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Know where the <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">market is moving</span>.
          </h1>

          <p className="opacity-0 mx-auto mt-6 max-w-2xl text-center text-lg text-zinc-400 sm:text-xl">
            The future of career intelligence.
          </p>

          <p className="opacity-0 mx-auto mt-3 max-w-xl text-center text-base text-zinc-500">
            Built for developers who refuse to guess.
          </p>

          <p className="opacity-0 mx-auto mt-2 max-w-xl text-center text-sm text-zinc-600">
            Stay ahead. See what companies value before everyone else.
          </p>

          <div className="hero-buttons opacity-0 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TransitionLink
              href="/request-access"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-950 transition-all hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              Start exploring
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </TransitionLink>
            <TransitionLink
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
            >
              <Lock className="h-4 w-4" />
              Sign in
            </TransitionLink>
          </div>

          <div className="scroll-indicator opacity-0 mt-16 flex justify-center">
            <div className="h-10 w-6 rounded-full border border-zinc-700 flex items-start justify-center p-1.5">
              <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTIONS ============ */}
      <div ref={sectionsRef} className="mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-32">
        <div className="space-y-32">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <section
                key={section.title}
                className={`section-card flex flex-col items-center gap-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <div className="panel p-8 sm:p-12">
                    <div className="mb-6 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="copy-muted mt-4 max-w-xl">{section.body}</p>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 sm:h-52 sm:w-52">
                    <span className="text-7xl font-bold tracking-tight text-zinc-800 sm:text-8xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ============ FOOTER CTA ============ */}
      <section className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-8 sm:py-32">
          <Sparkles className="mx-auto h-10 w-10 text-cyan-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next opportunity starts long before you apply.
          </h2>
          <div className="mt-10 flex justify-center">
            <TransitionLink
              href="/request-access"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl p-px"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
              <span className="relative inline-flex items-center gap-2 rounded-[11px] bg-zinc-950 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-zinc-900">
                Start exploring
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/paragon.png" alt="" className="h-5 w-auto" />
            <span className="text-sm font-semibold text-white">Paragon</span>
          </div>
          <p className="text-sm text-zinc-500">
            Market intelligence for developers who refuse to guess.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <TransitionLink href="/login" className="transition-colors hover:text-white">Sign in</TransitionLink>
            <TransitionLink href="/request-access" className="transition-colors hover:text-white">Request access</TransitionLink>
          </div>
        </div>
      </footer>
    </>
  );
}
