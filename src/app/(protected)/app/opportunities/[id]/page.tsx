import { notFound } from "next/navigation";

import { opportunities } from "@/lib/mock-data";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="panel p-6">
        <p className="section-kicker">Opportunity detail</p>
        <h1 className="mt-3 text-3xl tracking-[-0.05em] text-white">{opportunity.title}</h1>
        <p className="mt-4 text-sm text-slate-400">
          {opportunity.source} · {opportunity.platform} · {opportunity.location} · {opportunity.publishedAt}
        </p>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-lg text-white">Why this lead matters</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{opportunity.summary}</p>
        </div>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-lg text-white">Reasoning</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{opportunity.reason}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="panel p-6">
          <p className="section-kicker">Signal profile</p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Score</span><strong className="text-white">{opportunity.score}</strong></div>
            <div className="flex items-center justify-between"><span>Confidence</span><strong className="text-white">{opportunity.confidence}%</strong></div>
            <div className="flex items-center justify-between"><span>Status</span><strong className="text-white">{opportunity.status}</strong></div>
            <div className="flex items-center justify-between"><span>Routing</span><strong className="text-white">{opportunity.action}</strong></div>
          </div>
        </section>
        <section className="panel p-6">
          <p className="section-kicker">Foundation note</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            This page is the shape of the future lead inspector. Real classifications, review history, and raw payload
            sections will bind here after database integration.
          </p>
        </section>
      </aside>
    </div>
  );
}
