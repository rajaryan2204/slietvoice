"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "972204558231-dummyid.apps.googleusercontent.com";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://slietvoice.in";
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
    `${siteUrl}/api/auth/google/callback`
  )}&response_type=code&scope=openid%20email%20profile`;

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
              Campus Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@college.edu"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
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
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
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

        {/* Google Sign In Divider & Button */}
        <div className="relative my-5 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800/80" />
          </div>
          <span className="relative bg-card px-2 text-muted-foreground uppercase font-bold tracking-widest text-[9px]">
            Or continue with
          </span>
        </div>

        <a
          href={googleAuthUrl}
          className="w-full flex items-center justify-center gap-2 bg-transparent border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-[4px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-xs uppercase tracking-widest cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </a>

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
