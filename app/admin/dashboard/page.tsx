import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AdminCharts } from "@/components/AdminCharts";


export const revalidate = 0; // Dynamic rendering

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  // 1. Fetch metrics counts
  const totalCount = await db.complaint.count();
  const pendingCount = await db.complaint.count({ where: { status: "SUBMITTED" } });
  const reviewCount = await db.complaint.count({ where: { status: "UNDER_REVIEW" } });
  const resolvedCount = await db.complaint.count({ where: { status: "RESOLVED" } });
  const escalatedCount = await db.complaint.count({ where: { status: "ESCALATED" } });

  // 2. Fetch category distribution
  const categoryStats = await db.complaint.groupBy({
    by: ["category"],
    _count: { id: true },
  });

  const categoryData = categoryStats.map((item) => ({
    name: item.category,
    value: item._count.id,
  }));

  // 3. Fetch department distribution
  const deptStats = await db.complaint.groupBy({
    by: ["departmentId"],
    _count: { id: true },
  });

  const allDepts = await db.department.findMany();
  const deptIdToName = new Map(allDepts.map((d) => [d.id, d.name]));

  const departmentData = deptStats.map((item) => ({
    name: item.departmentId ? deptIdToName.get(item.departmentId) || "Other" : "General Triage",
    value: item._count.id,
  }));

  // Average resolution metrics
  const avgResolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="border-b-2 border-foreground dark:border-border pb-6">
        <h1 className="text-3xl font-serif font-black text-slate-900 dark:text-white uppercase tracking-tight">
          CAMPUS GOVERNANCE ANALYTICS
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
          &quot;Review metrics, escalated cases, and overall resolution velocity.&quot;
        </p>
      </div>

      {/* Large Editorial Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-b border-border text-left">
        <div>
          <span className="block text-4xl font-serif font-black">{totalCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Grievances</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-amber-700 dark:text-amber-500">{pendingCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pending Triage</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-blue-700 dark:text-blue-400">{reviewCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Under Review</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-teal-700 dark:text-teal-400">{resolvedCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resolved Cases</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-rose-700 dark:text-rose-500">{escalatedCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Escalated Issues</span>
        </div>
      </div>

      {/* Resolution rate indicator block */}
      <div className="border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-5 bg-card text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Resolution Velocity
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              This represents the percentage of overall submitted grievances that have been fully resolved by moderators, department faculty, or higher administrations.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-5xl font-serif font-black text-teal-700 dark:text-teal-400">
              {avgResolutionRate}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mt-0.5">
              Average Resolve Rate
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Graphics */}
      <AdminCharts data={{ categoryData, departmentData }} />
    </div>
  );
}
