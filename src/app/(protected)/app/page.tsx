import { formatRelativeTime } from "@/lib/format";
import { overviewStats, opportunities, runs } from "@/lib/mock-data";
import { getDashboardOverview } from "@/lib/data/opportunities";

export default async function DashboardHomePage() {
  const liveOverview = await getDashboardOverview();
  const stats = liveOverview?.stats ?? overviewStats;
  const items = liveOverview?.opportunities ?? opportunities;
  const latestRuns = liveOverview?.runs ?? runs;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="panel p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="section-kicker">Priority queue</p>
              <h2 className="mt-2 text-2xl tracking-[-0.04em] text-white">Recent opportunities</h2>
            </div>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {item.source} · {item.location || "Unknown location"} · {formatRelativeTime(item.publishedAt)}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
                    {item.confidence}% confidence
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <p className="section-kicker">Run activity</p>
            <h2 className="mt-2 text-2xl tracking-[-0.04em] text-white">Latest executions</h2>
            <div className="mt-5 space-y-4">
              {latestRuns.map((run) => (
                <div key={run.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{run.status}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatRelativeTime(run.startedAt)} · {run.duration || "Still running"}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">{run.itemsOut} items</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <p className="section-kicker">Data status</p>
            <h2 className="mt-2 text-2xl tracking-[-0.04em] text-white">Live database view</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              This dashboard now prefers live PostgreSQL data for opportunities, source counts, AI backlog, and workflow
              runs. If the database is unavailable, it falls back to preview data so the interface stays usable.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
