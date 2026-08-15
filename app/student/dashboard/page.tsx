import React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ComplaintCard } from "@/components/ComplaintCard";
import { NewsCard } from "@/components/NewsCard";
import { PollCard } from "@/components/PollCard";
import { EmptyState } from "@/components/EmptyState";
import { TrendingUp } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function StudentDashboard() {
  const user = await getSessionUser();
  if (!user) return null;

  // 1. Fetch live metrics
  const totalComplaints = await db.complaint.count({ where: { studentId: user.id } });
  const resolvedCount = await db.complaint.count({
    where: { studentId: user.id, status: "RESOLVED" },
  });
  const escalatedCount = await db.complaint.count({
    where: { studentId: user.id, status: "ESCALATED" },
  });
  const underReviewCount = await db.complaint.count({
    where: { studentId: user.id, status: "UNDER_REVIEW" },
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

  // 3b. Fetch latest 4 notices for the Campus Today board
  const campusNotices = await db.news.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
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
    <div className="space-y-6">
      {/* Editorial Heading */}
      <div className="border-b-2 border-foreground dark:border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <span className="font-serif text-5xl md:text-6xl font-black tracking-tighter uppercase block">
              SLIETVOICE
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 block mt-1">
              Students speak. Campus listens.
            </span>
          </div>
          <div className="text-left md:text-right">
            <span className="text-sm font-black uppercase tracking-wider block font-mono">
              {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="text-xs text-muted-foreground block mt-0.5">
              Welcome back, {user.name}
            </span>
          </div>
        </div>
      </div>

      {/* Large Editorial Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 py-6 border-b border-border text-left">
        <div>
          <span className="block text-4xl font-serif font-black">{totalComplaints}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Grievances Raised</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-teal-700 dark:text-teal-400">{resolvedCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cases Resolved</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-amber-700 dark:text-amber-500">{underReviewCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Under Review</span>
        </div>
        <div>
          <span className="block text-4xl font-serif font-black text-rose-700 dark:text-rose-500">{escalatedCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Escalated Cases</span>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center justify-start md:justify-end">
          <Link
            href="/student/complaints/new"
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-bold px-4 py-2 rounded text-xs tracking-wider uppercase hover:opacity-95 transition-opacity"
          >
            + Raise Concern
          </Link>
        </div>
      </div>

      {/* Campus Today Section */}
      <div className="py-6 border-b border-border">
        <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4">
          Campus Today
        </h2>
        <div className="space-y-3.5 text-xs leading-relaxed">
          {campusNotices.length > 0 ? (
            campusNotices.map((notice, idx) => (
              <div key={notice.id} className={`flex flex-col md:flex-row md:items-baseline gap-2 ${idx > 0 ? "pt-2.5 border-t border-dashed border-border" : ""}`}>
                <span className="font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 min-w-[120px] block">{notice.category}</span>
                <span className="text-slate-750 dark:text-slate-350">{notice.title}: {notice.content.slice(0, 150)}{notice.content.length > 150 ? "..." : ""}</span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-xs italic">
              No active campus announcements posted today.
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaints & Polls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Grievances */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                My Recent Grievances
              </h2>
              <Link href="/student/complaints" className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider">
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
              <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4">
                Official Campus Poll
              </h2>
              <PollCard poll={activePoll} hasVoted={hasVoted} votedOptionId={votedOptionId} />
            </div>
          )}
        </div>

        {/* Right Column: News & Notifications */}
        <div className="space-y-8">
          {/* Global Category Distribution Tracker */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-5 shadow-none">
            <h2 className="text-[10px] font-black tracking-widest text-slate-450 dark:text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Active Campus Grievance Trends
            </h2>
            <p className="text-[10px] text-muted-foreground mb-4">
              Real-time distribution of unresolved complaints across categories.
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
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
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
