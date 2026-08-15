"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  PlusCircle,
  FolderOpen,
  User,
  Inbox,
  BarChart3,
} from "lucide-react";

export function MobileNav({ role }: { role: string }) {
  const pathname = usePathname();

  if (role === "STUDENT") {
    const studentLinks = [
      { href: "/student/dashboard", label: "Home", icon: LayoutDashboard },
      { href: "/student/news", label: "News", icon: Newspaper },
      { href: "/student/voice", label: "Voice", icon: Megaphone },
      { href: "/student/complaints", label: "Issues", icon: FolderOpen },
      { href: "/student/profile", label: "Profile", icon: User },
    ];

    return (
      <>
        {/* Floating Action Button */}
        <Link
          href="/student/complaints/new"
          className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all border border-teal-600"
          title="Raise Complaint"
        >
          <PlusCircle className="w-6.5 h-6.5" />
        </Link>

        {/* Bottom Nav Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-slate-200 dark:border-slate-800 h-16 flex items-center justify-around px-2 pb-safe">
          {studentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </>
    );
  }

  const adminLinks = [
    { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "Triage", icon: Inbox },
    { href: "/admin/voice", label: "Voice", icon: Megaphone },
    { href: "/admin/news", label: "News", icon: Newspaper },
    { href: "/admin/polls", label: "Polls", icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-slate-200 dark:border-slate-800 h-16 flex items-center justify-around px-2 pb-safe">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-all ${
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-slate-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
