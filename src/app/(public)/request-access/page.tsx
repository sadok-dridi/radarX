import { redirect } from "next/navigation";

import { RequestAccessForm } from "@/components/auth/request-access-form";
import { getCurrentSession } from "@/lib/auth/session";

export default async function RequestAccessPage() {
  const session = await getCurrentSession({ allowDevBypass: false });

  if (session) {
    redirect("/app");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center">
      <div className="panel w-full p-8">
        <p className="section-kicker">Invite-only flow</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white">Request access</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Access is owner-approved. Submitting this form creates a private account request that stays pending until the
          owner approves it. If this is the first system account and your email matches `OWNER_BOOTSTRAP_EMAIL`, it can
          bootstrap the owner account automatically.
        </p>
        <RequestAccessForm />
      </div>
    </div>
  );
}
