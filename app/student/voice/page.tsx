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
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b-2 border-foreground dark:border-border pb-6">
        <h1 className="text-4xl font-serif font-black text-slate-900 dark:text-white uppercase tracking-tight">
          STUDENT VOICE
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
          "What students are talking about."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Suggestion Card */}
        <div className="lg:col-span-1">
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-5 sticky top-24 shadow-none">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Post a Suggestion</h2>
            </div>

            <form action={handleCreateOpinion} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Suggestion Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Keep library open till 10 PM"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
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
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                  Detail Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your suggestion or the issue you are facing in detail..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-[4px] text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between py-2 bg-slate-50 dark:bg-slate-900/40 px-3 rounded-[4px] border border-slate-200 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Post anonymously
                </span>
                <input
                  type="checkbox"
                  name="isAnonymous"
                  value="true"
                  className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-[4px] hover:opacity-95 transition-all text-xs uppercase tracking-widest cursor-pointer"
              >
                Submit Suggestion
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Opinion List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
            <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Public Campus Opinions</h2>
          </div>

          {opinions.length > 0 ? (
            <div className="space-y-1">
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
