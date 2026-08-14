import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import {
  GraduationCap,
  MessageSquarePlus,
  Compass,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function LandingPage() {
  // Query live db stats for landing page
  const totalStudents = await db.user.count({ where: { role: "STUDENT" } });
  const totalComplaints = await db.complaint.count();
  const resolvedComplaints = await db.complaint.count({ where: { status: "RESOLVED" } });
  const activeAnnouncements = await db.news.count();

  // Query latest 3 public complaints for solidarity tracker
  const recentComplaints = await db.complaint.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  const mockStats = {
    students: totalStudents > 0 ? totalStudents : 1240,
    issues: totalComplaints > 0 ? totalComplaints : 158,
    resolved: resolvedComplaints > 0 ? resolvedComplaints : 142,
    announcements: activeAnnouncements > 0 ? activeAnnouncements : 12,
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 flex flex-col items-center justify-center text-center px-6">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-6 border border-rose-500/20 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Safe Student Solidarity & Expression
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Raise Your Voice. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-primary to-indigo-500 bg-clip-text text-transparent">
              Stand Together.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            In light of recent campus protests, we stand for transparent governance. <strong>SLIETVoice</strong> is a secure, anonymous-friendly portal created to log grievances, track administrative reviews, and hold authorities accountable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
            >
              Raise a Complaint
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold px-6 py-3.5 rounded-xl transition-all cursor-pointer text-sm"
            >
              Share Your Opinion
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-6xl mx-auto w-full px-6 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-card text-card-foreground border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
          <div className="text-center p-4 border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 col-span-1">
            <span className="block text-3xl md:text-4xl font-extrabold text-primary mb-1">
              {mockStats.students}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Students
            </span>
          </div>

          <div className="text-center p-4 border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 col-span-1">
            <span className="block text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {mockStats.issues}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Issues Raised
            </span>
          </div>

          <div className="text-center p-4 border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 col-span-1">
            <span className="block text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
              {mockStats.resolved}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Issues Resolved
            </span>
          </div>

          <div className="text-center p-4 last:border-r-0 col-span-1">
            <span className="block text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {mockStats.announcements}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Active News
            </span>
          </div>
        </div>
      </section>

      {/* Live Grievance Feed / Solidarity Hub */}
      <section className="max-w-6xl mx-auto w-full px-6 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            Live Triage & Solidarity Tracker
          </h2>
          <p className="text-xs text-muted-foreground mt-1.5">
            Real-time public grievance logs showing the current administrative review status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((item) => (
              <div key={item.id} className="bg-card border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      item.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      item.status === "ACTION_TAKEN" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" :
                      item.status === "ESCALATED" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] text-muted-foreground">
                  <span>ID: {item.id}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-card border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">HOSTEL MANAGEMENT</span>
                    <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-rose-500/10 text-rose-600">ESCALATED</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Mess Hygiene & Drinking Water Issues</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Unsanitary mess preparation environment and non-functioning water purifiers in Hostel 3 need immediate administrative inspection.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] text-muted-foreground">
                  <span>ID: SL-2026-0034</span>
                  <span>Aug 13, 2026</span>
                </div>
              </div>

              <div className="bg-card border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">ACADEMIC BRANCH</span>
                    <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-amber-500/10 text-amber-600">UNDER REVIEW</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Unfair Penalty Charges & Registration Delays</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Excessive late fees imposed due to database portal crashes during semester registration periods are requested to be waived.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] text-muted-foreground">
                  <span>ID: SL-2026-0041</span>
                  <span>Aug 13, 2026</span>
                </div>
              </div>

              <div className="bg-card border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">FACILITIES & INFRA</span>
                    <span className="px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-emerald-500/10 text-emerald-600">RESOLVED</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Library Power & AC Outage</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Main library central air conditioning has been repaired and power backup lines have been re-routed following recent student submissions.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900 text-[11px] text-muted-foreground">
                  <span>ID: SL-2026-0012</span>
                  <span>Aug 12, 2026</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How it Works / Core Values */}
      <section className="bg-slate-100 dark:bg-slate-950/40 py-20 px-6 border-t border-slate-200/50 dark:border-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              How SLIETVoice works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A structured, anonymous-friendly workflow ensuring grievances are heard and resolved systematically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Voice Concerns</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submit academic, hostel, transport, or mess issues. Choose to submit sensitive grievances anonymously to preserve privacy.
              </p>
            </div>

            <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Transparent Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track your grievance in real-time as moderators verify, prioritize, and assign it to the respective faculty department admins.
              </p>
            </div>

            <div className="bg-card border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Accountable Escalation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unresolved department issues trigger escalations automatically. Higher admins (HODs/Directors) intervene to ensure closures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center border-t border-slate-200 dark:border-slate-800 text-xs text-muted-foreground space-y-1">
        <p>&copy; 2026 SLIETVoice. All rights reserved.</p>
        <p className="text-[10px] text-slate-500">
          Created by <span className="font-semibold text-slate-700 dark:text-slate-300">Raj Aryan</span> (Creator of <span className="text-primary font-semibold">InterviewX</span>). Designed for modern university governance.
        </p>
      </footer>
    </div>
  );
}
