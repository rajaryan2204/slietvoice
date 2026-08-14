"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { GraduationCap, ArrowRight, Sparkles, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0f19] items-center justify-center p-6">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome to SLIETVoice
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access student complaints, opinions, and verified campus updates.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3 rounded-lg text-center">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Campus Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@college.edu"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Authenticating..." : "Sign In"}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create student account
            </Link>
          </p>
        </div>

        {/* Demo Accounts Panel */}
        <div className="mt-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 text-xs font-bold mb-2">
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            Quick Demo Login Accounts:
          </div>
          <div className="space-y-1.5 text-[11px] text-muted-foreground leading-normal">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Student:</span>{" "}
              <code>student@college.edu</code> / <code>password123</code>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Admin:</span>{" "}
              <code>admin@college.edu</code> / <code>password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
