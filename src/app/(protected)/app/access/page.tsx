import { approveAccessRequestAction, rejectAccessRequestAction } from "@/app/(protected)/app/access/actions";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { accessRequests as previewAccessRequests } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

async function getAccessPageData() {
  const db = getDb();

  if (!db) {
    return {
      mode: "preview" as const,
      pendingRequests: previewAccessRequests.filter((item) => item.status === "pending"),
      members: previewAccessRequests.filter((item) => item.status !== "pending"),
    };
  }

  const [pendingRequests, members] = await Promise.all([
    db.accessRequest.findMany({
      where: { status: "pending" },
      orderBy: { requestedAt: "desc" },
      include: { linkedUser: true },
    }),
    db.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    mode: "database" as const,
    pendingRequests,
    members,
  };
}

export default async function AccessPage() {
  const session = await getCurrentSession();
  const data = await getAccessPageData();

  if (!session || session.user.role !== "owner") {
    return (
      <div className="panel p-6">
        <p className="section-kicker">Access control</p>
        <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">Restricted</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Only the owner can approve or reject access requests. Members can use the workspace, but they cannot manage
          who enters it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="section-kicker">Access control</p>
        <h1 className="mt-2 text-3xl tracking-[-0.05em] text-white">User access</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          Approve trusted users, reject weak requests, and keep the real opportunity stream private. When the database
          is not configured, this screen falls back to preview data so the UI stays usable during development.
        </p>
        <div className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          {data.mode === "database" ? "database mode" : "preview mode"}
        </div>
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Pending requests</p>
            <h2 className="mt-2 text-2xl tracking-[-0.04em] text-white">Waiting for approval</h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
            {data.pendingRequests.length} pending
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {data.pendingRequests.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
              No pending requests right now.
            </div>
          ) : null}

          {data.pendingRequests.map((request) => (
            <article key={request.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg text-white">
                    {"displayName" in request ? request.displayName || request.email : request.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">{request.email}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {"message" in request ? request.message || "No message provided." : "Preview request item."}
                  </p>
                </div>

                {data.mode === "database" ? (
                  <div className="flex flex-wrap gap-3">
                    <form action={approveAccessRequestAction}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectAccessRequestAction}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/5"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">Preview only</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-6">
        <p className="section-kicker">Known users</p>
        <h2 className="mt-2 text-2xl tracking-[-0.04em] text-white">Accounts and status</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.members.map((member) => {
            const name = "displayName" in member ? member.displayName || member.email : member.name;
            const role = "role" in member ? member.role : member.status;
            const status = "accessStatus" in member ? member.accessStatus : member.status;

            return (
              <article key={member.id} className="rounded-[24px] border border-white/10 bg-slate-950/40 p-5">
                <h3 className="text-lg text-white">{name}</h3>
                <p className="mt-2 text-sm text-slate-400">{member.email}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em]">
                  <span className="rounded-full border border-white/10 px-3 py-2 text-slate-300">{role}</span>
                  <span className="rounded-full border border-white/10 px-3 py-2 text-slate-300">{status}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
