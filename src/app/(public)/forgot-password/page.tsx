"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/actions/auth/forgot-password";
import { TransitionLink } from "@/components/layout/page-transition";
import { clsx } from "clsx";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result.success) {
      setStatus("success");
      setMessage("If an account exists with that email, a password reset link has been sent.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-xl items-center pt-8 sm:pt-0">
      <div className="panel w-full p-6 sm:p-8">
        <p className="section-kicker" data-animate>Account Recovery</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white" data-animate>Reset Password</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300" data-animate>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center" data-animate>
            <p className="text-sm text-emerald-100">{message}</p>
            <TransitionLink
              href="/login"
              className="mt-6 block w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Return to Login
            </TransitionLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" data-animate>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-300">
                Email address
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={clsx(
                    "mt-2 block w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
                    status === "error" ? "border-red-500/50 bg-red-500/10" : "border-white/10"
                  )}
                  placeholder="name@example.com"
                />
              </label>
            </div>

            {status === "error" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <TransitionLink href="/login" className="text-sm text-slate-400 hover:text-white transition">
                Back to Login
              </TransitionLink>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
