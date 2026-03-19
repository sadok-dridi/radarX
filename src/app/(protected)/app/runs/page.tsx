import { runs } from "@/lib/mock-data";

export default function RunsPage() {
  return (
    <div className="panel p-6">
      <p className="section-kicker">Workflow observability</p>
      <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Runs</h1>
      <div className="mt-6 space-y-4">
        {runs.map((run) => (
          <article key={run.id} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg text-white">{run.name}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {run.trigger} · started at {run.startedAt} · duration {run.duration}
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">{run.status}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
