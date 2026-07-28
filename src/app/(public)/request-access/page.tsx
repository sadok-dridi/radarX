import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";
import { RequestAccessForm } from "./(components)/request-access-form";

export const dynamic = "force-dynamic";

export default async function RequestAccessPage() {
  const session = await getCurrentSession({ allowDevBypass: false });

  if (session) {
    redirect("/app");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-2xl items-center pt-8 sm:pt-0">
      <div className="panel w-full p-6 sm:p-8">
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-cyan-400" data-animate>Request access</h1>
        <div data-animate>
          <RequestAccessForm />
        </div>
      </div>
    </div>
  );
}
