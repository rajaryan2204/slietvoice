import React from "react";
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { MobileNav } from "@/components/MobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav role="ADMIN" />
    </div>
  );
}
