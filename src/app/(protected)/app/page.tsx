import { formatRelativeTime } from "@/lib/format";
import { overviewStats, opportunities, runs } from "@/lib/mock-data";
import { getDashboardOverview } from "@/lib/data/opportunities";
import { getCurrentSession } from "@/lib/auth/session";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { GsapStaggerContainer } from "@/components/layout/gsap-stagger";

export default async function DashboardHomePage() {
  const session = await getCurrentSession();
  const isOwner = session?.user.role === "owner";

  const liveOverview = await getDashboardOverview();
  const stats = liveOverview?.stats ?? overviewStats;
  const items = liveOverview?.opportunities ?? opportunities;
  const latestRuns = liveOverview?.runs ?? runs;
  const recentFailuresCount = liveOverview?.recentFailuresCount ?? 0;

  return (
    <GsapStaggerContainer>
      <div className="space-y-8">
      
        {/* 
        =========================================================
        N8N WARNING BANNER (OWNERS ONLY)
        =========================================================
      */}
        {isOwner && recentFailuresCount > 0 && (
          <div className="gsap-stagger-item opacity-0 relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.15)] flex items-start sm:items-center gap-4">
            <div className="flex-shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-200">System Warning: Workflow Failures Detected</h3>
              <p className="mt-1 text-sm text-red-300/80">
                There have been <strong className="text-red-200">{recentFailuresCount}</strong> failed n8n workflows in the last 24 hours. Please check your n8n dashboard to review the logs.
              </p>
            </div>
          </div>
        )}

      {/* 
        =========================================================
        TOP STATS GRID
        =========================================================
      */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="gsap-stagger-item opacity-0 group relative overflow-hidden rounded-2xl md:rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05] shadow-[0_0_30px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-cyan/10 blur-3xl group-hover:bg-accent-cyan/20 transition-colors" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400 relative z-10">
              {stat.label}
            </p>
            <p className="mt-3 sm:mt-5 text-2xl sm:text-4xl font-display font-bold tracking-tight text-white relative z-10">
              {stat.value}
            </p>
            <p className="mt-2 text-[10px] sm:text-xs font-medium text-slate-400 relative z-10">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* 
        =========================================================
        MAIN CONTENT COLUMNS
        =========================================================
      */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        
        {/* LEFT COLUMN: OPPORTUNITIES */}
        <div className="gsap-stagger-item opacity-0 rounded-[32px] border border-white/10 bg-white/[0.05] p-5 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
                Priority Queue
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Recent Discoveries
              </h2>
            </div>
            <Link 
              href="/app/opportunities" 
              className="inline-flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.05] hover:border-white/10 self-start sm:self-auto"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Link href={`/app/opportunities/${item.id}`} key={item.id} className="block group">
                <article className="relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.03] p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:border-white/10">
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-accent-cyan to-accent-mint opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="px-2 py-1 bg-white/[0.03] rounded-md border border-white/5">{item.source}</span>
                        <span>•</span>
                        <span>{item.location || "Global"}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="self-start inline-flex items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs font-bold text-accent-cyan whitespace-nowrap">
                      {item.confidence}% Match
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300 relative z-10 line-clamp-2">
                    {item.summary}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RUNS & STATUS */}
        <div className="space-y-6 flex flex-col">
          
          {/* RUN ACTIVITY */}
          <div className="gsap-stagger-item opacity-0 flex-1 rounded-[32px] border border-white/10 bg-white/[0.05] p-5 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
                System Log
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Active Scrapes
              </h2>
            </div>
            
            <div className="space-y-3">
              {latestRuns.map((run) => (
                <div 
                  key={run.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05] hover:border-white/10"
                >
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      {run.status}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-slate-400">
                      {formatRelativeTime(run.startedAt)} · <span className="text-slate-500">{run.duration || "Syncing..."}</span>
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300 px-3 py-1 bg-white/[0.03] rounded-lg border border-white/5 inline-block">
                      {run.itemsOut} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div className="gsap-stagger-item opacity-0 rounded-[32px] border border-white/10 bg-white/[0.05] p-5 sm:p-8 relative overflow-hidden group backdrop-blur-2xl">
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-accent-cyan/10 blur-3xl group-hover:bg-accent-cyan/20 transition-colors" />
            
            <div className="relative z-10 flex items-center gap-3 mb-4">
              <span className="h-3 w-3 rounded-full bg-accent-mint animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <h2 className="text-xl font-display font-bold text-white">Live Data Connected</h2>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-300 relative z-10">
              The neural link to the primary PostgreSQL cluster is active. Workflow runs, pipeline backlogs, and incoming opportunities are being synchronized in real-time.
            </p>
          </div>
        </div>
        
      </div>
      </div>
    </GsapStaggerContainer>
  );
}
