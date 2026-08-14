import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { OpinionCard } from "@/components/OpinionCard";
import { EmptyState } from "@/components/EmptyState";
import { createOpinionAction } from "@/actions/opinions";
import { Megaphone, MessageSquarePlus, Globe, Sparkles } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Dynamic rendering

export default async function StudentVoicePage() {
  const user = await getSessionUser();
  if (!user) return null;

  // 1. Fetch all opinions
  const opinions = await db.opinion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      _count: {
        select: { supports: true },
      },
    },
  });

  // 2. Fetch opinions supported by current user
  const userSupports = await db.opinionSupport.findMany({
    where: { studentId: user.id },
    select: { opinionId: true },
  });
  const supportedOpinionIds = new Set(userSupports.map((s) => s.opinionId));

  // Server action handler wrapper for creation
  const handleCreateOpinion = async (formData: FormData) => {
    "use server";
    await createOpinionAction(null, formData);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Student Voice Board
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share suggestions, improvement requests, or support issues raised by other students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Suggestion Card */}
        <div className="lg:col-span-1">
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquarePlus className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold">Post a Suggestion</h2>
            </div>

            <form action={handleCreateOpinion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Suggestion Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Keep library open till 10 PM"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Academics">Academics</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Mess">Mess</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="IT/Internet">IT & Internet</option>
                  <option value="Safety">Safety & Campus Guards</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Detail Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your suggestion or the issue you are facing in detail..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between py-1 bg-slate-50 dark:bg-slate-900/50 px-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                  Post anonymously
                </span>
                <input
                  type="checkbox"
                  name="isAnonymous"
                  value="true"
                  className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/95 transition-all text-sm cursor-pointer"
              >
                Submit Suggestion
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Opinion List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Public Campus Opinions</h2>
          </div>

          {opinions.length > 0 ? (
            <div className="space-y-4">
              {opinions.map((op) => (
                <OpinionCard
                  key={op.id}
                  opinion={op}
                  currentUserId={user.id}
                  hasSupported={supportedOpinionIds.has(op.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No student suggestions posted yet"
              description="Be the first to share an opinion or request improvements on campus."
              icon={<Megaphone className="w-12 h-12 text-slate-400 dark:text-slate-600" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
