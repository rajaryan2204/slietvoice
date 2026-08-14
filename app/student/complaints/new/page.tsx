import React from "react";
import { db } from "@/lib/db";
import { RaiseComplaintForm } from "@/components/RaiseComplaintForm";

export const revalidate = 0; // Dynamic rendering

export default async function NewComplaintPage() {
  const departments = await db.department.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          File a New Complaint
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit details about academic, hostel, or infrastructural issues.
        </p>
      </div>

      <RaiseComplaintForm departments={departments} />
    </div>
  );
}
