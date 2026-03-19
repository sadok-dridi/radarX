"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";

import { requestAccessAction, type RequestAccessActionState } from "@/app/(public)/request-access/actions";
import { requestAccessSchema, type RequestAccessInput } from "@/lib/validations/auth";

export function RequestAccessForm() {
  const [serverState, setServerState] = useState<RequestAccessActionState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestAccessInput>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RequestAccessInput) => {
    setServerState({ status: "idle" });
    try {
      const result = await requestAccessAction(data);
      setServerState(result);
    } catch {
      setServerState({
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="md:col-span-1">
        <label className="block text-sm text-slate-300">
          Name
          <input
            {...register("displayName")}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={clsx(
              "mt-2 w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              errors.displayName ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
          />
        </label>
        {errors.displayName && (
          <span className="mt-1 block text-xs text-red-400">{errors.displayName.message}</span>
        )}
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm text-slate-300">
          Email
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={clsx(
              "mt-2 w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              errors.email ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
          />
        </label>
        {errors.email && (
          <span className="mt-1 block text-xs text-red-400">{errors.email.message}</span>
        )}
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm text-slate-300">
          Password
          <input
            {...register("password")}
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            className={clsx(
              "mt-2 w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              errors.password ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
          />
        </label>
        {errors.password && (
          <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>
        )}
      </div>

      <div className="md:col-span-1">
        <label className="block text-sm text-slate-300">
          Confirm password
          <input
            {...register("confirmPassword")}
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            className={clsx(
              "mt-2 w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
              errors.confirmPassword ? "border-red-500/50 bg-red-500/10" : "border-white/10"
            )}
          />
        </label>
        {errors.confirmPassword && (
          <span className="mt-1 block text-xs text-red-400">{errors.confirmPassword.message}</span>
        )}
      </div>

      {serverState.status !== "idle" && serverState.message ? (
        <div
          className={clsx(
            "md:col-span-2 rounded-2xl px-4 py-3 text-sm border",
            serverState.status === "success"
              ? "border-accent-mint/20 bg-accent-mint/10 text-accent-mint"
              : "border-amber-400/20 bg-amber-400/10 text-amber-100"
          )}
        >
          {serverState.message}
          {serverState.status === "success" ? (
            <span className="mt-2 block text-slate-200">
              If your account is approved, you will be able to sign in from the <Link href="/login" className="underline">login page</Link>.
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting || serverState.status === "success"}
          className="rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit request"}
        </button>
      </div>
    </form>
  );
}
