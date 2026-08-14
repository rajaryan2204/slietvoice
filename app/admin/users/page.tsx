import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { Users, GraduationCap, ShieldCheck, Mail } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const users = await db.user.findMany({
    orderBy: { role: "asc" },
    include: {
      profile: true,
    },
  });

  const departments = await db.department.findMany();
  const deptIdToName = new Map(departments.map((d) => [d.id, d.name]));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Campus Users Registry
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor active user directory, roles, and department affiliations.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 font-bold text-muted-foreground">User Name</th>
                <th className="p-4 font-bold text-muted-foreground">Role</th>
                <th className="p-4 font-bold text-muted-foreground">Enrolled Department</th>
                <th className="p-4 font-bold text-muted-foreground font-mono">Student ID / Details</th>
                <th className="p-4 font-bold text-muted-foreground">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</span>
                      <span className="text-muted-foreground text-[10px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "DIRECTOR"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                          : u.role === "FACULTY"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                          : u.role === "MODERATOR"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                      }`}
                    >
                      {u.role === "STUDENT" ? (
                        <>
                          <GraduationCap className="w-3 h-3" /> Student
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" /> {u.role.toLowerCase()}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {u.departmentId ? deptIdToName.get(u.departmentId) || "General" : "N/A"}
                  </td>
                  <td className="p-4">
                    {u.profile ? (
                      <div className="font-mono">
                        <span className="block font-bold">{u.profile.studentId}</span>
                        <span className="block text-[10px] text-muted-foreground font-normal">
                          Year {u.profile.year} of Study
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Administrative Staff</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
