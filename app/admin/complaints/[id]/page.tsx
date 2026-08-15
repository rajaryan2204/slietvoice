import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ComplaintTimeline } from "@/components/ComplaintTimeline";
import {
  updateComplaintStatusAction,
  assignComplaintAction,
  escalateComplaintAction,
} from "@/actions/complaints";
import Link from "next/link";
import {
  Calendar,
  Building,
  Tag,
  FileText,
  ArrowLeft,
  User,
  AlertOctagon,
  Wrench,
} from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return null;

  const { id } = await params;

  // Fetch complaint with all updates (including internal notes for admins!)
  const complaint = await db.complaint.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true } },
      evidence: true,
      updates: {
        include: {
          author: { select: { name: true, role: true } },
        },
      },
      escalations: {
        orderBy: { escalatedAt: "desc" },
      },
    },
  });

  if (!complaint) {
    notFound();
  }

  const departments = await db.department.findMany({ orderBy: { name: "asc" } });

  let deptName = "Unassigned / General Triage";
  if (complaint.departmentId) {
    const dept = departments.find((d) => d.id === complaint.departmentId);
    if (dept) deptName = dept.name;
  }

  // Server Action Wrappers
  const handleUpdateStatus = async (formData: FormData) => {
    "use server";
    const status = formData.get("status") as string;
    const message = formData.get("message") as string;
    const isInternal = formData.get("isInternal") === "true";
    await updateComplaintStatusAction(id, status, message, isInternal);
  };

  const handleAssignDept = async (formData: FormData) => {
    "use server";
    const departmentId = formData.get("departmentId") as string;
    const message = formData.get("message") as string;
    await assignComplaintAction(id, departmentId, message);
  };

  const handleEscalate = async (formData: FormData) => {
    "use server";
    const message = formData.get("message") as string;
    await escalateComplaintAction(id, message);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Triage Center
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Grievance details & Timeline audit */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {complaint.id}
              </span>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4">
              {complaint.title}
            </h1>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {complaint.evidence.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Evidence Attachments
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {complaint.evidence.map((ev) => (
                      <a
                        key={ev.id}
                        href={ev.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-primary hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        View Evidence Attachment
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              Resolution Audit Trail
            </h2>
            <ComplaintTimeline updates={complaint.updates} />
          </div>
        </div>

        {/* Right Column: Metadata & Administrative Control Panel */}
        <div className="space-y-6">
          {/* Metadata details */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              Grievance Details
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Date Filed
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  Department
                </span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">
                  {deptName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  Category
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {complaint.category.toLowerCase()}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Student Name
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {complaint.isAnonymous ? "Anonymous Student" : complaint.student?.name || "Student"}
                </span>
              </div>

              {!complaint.isAnonymous && complaint.student && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Student Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {complaint.student.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          {complaint.status !== "RESOLVED" && (
            <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-primary" />
                Administrative Actions
              </h2>

              {/* Form 1: Update Status / Resolve */}
              <form action={handleUpdateStatus} className="space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Update Status or Comment
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    name="status"
                    defaultValue={complaint.status}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="ACTION_TAKEN">Action Taken</option>
                    <option value="RESOLVED">Resolve Grievance</option>
                  </select>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Internal Note</span>
                    <input
                      type="checkbox"
                      name="isInternal"
                      value="true"
                      className="w-3.5 h-3.5 text-primary"
                    />
                  </div>
                </div>
                <textarea
                  name="message"
                  required
                  placeholder="Type updates or notes..."
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold py-1.5 rounded-lg text-xs hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Post Status Update
                </button>
              </form>

              {/* Form 2: Assign/Forward to Department */}
              <form action={handleAssignDept} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Forward / Assign Department
                </span>
                <select
                  name="departmentId"
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <textarea
                  name="message"
                  placeholder="Notes for department..."
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-1.5 rounded-lg text-xs hover:bg-primary/95 shadow-sm shadow-primary/10 cursor-pointer animate-pulse"
                >
                  Forward to Department
                </button>
              </form>

              {/* Form 3: Escalate to Higher Authority */}
              <form action={handleEscalate} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Escalate Complaint
                </span>
                <textarea
                  name="message"
                  required
                  placeholder="Provide escalation justification..."
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-semibold py-1.5 rounded-lg text-xs hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Escalate to Director
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
