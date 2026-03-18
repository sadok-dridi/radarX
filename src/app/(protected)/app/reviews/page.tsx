import Link from "next/link";
import { getReviewsList } from "@/lib/data/opportunities";
import { formatRelativeTime } from "@/lib/format";

export default async function ReviewsPage() {
  const liveReviews = await getReviewsList();
  const items = liveReviews ?? [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-mint mb-2">
          Audit Trail
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Review Log
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Historical record of operator actions, status changes, and workflow notes.
        </p>
      </div>
      
      {items.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-white/10 bg-slate-950/40 p-12 text-center backdrop-blur-xl">
          <span className="h-12 w-12 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <p className="text-lg font-medium text-white mb-2">No review activity</p>
          <p className="text-sm text-slate-400">Operator notes and status changes will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {items.map((review) => (
            <article key={review.id} className="relative overflow-hidden rounded-[24px] border border-accent-purple/20 bg-slate-950/60 p-5 sm:p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-accent-cyan/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] group">
              <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-accent-cyan to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <Link 
                  href={`/app/opportunities/${review.opportunityId}`}
                  className="text-lg font-bold text-white hover:text-accent-cyan transition-colors line-clamp-1 flex-1 relative z-10"
                >
                  {review.opportunityTitle || "Unknown opportunity"}
                </Link>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-mono whitespace-nowrap self-start sm:self-auto relative z-10">
                  {formatRelativeTime(review.createdAt)}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-accent-purple/20 border border-accent-purple/50 flex items-center justify-center text-[10px] font-bold text-accent-cyan">
                    {(review.userName?.[0] || "?").toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{review.userName || "System"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{review.fromStatus}</span>
                  <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-accent-cyan">{review.toStatus}</span>
                </div>
              </div>

              {review.note && (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 relative z-10">
                  <p className="text-sm leading-relaxed text-slate-300 relative z-10">
                    "{review.note}"
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
