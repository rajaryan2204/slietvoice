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
  const [evidenceFile, setEvidenceFile] = useState<{ name: string; size: string; preview: string } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const previewUrl = URL.createObjectURL(file);
      setEvidenceFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        preview: file.type.startsWith("image/") ? previewUrl : ""
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setEvidenceFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        preview: file.type.startsWith("image/") ? previewUrl : ""
      });
    }
  };

  const clearFile = () => {
    setEvidenceFile(null);
  };

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
    <div className="max-w-2xl mx-auto">
      {/* Editorial Title */}
      <div className="border-b-2 border-foreground dark:border-border pb-6 mb-6">
        <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white uppercase tracking-tight">
          RAISE A CONCERN
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
          &quot;Tell us what is happening. We&apos;ll make sure it reaches the right people.&quot;
        </p>
      </div>

      {/* Stepper progress indicator */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 border-b border-border pb-6 mb-6 text-[10px] font-mono text-muted-foreground uppercase">
        <span className="font-bold text-teal-700 dark:text-teal-400">01 Tell us about it.</span>
        <span className="text-slate-300">&rarr;</span>
        <span className="font-bold text-slate-600 dark:text-slate-400">02 Location</span>
        <span className="text-slate-300">&rarr;</span>
        <span className="font-bold text-slate-600 dark:text-slate-400">03 Details</span>
        <span className="text-slate-300">&rarr;</span>
        <span className="font-bold text-slate-600 dark:text-slate-400">04 Evidence</span>
        <span className="text-slate-300">&rarr;</span>
        <span className="font-bold text-slate-600 dark:text-slate-400">05 Submit</span>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-[4px] text-center uppercase tracking-wider">
            {state.error}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Complaint Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g. South Mess food hygiene issues during dinner"
            required
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Target Department
            </label>
            <select
              name="departmentId"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Priority
            </label>
            <select
              name="priority"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="LOW">Low - General Feedback</option>
              <option value="MEDIUM">Medium - Performance/Utility degradation</option>
              <option value="HIGH">High - Broken equipment/Service down</option>
              <option value="URGENT">Urgent - Safety/Health hazard</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Evidence Files / Photo (Optional)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border border-dashed rounded-[4px] p-3.5 text-center transition-all duration-200 relative flex flex-col items-center justify-center min-h-[92px] ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/20"
              }`}
            >
              {evidenceFile ? (
                <div className="flex items-center gap-3 w-full text-left">
                  {evidenceFile.preview ? (
                    <img src={evidenceFile.preview} alt="preview" className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-800" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold">PDF</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{evidenceFile.name}</p>
                    <p className="text-[10px] text-muted-foreground">{evidenceFile.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-[10px] font-bold text-rose-500 hover:underline px-2 py-1 rounded hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-605 dark:text-slate-400 font-semibold mb-0.5">
                    Drag & drop files or <span className="text-primary hover:underline cursor-pointer">browse</span>
                  </p>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500">Supports JPG, PNG, PDF (max 5MB)</p>
                </>
              )}
              <input
                type="file"
                name="evidenceFile"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <input
                type="hidden"
                name="evidenceUrl"
                value={evidenceFile ? `Uploaded: ${evidenceFile.name}` : ""}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Complaint Description
          </label>
          <textarea
            name="description"
            rows={5}
            required
            placeholder="Provide a detailed description of the problem, including specific block numbers, room details, dates, and impact on students..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Anonymous Toggle with Alert */}
        <div className="border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-4 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
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
              className="w-5 h-5 text-primary bg-slate-100 border-slate-350 rounded focus:ring-primary cursor-pointer"
            />
            {/* hidden field to pass anonymous state to Server Action */}
            <input type="hidden" name="isAnonymous" value={isAnonymous ? "true" : "false"} />
          </div>

          {isAnonymous && (
            <div className="mt-3 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400 text-xs p-3 rounded-[4px] border border-yellow-100 dark:border-yellow-900/30">
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
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-[4px] hover:opacity-95 transition-all text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Submitting Grievance..." : "File Complaint"}
        </button>
      </form>
    </div>
  );
}
