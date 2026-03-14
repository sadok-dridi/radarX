import { sources } from "@/lib/mock-data";

export default function SourcesPage() {
  return (
    <div className="panel p-6">
      <p className="section-kicker">Source management</p>
      <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Sources</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((source) => (
          <article key={source.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl text-white">{source.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{source.state} · {source.monitoringMode}</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-2 text-sm text-white">
                {source.confidence}%
              </div>
            </div>
            <div className="mt-5 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Last seen</span><span>{source.lastSeen}</span></div>
              <div className="mt-2 flex items-center justify-between"><span>Last run</span><span>{source.lastRun}</span></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
