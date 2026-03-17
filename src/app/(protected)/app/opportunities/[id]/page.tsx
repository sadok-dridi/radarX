import { notFound } from "next/navigation";

import { getOpportunityDetail } from "@/lib/data/opportunities";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { opportunities } from "@/lib/mock-data";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const liveDetail = await getOpportunityDetail(id);

  const opportunity = liveDetail?.opportunity ?? opportunities.find((item) => item.id === id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel p-6">
        <p className="section-kicker">Opportunity detail</p>
        <h1 className="mt-3 text-3xl tracking-[-0.05em] text-white">{opportunity.title}</h1>
        <p className="mt-4 text-sm text-slate-400">
          {opportunity.source} · {opportunity.platform} · {opportunity.location || "Unknown location"} · {formatRelativeTime(opportunity.publishedAt)}
        </p>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-lg text-white">Why this lead matters</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{opportunity.summary}</p>
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-lg text-white">Reasoning</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{opportunity.reason || "No AI reasoning stored yet."}</p>
        </div>

        {liveDetail?.classifications?.length ? (
          <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <h2 className="text-lg text-white">Classification history</h2>
            <div className="mt-4 space-y-4">
              {liveDetail.classifications.map((classification) => (
                <article key={classification.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <span>{classification.provider || "provider unknown"}</span>
                    <span>{classification.modelName || "model unknown"}</span>
                    <span>{classification.verdict || "no verdict"}</span>
                    <span>{classification.confidence ?? 0}%</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{classification.reason || "No reason provided."}</p>
                  <p className="mt-3 text-xs text-slate-500">{formatDateTime(classification.createdAt)}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <aside className="space-y-6">
        <section className="panel p-6">
          <p className="section-kicker">Signal profile</p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Score</span><strong className="text-white">{opportunity.score}</strong></div>
            <div className="flex items-center justify-between"><span>Confidence</span><strong className="text-white">{opportunity.confidence}%</strong></div>
            <div className="flex items-center justify-between"><span>Status</span><strong className="text-white">{opportunity.status}</strong></div>
            <div className="flex items-center justify-between"><span>Routing</span><strong className="text-white">{opportunity.action}</strong></div>
            {"authorName" in opportunity ? (
              <div className="flex items-center justify-between"><span>Author</span><strong className="text-white">{opportunity.authorName || "Unknown"}</strong></div>
            ) : null}
            {"intent" in opportunity ? (
              <div className="flex items-center justify-between"><span>Intent</span><strong className="text-white">{opportunity.intent || "Unknown"}</strong></div>
            ) : null}
          </div>
        </section>
        <section className="panel p-6">
          <p className="section-kicker">Timeline</p>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-300">
            <p>Published: {formatDateTime(opportunity.publishedAt)}</p>
            {"createdAt" in opportunity ? <p>First seen: {formatDateTime(opportunity.createdAt)}</p> : null}
            {"updatedAt" in opportunity ? <p>Last updated: {formatDateTime(opportunity.updatedAt)}</p> : null}
          </div>
        </section>
      </aside>
    </div>
  );
}
