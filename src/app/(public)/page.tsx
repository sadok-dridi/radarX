"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radar,
  Filter,
  CheckCircle2,
  Route,
  Activity,
  Database,
  Shield,
  Zap,
  Lock,
  ChevronRight,
} from "lucide-react";

const signalStages = [
  {
    name: "Discover",
    icon: <Radar className="h-6 w-6 text-accent-cyan" />,
    body: "Continuous deep-web discovery hunts for high-value founder and developer communities based on intent keywords.",
  },
  {
    name: "Score",
    icon: <Filter className="h-6 w-6 text-accent-mint" />,
    body: "Multi-layered scoring engine measures exact hiring intent, technical relevance, freshness, and post quality.",
  },
  {
    name: "Validate",
    icon: <CheckCircle2 className="h-6 w-6 text-accent-amber" />,
    body: "Proprietary AI classification aggressively strips self-promo, noise, and speculative posts before human review.",
  },
  {
    name: "Route",
    icon: <Route className="h-6 w-6 text-accent-blue" />,
    body: "Urgent enterprise matches route instantly to alerts; the rest become structured records in your private hub.",
  },
];

const systemLayers = [
  {
    title: "Discovery Engine",
    icon: <Activity className="h-5 w-5 text-slate-300" />,
    body: "Dynamically identifies and tracks candidate communities, keeping only the sources that consistently produce real signal.",
  },
  {
    title: "Monitoring Loop",
    icon: <Zap className="h-5 w-5 text-slate-300" />,
    body: "Revisits validated sources every three hours. Cleans raw streams and extracts high-confidence actionable opportunities.",
  },
  {
    title: "Private Command Center",
    icon: <Shield className="h-5 w-5 text-slate-300" />,
    body: "A secure, owner-controlled environment holding real opportunities, detailed AI scoring breakdowns, and run history.",
  },
];

const stackItems = [
  { title: "Automation core", tech: "n8n Engine", body: "Schedules, branching, and routing live in a hardened workflow.", icon: <Activity className="h-5 w-5 text-accent-cyan" /> },
  { title: "Edge delivery", tech: "Optimized Node", body: "Handles the protected entry point while keeping the self-hosted setup clean.", icon: <Zap className="h-5 w-5 text-accent-mint" /> },
  { title: "Storage layer", tech: "PostgreSQL", body: "Built from day one around structured, relational enterprise records.", icon: <Database className="h-5 w-5 text-accent-blue" /> },
  { title: "Rapid alerting", tech: "Encrypted Queues", body: "High-confidence leads bypass the dashboard for immediate action.", icon: <Radar className="h-5 w-5 text-accent-amber" /> },
];

