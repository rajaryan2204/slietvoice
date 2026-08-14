import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createNewsAction, deleteNewsAction } from "@/actions/news";
import { EmptyState } from "@/components/EmptyState";
import { Newspaper, MessageSquarePlus, Trash2, Calendar, BadgeCheck } from "lucide-react";

export const revalidate = 0; // Dynamic rendering

export default async function AdminNewsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const newsItems = await db.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const handlePublishNews = async (formData: FormData) => {
    "use server";
    await createNewsAction(null, formData);
  };

  const handleDeleteNews = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteNewsAction(id);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          News & Alerts Publisher
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish verified announcements, academic notifications, or emergency alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Publisher Form */}
        <div className="lg:col-span-1">
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquarePlus className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold">Publish Notice</h2>
            </div>

            <form action={handlePublishNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
                  Notice Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. End Semester Re-evaluation Form Date"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Academics">Academics</option>
                  <option value="Examination">Examination</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Mess">Mess</option>
                  <option value="Events">Events</option>
                  <option value="Administration">Administration</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
                  Content Body
                </label>
                <textarea
                  name="content"
                  placeholder="Provide full details of the notice, including important dates, timings, URLs, and guidelines..."
                  required
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
                  Notice Banner Image Link (Optional)
                </label>
                <input
                  name="imageUrl"
                  type="text"
                  placeholder="e.g. Image URL"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/95 transition-all text-sm cursor-pointer"
              >
                Publish Verified Notice
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Published News List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Published Notices</h2>
          </div>

          {newsItems.length > 0 ? (
            <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/85 shadow-sm">
              {newsItems.map((n) => (
                <div key={n.id} className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(n.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {n.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
                          <BadgeCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-450 text-xs leading-relaxed">
                      {n.content}
                    </p>
                    <span className="block text-[10px] text-muted-foreground pt-1">
                      Published by: {n.author.name}
                    </span>
                  </div>

                  <form action={handleDeleteNews} className="shrink-0">
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      type="submit"
                      title="Delete Notice"
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No published notices"
              description="Use the publisher form on the left to post notices."
            />
          )}
        </div>
      </div>
    </div>
  );
}
