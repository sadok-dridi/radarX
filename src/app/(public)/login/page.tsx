import { TransitionLink } from "@/components/layout/page-transition";
import { redirect } from "next/navigation";

import { LoginForm } from "./(components)/login-form";
import { getCurrentSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getCurrentSession({ allowDevBypass: false });
  const params = await searchParams;
  const error = params.error;

  if (session) {
    redirect("/app");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-xl items-center pt-8 sm:pt-0">
      <div className="panel w-full p-6 sm:p-8">
        <p className="section-kicker" data-animate>Private access</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white" data-animate>Login</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300" data-animate>
          Approved users can sign into the private workspace here. If your account is still pending, login will stay
          blocked until the owner approves your request.
        </p>

        {error === "AccountPending" && (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-medium">Account pending approval</p>
            <p className="mt-1 text-slate-300">
              Your account has been created but needs to be approved by the workspace owner before you can log in.
              Please wait for approval.
            </p>
          </div>
        )}

        {error === "GoogleAuthFailed" && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p className="font-medium">Google Authentication Failed</p>
            <p className="mt-1 text-slate-300">
              There was a problem signing in with Google. Please try again.
            </p>
          </div>
        )}

        {error === "TooManyAttempts" && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p className="font-medium">Too many attempts</p>
            <p className="mt-1 text-slate-300">
              Please wait a moment before trying again.
            </p>
          </div>
        )}

        <div data-animate>
          <LoginForm />
        </div>
        <p className="mt-5 text-sm text-slate-400" data-animate>
          Need access?{" "}
          <TransitionLink href="/request-access" className="text-white transition hover:text-accent-cyan">
            Request access
          </TransitionLink>
        </p>
      </div>
    </div>
  );
}
