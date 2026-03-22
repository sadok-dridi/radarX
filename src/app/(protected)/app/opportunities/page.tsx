import Link from "next/link";

import { getOpportunitiesList } from "@/lib/data/opportunities";
import { formatRelativeTime } from "@/lib/format";
import { opportunities as mockOpportunities } from "@/lib/mock-data";
import { OpportunitiesFilters } from "./filters";
import { Pagination } from "./pagination";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;
  const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";
  const field = typeof resolvedParams.field === "string" ? resolvedParams.field : undefined;
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;

  const liveOpportunities = await getOpportunitiesList({ search: q, status, sort, field, page, limit: 12 });
  
  const items = liveOpportunities?.items ?? mockOpportunities;
  const totalPages = liveOpportunities?.totalPages ?? 1;

  const queryParams = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v));
      } else {
        queryParams.set(key, value);
      }
    }
  });
  const queryString = queryParams.toString();
  const searchSuffix = queryString ? `?${queryString}` : "";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-mint mb-2">
            Opportunity Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Intel Stream
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
            Live opportunity stream from PostgreSQL. Monitor, filter, and act on global signals in real-time.
          </p>
        </div>
      </div>

      <OpportunitiesFilters />

      {/* MOBILE & DESKTOP CARD GRID */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link href={`/app/opportunities/${item.id}${searchSuffix}`} key={item.id} className="group block h-full">
            <article className="h-full flex flex-col relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05] shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-3xl rounded-full group-hover:bg-accent-cyan/15 transition-colors" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/10 bg-white/[0.03] text-slate-300 max-w-max">
                    {item.source}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                    {formatRelativeTime(item.publishedAt)}
                  </span>
                </div>
                
                {/* Status badge */}
                <div className={`
                  px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border
                  ${item.status === 'new' ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan' : 
                    item.status === 'qualified' ? 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint' : 
                    'border-slate-700 bg-slate-800/50 text-slate-300'}
                `}>
                  {item.status}
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors relative z-10">
                {item.title}
              </h2>
              
              <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 relative z-10">
                {item.summary}
              </p>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Score</p>
                    <p className="font-mono font-bold text-white">{item.score}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Confidence</p>
                    <p className="font-mono font-bold text-accent-mint">{item.confidence}%</p>
                  </div>
                </div>
                
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03] group-hover:bg-accent-cyan group-hover:border-accent-cyan group-hover:text-ink transition-all text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[24px] bg-white/[0.03]">
            <span className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <p className="text-lg font-medium text-white mb-2">No signals found</p>
            <p className="text-sm text-slate-400">Adjust your filters or search query to see more results.</p>
          </div>
        )}
      </div>

      <Pagination totalPages={totalPages} currentPage={page} />
    </div>
  );
}
