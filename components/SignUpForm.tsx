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
    <div className="w-full max-w-md bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Create Student Account
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Register to submit grievances and participate in student voicing.
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
            Full Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Student ID
            </label>
            <input
              name="studentId"
              type="text"
              placeholder="STU-2026-XXXX"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Year of Study
            </label>
            <select
              name="year"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
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
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Department
          </label>
          <select
            name="departmentId"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
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
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            College Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="johndoe@college.edu"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Password
          </label>
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
          {isPending ? "Creating Account..." : "Sign Up"}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
