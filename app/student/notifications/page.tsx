import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { markNotificationsAsReadAction } from "@/actions/notifications";
import { EmptyState } from "@/components/EmptyState";
import { Bell, CheckCircle2, Clock } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function StudentNotificationsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const handleMarkAsRead = async () => {
    "use server";
    await markNotificationsAsReadAction();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time updates regarding your filed complaints and opinion boards.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <form action={handleMarkAsRead}>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Mark all as read
            </button>
          </form>
        )}
      </div>

      {/* List */}
      {notifications.length > 0 ? (
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                notif.isRead ? "opacity-70" : "bg-primary/5 border-l-4 border-primary"
              }`}
            >
              <div
                className={`p-2 rounded-full shrink-0 ${
                  notif.isRead
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  {notif.message}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(notif.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  {new Date(notif.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="We'll notify you here when the status of your complaints change or when news posts are verified."
          icon={<Bell className="w-12 h-12 text-slate-400 dark:text-slate-600" />}
        />
      )}
    </div>
  );
}
