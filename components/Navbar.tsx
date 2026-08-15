
import React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { markNotificationsAsReadAction } from "@/actions/notifications";
import { db } from "@/lib/db";
import { Bell, LogOut, User, GraduationCap, ShieldAlert } from "lucide-react";

export async function Navbar() {
  const user = await getSessionUser();

  let unreadNotificationsCount = 0;
  if (user) {
    unreadNotificationsCount = await db.notification.count({
      where: { userId: user.id, isRead: false },
    });
  }


  async function handleLogout() {
    "use server";
    await logoutAction();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-card/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-90">
            SLIET<span className="text-primary font-black">Voice</span>
          </Link>
        </div>

        {/* Center menu links */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href={user.role === "STUDENT" ? "/student/news" : "/admin/news"}
                className="text-xs font-bold text-slate-650 dark:text-slate-400 hover:text-primary transition-colors"
              >
                News
              </Link>
              <Link
                href={user.role === "STUDENT" ? "/student/voice" : "/admin/voice"}
                className="text-xs font-bold text-slate-655 dark:text-slate-400 hover:text-primary transition-colors"
              >
                Student Voice
              </Link>
              <Link
                href={user.role === "STUDENT" ? "/student/complaints" : "/admin/complaints"}
                className="text-xs font-bold text-slate-655 dark:text-slate-400 hover:text-primary transition-colors"
              >
                Complaints
              </Link>
            </>
          ) : null}
          <Link href="/about" className="text-xs font-bold text-slate-655 dark:text-slate-400 hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications bell */}
              <div className="relative group">
                <Link
                  href={user.role === "STUDENT" ? "/student/notifications" : "/admin/dashboard"}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all flex items-center justify-center"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User badge */}
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {user.role}
                </span>
              </div>

              {/* Logout Button */}
              <form action={handleLogout}>
                <button
                  type="submit"
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/95 transition-all shadow-sm shadow-primary/20"
              >
                Join Portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
