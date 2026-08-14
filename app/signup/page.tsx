import React from "react";
import { db } from "@/lib/db";
import { SignUpForm } from "@/components/SignUpForm";

export const revalidate = 0; // Dynamic rendering

export default async function SignUpPage() {
  const departments = await db.department.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b0f19] items-center justify-center p-6">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <SignUpForm departments={departments} />
    </div>
  );
}
