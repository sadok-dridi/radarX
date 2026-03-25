"use client";

import { useState, Suspense } from "react";
import { resetPasswordAction } from "@/actions/auth/reset-password";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <p className="text-sm text-red-200">Invalid or missing reset token.</p>
        <Link
          href="/forgot-password"
          className="mt-6 block w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    const result = await resetPasswordAction(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else if (result.success) {
      setStatus("success");
      setMessage("Your password has been successfully reset. You can now log in.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <p className="text-sm text-emerald-100">{message}</p>
        <Link
          href="/login"
          className="mt-6 block w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm text-slate-300">
          New Password
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className={clsx(
              "mt-2 block w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              status === "error" ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
            placeholder="••••••••"
          />
        </label>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-slate-300">
          Confirm Password
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className={clsx(
              "mt-2 block w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              status === "error" ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
            placeholder="••••••••"
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
        {status === "loading" ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center pt-8 sm:pt-0">
      <div className="panel w-full p-6 sm:p-8">
        <p className="section-kicker">Account Recovery</p>
        <h1 className="mt-4 text-4xl tracking-[-0.05em] text-white">Create New Password</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Please enter your new password below.
        </p>
        
        <Suspense fallback={<div className="mt-8 text-center text-slate-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
