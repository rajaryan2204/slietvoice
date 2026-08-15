"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);



  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card text-card-foreground border border-slate-205 dark:border-slate-900 rounded-[8px] overflow-hidden p-6 md:p-8 shadow-none">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-[4px] flex items-center justify-center text-primary mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
            SLIETVoice Portal
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">
            &quot;Students speak. Campus listens.&quot;
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold p-3 rounded-[4px] text-center uppercase tracking-wider">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Email or Registration No.
            </label>
            <input
              name="email"
              type="text"
              placeholder="you@college.edu or 2614244"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Password
              </label>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-bold py-2.5 rounded-[4px] hover:opacity-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Authenticating..." : "Sign In"}
            {!isPending && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>



        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[11px] text-muted-foreground font-semibold">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-black hover:underline uppercase tracking-wider ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
