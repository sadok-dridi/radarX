import { formatRelativeTime } from "@/lib/format";
import { overviewStats, opportunities, runs } from "@/lib/mock-data";
import { getDashboardOverview } from "@/lib/data/opportunities";
import Link from "next/link";

export default async function DashboardHomePage() {
  const liveOverview = await getDashboardOverview();
  const stats = liveOverview?.stats ?? overviewStats;
  const items = liveOverview?.opportunities ?? opportunities;
  const latestRuns = liveOverview?.runs ?? runs;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 
        =========================================================
        TOP STATS GRID
        =========================================================
      */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
          <article 
            key={stat.label} 
            className="group relative overflow-hidden rounded-2xl md:rounded-[28px] border border-accent-purple/30 bg-slate-950/70 p-4 sm:p-6 shadow-glow backdrop-blur-3xl transition-all hover:-translate-y-1 hover:border-accent-cyan/50 hover:shadow-glow-blue"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-cyan/10 blur-3xl group-hover:bg-accent-cyan/20 transition-colors" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400 relative z-10">
              {stat.label}
            </p>
            <p className="mt-3 sm:mt-5 text-2xl sm:text-4xl font-display font-bold tracking-tight text-white relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              {stat.value}
            </p>
            <p className="mt-2 text-[10px] sm:text-xs font-medium text-accent-mint/90 relative z-10">
              {stat.detail}
            </p>
          </article>
        ))}
      </section>

      {/* 
        =========================================================
        MAIN CONTENT COLUMNS
        =========================================================
      */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        
        {/* LEFT COLUMN: OPPORTUNITIES */}
        <div className="rounded-[32px] border border-accent-purple/20 bg-slate-900/40 p-5 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(147,51,234,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-accent-purple via-transparent to-transparent opacity-30" />
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-mint mb-1">
                Priority Queue
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-md">
                Recent Discoveries
              </h2>
            </div>
            <Link 
              href="/app/opportunities" 
              className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-purple/20 hover:border-accent-purple/40 hover:shadow-glow-blue self-start sm:self-auto"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Link href={`/app/opportunities/${item.id}`} key={item.id} className="block group">
                <article className="relative overflow-hidden rounded-[24px] border border-accent-purple/20 bg-slate-950/80 p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:border-accent-cyan/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]">
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="px-2 py-1 bg-white/5 rounded-md border border-white/5">{item.source}</span>
                        <span>•</span>
                        <span>{item.location || "Global"}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="self-start inline-flex items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs font-bold text-accent-cyan shadow-[0_0_15px_rgba(56,189,248,0.2)] whitespace-nowrap">
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
          <section className="flex-1 rounded-[32px] border border-accent-blue/20 bg-slate-900/40 p-5 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.05)] relative overflow-hidden">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-blue bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-cyan mb-1">
                System Log
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-md">
                Active Scrapes
              </h2>
            </div>
            
            <div className="space-y-3">
              {latestRuns.map((run) => (
                <div 
                  key={run.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border border-white/5 bg-slate-950/60 p-4 transition-all hover:bg-slate-950/90 hover:border-accent-blue/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                >
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2 text-sm">
                      <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      {run.status}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-slate-400">
                      {formatRelativeTime(run.startedAt)} · <span className="text-slate-500">{run.duration || "Syncing..."}</span>
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent-blue px-3 py-1 bg-accent-blue/10 rounded-lg border border-accent-blue/20 inline-block">
                      {run.itemsOut} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SYSTEM STATUS */}
          <section className="rounded-[32px] border border-accent-purple/30 bg-slate-950/80 p-5 sm:p-8 relative overflow-hidden shadow-glow group">
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl group-hover:bg-accent-purple/30 transition-colors" />
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-accent-cyan/10 blur-3xl" />
            
            <div className="relative z-10 flex items-center gap-3 mb-4">
              <span className="h-3 w-3 rounded-full bg-accent-mint animate-pulse shadow-glow" />
              <h2 className="text-xl font-display font-bold text-white">Live Data Connected</h2>
            </div>
            
            <p className="text-sm leading-relaxed text-slate-300 relative z-10">
              The neural link to the primary PostgreSQL cluster is active. Workflow runs, pipeline backlogs, and incoming opportunities are being synchronized in real-time.
            </p>
          </section>
        </div>
        
      </section>
    </div>
  );
}
