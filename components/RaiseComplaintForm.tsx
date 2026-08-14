"use client";

import React, { useActionState, useState } from "react";
import { raiseComplaintAction } from "@/actions/complaints";
import { MessageSquarePlus, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
}

export function RaiseComplaintForm({ departments }: { departments: Department[] }) {
  const [state, formAction, isPending] = useActionState(raiseComplaintAction, null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (state?.success) {
    return (
      <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-8 max-w-xl mx-auto shadow-md text-center">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-900/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          Complaint Submitted Successfully
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your grievance has been logged. Use the Complaint ID below to track its status.
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl mb-6">
          <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider block">
            Complaint Tracking ID
          </span>
          <span className="font-mono text-xl font-black text-primary mt-1 block">
            {state.complaintId}
          </span>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href={`/student/complaints/${state.complaintId}`}
            className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:bg-primary/95 transition-all text-sm"
          >
            Track Status
          </Link>
          <Link
            href="/student/dashboard"
            className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-5 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-sm"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 max-w-2xl mx-auto shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <MessageSquarePlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Submit a Grievance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            File a formal complaint to the respective university departments.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3 rounded-lg text-center">
            {state.error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Complaint Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g. South Mess food hygiene issues during dinner"
            required
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value="Academics">Academics</option>
              <option value="Hostel">Hostel</option>
              <option value="Mess">Mess</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Examination">Examination</option>
              <option value="Fees">Fees & Finance</option>
              <option value="Transport">Transport</option>
              <option value="Faculty">Faculty Support</option>
              <option value="IT/Internet">IT / Internet Wifi</option>
              <option value="Safety">Campus Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Target Department
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Priority
            </label>
            <select
              name="priority"
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value="LOW">Low - General Feedback</option>
              <option value="MEDIUM">Medium - Performance/Utility degradation</option>
              <option value="HIGH">High - Broken equipment/Service down</option>
              <option value="URGENT">Urgent - Safety/Health hazard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Evidence Link (Optional)
            </label>
            <input
              name="evidenceUrl"
              type="text"
              placeholder="e.g. Image URL or Shared Drive Link"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Complaint Description
          </label>
          <textarea
            name="description"
            rows={5}
            required
            placeholder="Provide a detailed description of the problem, including specific block numbers, room details, dates, and impact on students..."
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Anonymous Toggle with Alert */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">
                Submit Anonymously
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 max-w-sm">
                Your name and student ID will not be visible to staff, HODs, or department admins.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary cursor-pointer"
            />
            {/* hidden field to pass anonymous state to Server Action */}
            <input type="hidden" name="isAnonymous" value={isAnonymous ? "true" : "false"} />
          </div>

          {isAnonymous && (
            <div className="mt-3 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 text-xs p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Anonymous filings protect your identity. However, administrators will still see which department the complaint is filed from.
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/95 transition-all text-sm shadow-md shadow-primary/10 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Submitting Grievance..." : "File Complaint"}
        </button>
      </form>
    </div>
  );
}
