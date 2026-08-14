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
  GraduationCap,
  Bell,
} from "lucide-react";

export function StudentSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/news", label: "Campus News", icon: Newspaper },
    { href: "/student/voice", label: "Student Voice", icon: Megaphone },
    { href: "/student/complaints/new", label: "Raise Complaint", icon: PlusCircle },
    { href: "/student/complaints", label: "My Complaints", icon: FolderOpen },
    { href: "/student/notifications", label: "Notifications", icon: Bell },
    { href: "/student/profile", label: "My Profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-card hidden md:block min-h-[calc(100vh-4rem)] p-4 shrink-0">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/student/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 px-3">
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 p-3 rounded-lg flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <div className="text-[11px] leading-tight">
            <span className="font-bold block text-slate-800 dark:text-slate-200">SLIETVoice</span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">By Raj Aryan (InterviewX)</span>
            <span className="text-[9px] text-slate-400">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