const futureTracks = [
  "Advanced source adapters beyond standard networks",
  "Cross-platform identity deduplication via fingerprinting",
  "Dynamic source reputation and decay weighting",
  "Explainable, token-level AI score breakdowns per lead",
  "Granular access controls for trusted external collaborators",
];

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function LandingPage() {
  return (
    <div className="relative space-y-24 pb-20">
      
      {/* 
        HERO SECTION
        This acts as the high-end entrance with moving grids, orbs, and centered text
      */}
      <section className="relative flex min-h-[60vh] sm:min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-4 sm:pt-20 text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 bg-radar-grid animate-pan-grid opacity-20 pointer-events-none" />
        {/* On mobile, we use lower blur values and transform-gpu to prevent frame drops */}
        <div className="absolute left-1/4 top-1/4 z-0 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] animate-float-orb rounded-full bg-accent-cyan/15 blur-[60px] sm:blur-[120px] transform-gpu pointer-events-none" />
        <div className="absolute right-1/4 top-1/3 z-0 h-[200px] w-[200px] sm:h-[350px] sm:w-[350px] animate-float-orb-delayed rounded-full bg-accent-mint/15 blur-[50px] sm:blur-[100px] transform-gpu pointer-events-none" />
        
        {/* Content */}
        <motion.div 
          className="relative z-10 mx-auto max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-6 flex flex-col items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-accent-cyan backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan"></span>
              </span>
              Lead Discovery Engine
            </span>
            <a
              href="https://sadokportfolio.mooo.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_24px_rgba(56,189,248,0.12)]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                Built by <span className="font-bold bg-gradient-to-r from-accent-cyan to-accent-mint bg-clip-text text-transparent">sadok</span>
              </span>
            </a>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl leading-[1.15] font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Stop searching for clients. Let us <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-mint">find them for you.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-[15px] sm:text-lg leading-relaxed text-slate-300 sm:text-xl">
            A self-hosted intelligence system built for operators. We discover closed communities, validate high-intent opportunities using AI, and route the most profitable matches to a private command center.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row w-full sm:w-auto px-4 sm:px-0">
            <Link 
              href="/request-access" 
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 sm:py-4 text-[15px] sm:text-base font-semibold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Request Access
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/login" 
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-8 py-3.5 sm:py-4 text-[15px] sm:text-base font-medium text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-slate-800/50"
            >
              <Lock className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              Sign in to workspace
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 
        BENTO BOX WORKFLOW
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 sm:mb-12 text-center"
        >
          <p className="section-kicker">The Pipeline</p>
          <h2 className="section-heading mt-4">One workflow. Continuous extraction.</h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {signalStages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/5 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 hover:border-accent-cyan/30 hover:bg-white/[0.05] hover:shadow-glow-blue transform-gpu"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-white/[0.03] p-3">
                {stage.icon}
              </div>
              <h3 className="text-xl font-medium text-white">{stage.name}</h3>
              <p className="copy-muted mt-3">{stage.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 
        SYSTEM STRUCTURE 
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="rounded-[32px] sm:rounded-[40px] border border-white/10 bg-slate-950/60 p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-glow-blue sm:shadow-glow">
          {/* Subtle bg glow - removed on extreme small screens for perf */}
          <div className="hidden sm:block absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[80px] transform-gpu pointer-events-none" />
          
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="section-kicker">Architecture</p>
              <h2 className="section-heading mt-4">Built strictly for private operations.</h2>
              <p className="copy-muted mt-5 text-lg">
                The public interface exists solely to explain the engine. The protected layers are designed exclusively to isolate, analyze, and act on raw opportunity data without public exposure.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 relative z-10">
              {systemLayers.map((layer, index) => (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="flex items-start gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/15"
                >
                  <div className="mt-1 shrink-0 rounded-full bg-white/[0.05] p-2">
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{layer.title}</h3>
                    <p className="copy-muted mt-2">{layer.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        INFRASTRUCTURE & ROADMAP 
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tech Stack */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col rounded-[32px] sm:rounded-[40px] border border-white/5 bg-slate-900/30 p-6 sm:p-10"
          >
            <p className="section-kicker mb-6">Stack & Security</p>
            <div className="grid gap-4 sm:grid-cols-2 flex-grow">
              {stackItems.map((item) => (
                <div key={item.tech} className="rounded-3xl bg-slate-950/50 p-5 border border-white/[0.02]">
                  <div className="mb-4 inline-flex rounded-xl bg-white/[0.03] p-2.5">
                    {item.icon}
                  </div>
                  <h4 className="text-white font-medium">{item.title}</h4>
                  <p className="text-xs uppercase tracking-wider text-accent-cyan mt-1 mb-3">{item.tech}</p>
                  <p className="text-sm text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Roadmap */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="rounded-[32px] sm:rounded-[40px] border border-white/5 bg-slate-900/30 p-6 sm:p-10 relative overflow-hidden"
          >
            <div className="hidden sm:block absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent-blue/10 blur-[80px] transform-gpu pointer-events-none" />
            <div className="relative z-10">
              <p className="section-kicker">Evolution Track</p>
              <h2 className="text-2xl font-semibold text-white mt-4 mb-8">What we are building next</h2>
              <div className="space-y-4">
                {futureTracks.map((item, i) => (
                  <div key={i} className="group flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent-mint/30 bg-accent-mint/10 text-accent-mint group-hover:bg-accent-mint group-hover:text-slate-950 transition-colors">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        FINAL CTA 
      */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 pt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-accent-cyan/20 bg-slate-950 p-8 text-center shadow-[0_0_60px_rgba(56,189,248,0.15)] sm:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/10 to-transparent opacity-50" />
          <div className="relative z-10">
            <Lock className="mx-auto h-12 w-12 text-accent-cyan mb-6" />
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Closed intelligence.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
              Access is strictly owner-approved. Request a secure account to review leads, inspect AI scoring, and act on live signals.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link 
                href="/request-access" 
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full p-[1px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-mint to-accent-blue animate-spin-slow" />
                <span className="relative flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-slate-900">
                  Request Private Access
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
