"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/actions/auth";
import { GraduationCap, ArrowRight } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

export function SignUpForm({ departments }: { departments: Department[] }) {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="w-full max-w-md bg-card text-card-foreground border border-slate-205 dark:border-slate-900 rounded-[8px] p-6 md:p-8 shadow-none">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-10 h-10 bg-primary/10 rounded-[4px] flex items-center justify-center text-primary mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-black uppercase tracking-tight text-slate-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">
          Register to join the student voice portal
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
            Full Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Registration No.
            </label>
            <input
              name="studentId"
              type="text"
              pattern="\d*"
              inputMode="numeric"
              placeholder="e.g. 2614244"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Year of Study
            </label>
            <select
              name="year"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Department
          </label>
          <select
            name="departmentId"
            required
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            College Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="johndoe@college.edu"
            required
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Password
          </label>
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
          {isPending ? "Creating Account..." : "Sign Up"}
          {!isPending && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <p className="text-[11px] text-muted-foreground font-semibold">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-black hover:underline uppercase tracking-wider ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
