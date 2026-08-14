import React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ComplaintCard } from "@/components/ComplaintCard";
import { NewsCard } from "@/components/NewsCard";
import { PollCard } from "@/components/PollCard";
import { EmptyState } from "@/components/EmptyState";
import {
  MessageSquarePlus,
  Compass,
  Newspaper,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function StudentDashboard() {
  const user = await getSessionUser();
  if (!user) return null;

  // 1. Fetch live metrics
  const totalComplaints = await db.complaint.count({ where: { studentId: user.id } });
  const pendingCount = await db.complaint.count({
    where: { studentId: user.id, status: { in: ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED"] } },
  });
  const resolvedCount = await db.complaint.count({
    where: { studentId: user.id, status: "RESOLVED" },
  });

  // 2. Fetch active complaints
  const recentComplaints = await db.complaint.findMany({
    where: { studentId: user.id },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch latest news
  const latestNews = await db.news.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  // 4. Fetch notifications
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // 4b. Fetch global category distribution to display as a campus-wide trends tracker
  const globalCategoryStats = await db.complaint.groupBy({
    by: ['category'],
    where: {
      status: { not: "RESOLVED" }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 4
  });

  // 5. Fetch first active poll
  const activePoll = await db.poll.findFirst({
    where: { isActive: true },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true },
          },
        },
      },
    },
  });

  // 6. Check if student already voted in this poll
  let hasVoted = false;
  let votedOptionId = "";
  if (activePoll) {
    const optIds = activePoll.options.map((o) => o.id);
    const vote = await db.pollVote.findFirst({
      where: {
        studentId: user.id,
        optionId: { in: optIds },
      },
    });
    if (vote) {
      hasVoted = true;
      votedOptionId = vote.optionId;
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is what is happening on campus today.
        </p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/student/complaints/new"
          className="flex flex-col items-center justify-center p-4 bg-primary text-primary-foreground rounded-xl shadow-sm hover:opacity-95 transition-opacity text-center cursor-pointer"
        >
          <MessageSquarePlus className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold">Raise Complaint</span>
        </Link>
        <Link
          href="/student/voice"
          className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 text-center cursor-pointer"
        >
          <Compass className="w-6 h-6 text-primary mb-2" />
          <span className="text-xs font-bold">Share Opinion</span>
        </Link>
        <Link
          href="/student/news"
          className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 text-center cursor-pointer"
        >
          <Newspaper className="w-6 h-6 text-primary mb-2" />
          <span className="text-xs font-bold">View Campus News</span>
        </Link>
        <Link
          href="/student/complaints"
          className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 text-center cursor-pointer"
        >
          <Bell className="w-6 h-6 text-primary mb-2" />
          <span className="text-xs font-bold">Track Status</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-lg font-extrabold">{totalComplaints}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Total Grievances
            </span>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 rounded-lg">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-lg font-extrabold">{pendingCount}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Pending Actions
            </span>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-lg font-extrabold">{resolvedCount}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Resolved Cases
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaints & Polls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Grievances */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                My Recent Grievances
              </h2>
              <Link href="/student/complaints" className="text-xs font-semibold text-primary hover:underline">
                View all &rarr;
              </Link>
            </div>

            {recentComplaints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentComplaints.map((c) => (
                  <ComplaintCard key={c.id} complaint={c} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No complaints filed yet"
                description="If you have any grievances regarding hostel facilities, mess quality, or academic blocks, submit your complaint."
              />
            )}
          </div>

          {/* Active Poll */}
          {activePoll && (
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
                Official Campus Poll
              </h2>
              <PollCard poll={activePoll} hasVoted={hasVoted} votedOptionId={votedOptionId} />
            </div>
          )}
        </div>

        {/* Right Column: News & Notifications */}
        <div className="space-y-8">
          {/* Global Category Distribution Tracker */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              Active Campus Grievance Trends
            </h2>
            <p className="text-[10px] text-muted-foreground mb-4">
              Real-time distribution of unresolved complaints across SLIET categories.
            </p>

            <div className="space-y-3.5">
              {globalCategoryStats.length > 0 ? (
                globalCategoryStats.map((stat) => {
                  const totalGrievancesCount = globalCategoryStats.reduce((sum, item) => sum + item._count.id, 0);
                  const percentage = totalGrievancesCount > 0 ? Math.round((stat._count.id / totalGrievancesCount) * 100) : 0;
                  
                  return (
                    <div key={stat.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-350">{stat.category}</span>
                        <span className="text-slate-900 dark:text-white">{stat._count.id} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No active grievances logged.</p>
              )}
            </div>
          </div>

          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Latest Campus News
              </h2>
              <Link href="/student/news" className="text-xs font-semibold text-primary hover:underline">
                Read all &rarr;
              </Link>
            </div>

            {latestNews.length > 0 ? (
              <div className="space-y-4">
                {latestNews.map((n) => (
                  <NewsCard key={n.id} news={n} />
                ))}
              </div>
            ) : (
              <EmptyState title="No announcements" description="Check back later for official verified college notices." />
            )}
          </div>

          {/* Notifications Panel */}
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              Recent Alerts
            </h2>

            {notifications.length > 0 ? (
              <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 text-xs ${notif.isRead ? "opacity-75" : "bg-primary/5 border-l-2 border-primary"}`}>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{notif.message}</p>
                    <span className="block text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(notif.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="All caught up" description="You have no new alerts." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
