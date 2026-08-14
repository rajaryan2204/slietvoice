import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ComplaintCard } from "@/components/ComplaintCard";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function StudentComplaintsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const complaints = await db.complaint.findMany({
    where: { studentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            My Filed Grievances
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and monitor the resolution process of your filed complaints.
          </p>
        </div>
        <Link
          href="/student/complaints/new"
          className="flex items-center gap-1.5 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-primary/95 text-xs shadow-sm shadow-primary/10 transition-all cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          File Grievance
        </Link>
      </div>

      {/* Grid */}
      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No grievances submitted"
          description="You haven't submitted any complaints on the portal. Click 'File Grievance' above to get started."
        />
      )}
    </div>
  );
}
