import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Building, Inbox, CheckCircle2 } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminDepartmentsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const departments = await db.department.findMany({
    orderBy: { name: "asc" },
  });

  // Calculate complaint statistics per department
  const deptStats = [];
  for (const dept of departments) {
    const totalCount = await db.complaint.count({ where: { departmentId: dept.id } });
    const resolvedCount = await db.complaint.count({
      where: { departmentId: dept.id, status: "RESOLVED" },
    });
    const pendingCount = totalCount - resolvedCount;

    deptStats.push({
      ...dept,
      totalCount,
      resolvedCount,
      pendingCount,
    });
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          University Departments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor administrative departments and tracking statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptStats.map((dept) => (
          <div key={dept.id} className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                {dept.name}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center text-xs">
              <div>
                <span className="block font-black text-slate-900 dark:text-white text-base">
                  {dept.totalCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  Total
                </span>
              </div>
              <div>
                <span className="block font-black text-yellow-600 dark:text-yellow-405 text-base">
                  {dept.pendingCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  Pending
                </span>
              </div>
              <div>
                <span className="block font-black text-emerald-600 dark:text-emerald-400 text-base">
                  {dept.resolvedCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block mt-0.5">
                  Resolved
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
