import React from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-6 flex-1 py-8 pb-28 md:pb-12">
        {children}
      </div>
      <MobileNav role="ADMIN" />
    </div>
  );
}
