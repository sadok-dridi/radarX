"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";

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
        </label>
        {errors.password && (
          <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>
        )}
      </div>

      {serverState.status === "error" && serverState.message ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {serverState.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
