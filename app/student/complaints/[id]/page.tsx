import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ComplaintTimeline } from "@/components/ComplaintTimeline";
import Link from "next/link";
import { Calendar, Building, Tag, FileText, ArrowLeft, Clock } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return null;

  const { id } = await params;

  // Fetch complaint with updates and evidence
  const complaint = await db.complaint.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, email: true } },
      evidence: true,
      updates: {
        where: {
          // Students cannot see internal notes!
          isInternal: false,
        },
        include: {
          author: {
            select: { name: true, role: true },
          },
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

  // Security: check if this complaint belongs to the student
  if (complaint.studentId !== user.id) {
    redirect("/student/dashboard");
  }

  // Get department name
  let deptName = "Unassigned / General Triage";
  if (complaint.departmentId) {
    const dept = await db.department.findUnique({ where: { id: complaint.departmentId } });
    if (dept) deptName = dept.name;
  }

  const activeEscalation = complaint.status === "ESCALATED" ? complaint.escalations[0] : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/student/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Grievances
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaint details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg text-xs font-semibold text-primary hover:underline"
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

        {/* Right Column: Sidebar metadata */}
        <div className="space-y-6">
          {/* Metadata Card */}
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

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Anonymous Submission</span>
                <span className="font-semibold text-slate-805 dark:text-slate-200">
                  {complaint.isAnonymous ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Escalation alert box */}
          {activeEscalation && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-xl flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-rose-900 dark:text-rose-350 block">
                  Escalated Issue
                </span>
                <p className="text-rose-750 dark:text-rose-400 mt-1 leading-relaxed">
                  This issue was unresolved within the deadline. Escalation Level {activeEscalation.escalationLevel} has been triggered. Assigned to:{" "}
                  <strong className="font-semibold">{activeEscalation.currentAuthority}</strong>.
                </p>
                <span className="block mt-2 font-bold text-rose-800 dark:text-rose-300">
                  Resolution Deadline:{" "}
                  {new Date(activeEscalation.deadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
