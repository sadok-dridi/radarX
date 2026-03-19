import { notFound } from "next/navigation";

import { getOpportunityDetail } from "@/lib/data/opportunities";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { opportunities } from "@/lib/mock-data";
import { ReviewActions } from "./review-actions";
import Link from "next/link";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const liveDetail = await getOpportunityDetail(id);

  const opportunity = liveDetail?.opportunity ?? opportunities.find((item) => item.id === id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <Link href="/app/opportunities" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-accent-cyan transition-colors mb-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Stream
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">
              Opportunity Detail
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight drop-shadow-md">
              {opportunity.title}
            </h1>
            
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-slate-400">
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white">{opportunity.source}</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">{opportunity.platform}</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">{opportunity.location || "Unknown location"}</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-accent-cyan">{formatRelativeTime(opportunity.publishedAt)}</span>
            </div>

            <div className="mt-10 space-y-8">
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-cyan to-transparent rounded-full" />
                <div className="pl-6">
                  <h2 className="text-xl font-display font-bold text-white mb-3">Why this lead matters</h2>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300">{opportunity.summary}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-mint to-transparent rounded-full" />
                <div className="pl-6">
                  <h2 className="text-xl font-display font-bold text-white mb-3">AI Reasoning</h2>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300">{opportunity.reason || "No AI reasoning stored yet."}</p>
                </div>
              </div>
            </div>

            {liveDetail?.classifications?.length ? (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-xl font-display font-bold text-white mb-6">Classification History</h2>
                <div className="space-y-4">
                  {liveDetail.classifications.map((classification) => (
                    <article key={classification.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:border-white/10 transition-colors">
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        <span className="px-2 py-1 bg-white/[0.03] rounded">{classification.provider || "provider unknown"}</span>
                        <span className="px-2 py-1 bg-white/[0.03] rounded">{classification.modelName || "model unknown"}</span>
                        <span className="px-2 py-1 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 rounded">{classification.verdict || "no verdict"}</span>
                        <span className="px-2 py-1 bg-accent-mint/10 text-accent-mint border border-accent-mint/20 rounded">{classification.confidence ?? 0}% confidence</span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">{classification.reason || "No reason provided."}</p>
                      <p className="mt-4 text-xs font-mono text-slate-500">{formatDateTime(classification.createdAt)}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-6 flex flex-col">
          <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-8 backdrop-blur-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Signal Profile</p>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 font-medium">Score</span>
                <strong className="text-xl font-display text-white">{opportunity.score}</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
                <span className="text-accent-cyan font-medium">Confidence</span>
                <strong className="text-xl font-display text-accent-cyan">{opportunity.confidence}%</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 font-medium">Status</span>
                <strong className="uppercase tracking-wider text-[10px] px-2 py-1 bg-slate-800 rounded text-white">{opportunity.status}</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 font-medium">Routing</span>
                <strong className="text-white">{opportunity.action}</strong>
              </div>
              {"authorName" in opportunity ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 font-medium">Author</span>
                  <strong className="text-white truncate max-w-[150px]">{opportunity.authorName || "Unknown"}</strong>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-8 backdrop-blur-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Timeline</p>
            <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Published</p>
                <p className="text-sm font-medium text-white">{formatDateTime(opportunity.publishedAt)}</p>
              </div>
              {"createdAt" in opportunity ? (
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent-mint shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">First Seen</p>
                  <p className="text-sm font-medium text-white">{formatDateTime(opportunity.createdAt)}</p>
                </div>
              ) : null}
              {"updatedAt" in opportunity ? (
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-white/[0.05]" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Last Updated</p>
                  <p className="text-sm font-medium text-slate-300">{formatDateTime(opportunity.updatedAt)}</p>
                </div>
              ) : null}
            </div>
          </section>
        </aside>

        <div className="col-span-full mt-4">
          <ReviewActions opportunityId={opportunity.id} currentStatus={opportunity.status} />

          {liveDetail?.reviews?.length ? (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-display font-bold text-white mb-6">Audit Log</h3>
              {liveDetail.reviews.map((review) => (
                <article key={review.id} className="relative overflow-hidden rounded-[24px] border border-white/5 bg-white/[0.03] p-5 sm:p-6 transition-colors hover:bg-white/[0.05]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
                        {(review.userName?.[0] || "?").toUpperCase()}
                      </div>
                      <h3 className="text-sm font-bold text-white">{review.userName || "System"}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(review.createdAt)}</span>
                  </div>
                  <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{review.fromStatus}</span>
                    <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="text-accent-cyan">{review.toStatus}</span>
                  </div>
                  {review.note && (
                    <p className="text-sm leading-relaxed text-slate-300 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                      {review.note}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
