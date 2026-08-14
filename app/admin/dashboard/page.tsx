import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AdminCharts } from "@/components/AdminCharts";
import {
  Inbox,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldAlert,
} from "lucide-react";

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
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Campus Governance Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review metrics, escalated cases, and overall resolution velocity.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Grievances
          </span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </span>
            <Inbox className="w-5 h-5 text-indigo-500" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Pending Triage
          </span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {pendingCount}
            </span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Under Review
          </span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {reviewCount}
            </span>
            <AlertTriangle className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Resolved Cases
          </span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {resolvedCount}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm border-rose-100 dark:border-rose-900/30">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Escalated Issues
          </span>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {escalatedCount}
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Resolution rate indicator block */}
      <div className="bg-card border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center font-black text-lg text-primary bg-primary/5 shrink-0">
          {avgResolutionRate}%
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Average Grievance Resolution Rate
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
            This represents the percentage of overall submitted grievances that have been fully resolved by moderators, department faculty, or higher administrations.
          </p>
        </div>
      </div>

      {/* Recharts Graphics */}
      <AdminCharts data={{ categoryData, departmentData }} />
    </div>
  );
}
