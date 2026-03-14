"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { requestAccessAction } from "@/app/(public)/request-access/actions";

const initialState = {
  status: "idle" as const,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Submitting..." : "Submit request"}
    </button>
  );
}

export function RequestAccessForm() {
  const [state, formAction] = useActionState(requestAccessAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4 md:grid-cols-2">
      <label className="block text-sm text-slate-300 md:col-span-1">
        Name
        <input
          name="displayName"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30"
        />
      </label>
      <label className="block text-sm text-slate-300 md:col-span-1">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30"
        />
      </label>
      <label className="block text-sm text-slate-300 md:col-span-1">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Create a password"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30"
        />
      </label>
      <label className="block text-sm text-slate-300 md:col-span-1">
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repeat your password"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30"
        />
      </label>
      <label className="block text-sm text-slate-300 md:col-span-2">
        Why do you need access?
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Briefly explain how you will use the dashboard."
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30"
        />
      </label>

      {state.status !== "idle" && state.message ? (
        <div
          className={`md:col-span-2 rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "border border-accent-mint/20 bg-accent-mint/10 text-accent-mint"
              : "border border-amber-400/20 bg-amber-400/10 text-amber-100"
          }`}
        >
          {state.message}
          {state.status === "success" ? (
            <span className="mt-2 block text-slate-200">
              If your account is approved, you will be able to sign in from the <Link href="/login" className="underline">login page</Link>.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="md:col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
