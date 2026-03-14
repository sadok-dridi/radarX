import Link from "next/link";

const signalStages = [
  {
    name: "Discover",
    body: "Weekly RSS discovery hunts for new high-value communities using curated intent and niche keywords.",
  },
  {
    name: "Score",
    body: "Rules scoring measures hiring intent, pain signals, build relevance, freshness, and quality before expensive checks.",
  },
  {
    name: "Validate",
    body: "AI classification only steps in after the first pass strips noise, self-promo, and weak speculative posts.",
  },
  {
    name: "Route",
    body: "Urgent matches move to alerts while the rest become structured records inside a private operator workspace.",
  },
];

const systemLayers = [
  {
    title: "Discovery radar",
    body: "Finds candidate communities from keyword-driven Reddit searches, then keeps only the sources that continue producing signal.",
  },
  {
    title: "Monitoring radar",
    body: "Revisits validated sources every three hours, cleans raw posts, and extracts the most actionable opportunities.",
  },
  {
    title: "Private review layer",
    body: "Holds the real opportunities, score breakdowns, review actions, run history, and owner-managed access.",
  },
];

const stackItems = [
  ["Automation core", "n8n on Docker", "Schedules, scraping, branching, AI classification, and routing live in the workflow engine you already run."],
  ["Edge and delivery", "Nginx on Oracle VPS", "Handles the app entry point cleanly while keeping your self-hosted setup aligned with the rest of the stack."],
  ["Storage path", "Postgres-first direction", "Google Sheets works for transition, but the product is being shaped around structured relational records."],
  ["Alerting", "Telegram and review queue", "High-confidence results can trigger fast action without exposing the full opportunity stream publicly."],
] as const;

const futureTracks = [
  "More source adapters beyond Reddit",
  "Cross-source deduplication by fingerprint",
  "Source reputation and freshness weighting",
  "Explainable score breakdown inside each lead",
  "Owner-controlled access for trusted collaborators",
  "A dense premium dashboard instead of a generic admin panel",
];

export default function LandingPage() {
  return (
    <div className="space-y-10 pb-8">
      <section className="panel-strong relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-14">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] bg-gradient-to-l from-accent-cyan/10 via-transparent to-transparent lg:block" />
        <div className="relative">
          <p className="section-kicker">Private opportunity intelligence</p>
          <h1 className="mt-4 max-w-[12ch] text-5xl leading-none tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            Turn scattered demand into a private qualified signal stream.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Opportunity Radar is a self-hosted workflow and dashboard product for finding real opportunities faster.
            It discovers promising sources, filters noisy posts, validates employer intent, and routes the best matches
            into a private operator workspace built for action instead of browsing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-100">
              Login
            </Link>
            <Link href="/request-access" className="rounded-full border border-white/10 px-5 py-3 font-medium text-white transition hover:border-white/30 hover:bg-white/5">
              Request access
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cadence</p>
              <p className="mt-3 text-3xl font-semibold text-white">3h</p>
              <p className="mt-2 text-sm text-slate-400">Live monitoring loop for validated sources</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Routing</p>
              <p className="mt-3 text-3xl font-semibold text-white">2+</p>
              <p className="mt-2 text-sm text-slate-400">Telegram and structured review destinations</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Shape</p>
              <p className="mt-3 text-3xl font-semibold text-white">Dual</p>
              <p className="mt-2 text-sm text-slate-400">Public-safe story, private operator dashboard</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 lg:mt-0">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-5 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signal console</p>
                <h2 className="mt-2 text-2xl tracking-[-0.05em] text-white">Workflow preview</h2>
              </div>
              <div className="rounded-full border border-accent-mint/20 bg-accent-mint/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-accent-mint">
                private
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Source intake</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
                  <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-2">Reddit RSS</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Founder communities</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Job boards</span>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Qualification engine</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">Keyword and intent scoring</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">Confidence aging and source health</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">AI job validation</div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-200">Action-aware routing</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Destinations</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                    <p className="text-sm text-white">Telegram alerts</p>
                    <p className="mt-1 text-xs text-slate-400">Fast response for top matches</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                    <p className="text-sm text-white">Review workspace</p>
                    <p className="mt-1 text-xs text-slate-400">Human triage and history</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6 sm:p-8">
          <p className="section-kicker">Workflow overview</p>
          <h2 className="section-heading mt-4">One workflow, two radar loops, one private system.</h2>
          <p className="copy-muted mt-5 max-w-xl">
            The current implementation is already more than a scraper. It discovers strong communities, monitors them
            repeatedly, classifies actual opportunity intent, and prepares everything for a more serious data-backed app.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {signalStages.map((stage, index) => (
            <article key={stage.name} className="panel p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="section-kicker">Stage {index + 1}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{stage.name}</span>
              </div>
              <h3 className="mt-4 text-2xl tracking-[-0.04em] text-white">{stage.name}</h3>
              <p className="copy-muted mt-4">{stage.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="system" className="panel-strong px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="section-kicker">System structure</p>
            <h2 className="section-heading mt-4">Designed as a private operations surface, not a public feed.</h2>
            <p className="copy-muted mt-5 max-w-xl">
              The landing page exists to explain the machine. The protected app exists to work with real opportunities.
              That boundary is part of the product design, not a temporary decision.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {systemLayers.map((layer) => (
              <article key={layer.title} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-xl text-white">{layer.title}</h3>
                <p className="copy-muted mt-3">{layer.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6 sm:p-8">
          <p className="section-kicker">Infrastructure</p>
          <h2 className="section-heading mt-4">Built around the stack you already run.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stackItems.map(([eyebrow, title, body]) => (
              <article key={title} className="rounded-[24px] border border-white/10 bg-slate-950/45 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
                <h3 className="mt-3 text-xl text-white">{title}</h3>
                <p className="copy-muted mt-3">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="roadmap" className="panel p-6 sm:p-8">
          <p className="section-kicker">Roadmap</p>
          <h2 className="section-heading mt-4">Built for the next layer, not just the current feed.</h2>
          <p className="copy-muted mt-5">
            The Reddit workflow is version one of the source engine. The real target is a normalized intelligence system
            where new adapters can plug in without changing how the dashboard thinks.
          </p>
          <div className="mt-6 space-y-3">
            {futureTracks.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-200">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-accent-mint" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel-strong overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-kicker">Access model</p>
            <h2 className="section-heading mt-4">Open homepage. Closed intelligence layer.</h2>
            <p className="copy-muted mt-5 max-w-2xl">
              The experience stays visible, but the opportunities stay private. Approved users can log in, review leads,
              inspect scoring, and monitor runs. Everyone else only sees the system story and request path.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link href="/login" className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-100">
              Enter workspace
            </Link>
            <Link href="/request-access" className="rounded-full border border-white/10 px-5 py-3 font-medium text-white transition hover:border-white/30 hover:bg-white/5">
              Request access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
