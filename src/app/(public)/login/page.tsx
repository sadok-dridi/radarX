import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getCurrentSession({ allowDevBypass: false });

  if (session) {
    redirect("/app");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center">
      <div className="panel w-full p-8">
        <p className="section-kicker">Private access</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white">Login</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Approved users can sign into the private workspace here. If your account is still pending, login will stay
          blocked until the owner approves your request.
        </p>
        <LoginForm />
        <p className="mt-5 text-sm text-slate-400">
          Need access?{" "}
          <Link href="/request-access" className="text-white transition hover:text-accent-cyan">
            Request access
          </Link>
        </p>
      </div>
    </div>
  );
}
