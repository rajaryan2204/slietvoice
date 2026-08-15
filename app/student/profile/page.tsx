import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";

import Link from "next/link";
import { User, Mail, GraduationCap, Building, FileSpreadsheet, MessageCircle } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function StudentProfilePage() {
  const user = await getSessionUser();
  if (!user) return null;

  // Get department name
  let deptName = "General Academy";
  if (user.departmentId) {
    const dept = await db.department.findUnique({ where: { id: user.departmentId } });
    if (dept) deptName = dept.name;
  }

  // Get user's complaints
  const complaints = await db.complaint.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Get user's opinions
  const opinions = await db.opinion.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { supports: true } },
    },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          My Student Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your enrolled details and audit history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm md:col-span-1 space-y-4">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
              Student Profile
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                Student ID
              </span>
              <span className="font-semibold text-slate-850 dark:text-slate-200">
                {user.profile?.studentId || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                Email
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                Department
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {deptName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Year of Study</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user.profile?.year || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Complaints and opinions lists */}
        <div className="md:col-span-2 space-y-6">
          {/* Complaints Log */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Grievance Submission Audit
            </h2>

            {complaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80">
                      <th className="py-2.5 font-bold text-muted-foreground">ID</th>
                      <th className="py-2.5 font-bold text-muted-foreground">Title</th>
                      <th className="py-2.5 font-bold text-muted-foreground">Priority</th>
                      <th className="py-2.5 font-bold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="py-3 font-mono text-primary font-bold">
                          <Link href={`/student/complaints/${c.id}`} className="hover:underline">
                            {c.id}
                          </Link>
                        </td>
                        <td className="py-3 font-medium text-slate-800 dark:text-slate-250 truncate max-w-[200px]">
                          {c.title}
                        </td>
                        <td className="py-3">
                          <PriorityBadge priority={c.priority} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2">No complaints submitted yet.</p>
            )}
          </div>

          {/* Opinions Log */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              Shared Suggestions ({opinions.length})
            </h2>

            {opinions.length > 0 ? (
              <div className="space-y-3">
                {opinions.map((op) => (
                  <div
                    key={op.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {op.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        Category: {op.category}
                      </span>
                    </div>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {op._count.supports} supports
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2">No suggestions posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
