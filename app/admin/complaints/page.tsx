import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { Eye, ArrowUpDown, ChevronRight } from "lucide-react";

interface SearchParams {
  status?: string;
  priority?: string;
  departmentId?: string;
}

export const revalidate = 0; // Dynamic rendering

export default async function AdminComplaintsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await getSessionUser();
  if (!user) return null;

  const resolvedParams = await searchParams;
  const filterStatus = resolvedParams.status || "";
  const filterPriority = resolvedParams.priority || "";
  const filterDept = resolvedParams.departmentId || "";

  // Query filters
  const whereFilter: Record<string, string> = {};
  if (filterStatus) whereFilter.status = filterStatus;
  if (filterPriority) whereFilter.priority = filterPriority;
  if (filterDept) whereFilter.departmentId = filterDept;

  const complaints = await db.complaint.findMany({
    where: whereFilter,
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { name: true } },
    },
  });

  const departments = await db.department.findMany({ orderBy: { name: "asc" } });

  // Get department names map
  const deptIdToName = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Grievance Triage Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, assign, escalate, and resolve student complaints.
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex flex-wrap gap-4 items-end shadow-sm">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
            Status
          </label>
          <select
            defaultValue={filterStatus}
            onChange={(e) => {
              // Standard client redirect or simple query params link is simulated via form action/GET
            }}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
            name="status"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACTION_TAKEN">Action Taken</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
            Priority
          </label>
          <select
            defaultValue={filterPriority}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
            name="priority"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
            Department
          </label>
          <select
            defaultValue={filterDept}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none"
            name="departmentId"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Since Next.js 15 server component search params require a URL change, let's wrap this in a neat GET form to submit search params */}
        <form method="GET" action="/admin/complaints" className="flex gap-2">
          <input type="hidden" name="status" value={filterStatus} />
          <input type="hidden" name="priority" value={filterPriority} />
          <input type="hidden" name="departmentId" value={filterDept} />
          <button
            type="submit"
            className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg text-xs hover:bg-primary/95 transition-all shadow-sm shadow-primary/10 cursor-pointer"
          >
            Reset/Apply Filters
          </button>
        </form>
      </div>

      {/* Complaints Data Table */}
      {complaints.length > 0 ? (
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-4 font-bold text-muted-foreground">ID</th>
                  <th className="p-4 font-bold text-muted-foreground">Title</th>
                  <th className="p-4 font-bold text-muted-foreground">Category</th>
                  <th className="p-4 font-bold text-muted-foreground">Student</th>
                  <th className="p-4 font-bold text-muted-foreground">Priority</th>
                  <th className="p-4 font-bold text-muted-foreground">Department</th>
                  <th className="p-4 font-bold text-muted-foreground">Status</th>
                  <th className="p-4 font-bold text-muted-foreground">Date</th>
                  <th className="p-4 font-bold text-muted-foreground text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="p-4 font-mono text-primary font-bold">{c.id}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                      {c.title}
                    </td>
                    <td className="p-4 capitalize">{c.category.toLowerCase()}</td>
                    <td className="p-4 font-medium">
                      {c.isAnonymous ? "Anonymous" : c.student?.name || "Student"}
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="p-4 font-medium">
                      {c.departmentId ? deptIdToName.get(c.departmentId) || "Other" : "General Triage"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/complaints/${c.id}`}
                        className="inline-flex items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary rounded transition-all cursor-pointer"
                        title="Triage Complaint"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No grievances found"
          description="There are currently no student complaints filed matching the filter query."
        />
      )}
    </div>
  );
}
