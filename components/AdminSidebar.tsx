"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Megaphone,
  Newspaper,
  BarChart3,
  Building,
  Users,
  ShieldCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "Complaints Triage", icon: Inbox },
    { href: "/admin/voice", label: "Student Voice", icon: Megaphone },
    { href: "/admin/news", label: "News & Alerts", icon: Newspaper },
    { href: "/admin/polls", label: "Manage Polls", icon: BarChart3 },
    { href: "/admin/departments", label: "Departments", icon: Building },
    { href: "/admin/users", label: "Campus Users", icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-card hidden md:block min-h-[calc(100vh-4rem)] p-4 shrink-0">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

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
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          <div className="text-[11px] leading-tight">
            <span className="font-bold block text-slate-800 dark:text-slate-200">Admin Control</span>
            <span className="text-muted-foreground">Authorized Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
