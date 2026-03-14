import Link from "next/link";

import { logoutAction } from "@/lib/auth/actions";
import { appNavigation } from "@/lib/navigation";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "owner" | "member";
  };
};

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#06111a] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              <span className="h-3 w-3 rounded-full bg-gradient-to-br from-accent-amber to-accent-cyan" />
              Opportunity Radar
            </div>
            <p className="text-sm text-slate-400">Private operator workspace</p>
          </div>

          <nav className="space-y-2">
            {appNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-mint">Preview mode</p>
            <p className="mt-3 text-sm text-slate-300">
              App routes are unlocked through `DEV_AUTH_BYPASS` until the real auth flow is wired.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="mb-6 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-glow backdrop-blur-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent-mint">Control room</p>
                <h1 className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">Operator Dashboard</h1>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                  <div className="font-medium text-white">{user.name}</div>
                  <div>{user.email}</div>
                  <div className="mt-1 uppercase tracking-[0.18em] text-slate-500">{user.role}</div>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-white/10 px-4 py-3 text-sm text-white transition hover:border-white/30 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
