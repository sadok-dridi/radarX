"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import Link from "next/link";

import { loginAction, type LoginActionState } from "@/app/(public)/login/actions";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const [serverState, setServerState] = useState<LoginActionState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerState({ status: "idle" });
    try {
      const result = await loginAction(data);
      if (result?.status === "success" && result.redirectTo) {
        window.location.assign(result.redirectTo);
        return;
      }

      if (result) {
        setServerState(result);
      }
    } catch {
      setServerState({
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
      <div>
        <label className="block text-sm text-slate-300">
          Email
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="owner@example.com"
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

      <div>
        <label className="block text-sm text-slate-300">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={clsx(
            "mt-2 w-full rounded-2xl border bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-white/30",
            errors.password ? "border-red-500/50 bg-red-500/10" : "border-white/10"
          )}
        />
        <div className="mt-2 flex justify-end">
          <Link href="/forgot-password" className="text-sm text-slate-400 transition hover:text-white">
            Forgot password?
          </Link>
        </div>
        {errors.password && (
          <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>
        )}
      </div>

      {serverState.status === "error" && serverState.message ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {serverState.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 px-4 text-xs text-slate-400">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        <a
          href="/api/auth/google/login"
          className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-950/50 px-5 py-3 font-medium text-white transition hover:bg-slate-900"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>
      </div>
    </form>
  );
}
