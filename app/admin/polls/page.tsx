import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createPollAction, togglePollStatusAction } from "@/actions/polls";
import { EmptyState } from "@/components/EmptyState";
import { BarChart3, MessageSquarePlus, Trash2, Power } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Dynamic rendering

export default async function AdminPollsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const polls = await db.poll.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      options: {
        include: {
          _count: { select: { votes: true } },
        },
      },
      creator: { select: { name: true } },
    },
  });

  const handleCreatePoll = async (formData: FormData) => {
    "use server";
    const question = formData.get("question") as string;
    const opt1 = formData.get("option1") as string;
    const opt2 = formData.get("option2") as string;
    const opt3 = formData.get("option3") as string;
    const opt4 = formData.get("option4") as string;

    const options = [opt1, opt2, opt3, opt4].filter((o) => o && o.trim().length > 0);
    await createPollAction(question, options);
  };

  const handleTogglePollStatus = async (formData: FormData) => {
    "use server";
    const pollId = formData.get("pollId") as string;
    await togglePollStatusAction(pollId);
  };

  const handleDeletePoll = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    try {
      await db.poll.delete({ where: { id } });
      revalidatePath("/admin/polls");
      revalidatePath("/student/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Manage Student Polls
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish opinion polls and review results in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Creator Form */}
        <div className="lg:col-span-1">
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquarePlus className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold">Create new Poll</h2>
            </div>

            <form action={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-400 mb-1.5">
                  Poll Question
                </label>
                <textarea
                  name="question"
                  placeholder="e.g. Should the library remain open until 10 PM?"
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-405">
                  Options
                </span>
                <input
                  name="option1"
                  required
                  placeholder="Option 1 (e.g. Yes)"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <input
                  name="option2"
                  required
                  placeholder="Option 2 (e.g. No)"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <input
                  name="option3"
                  placeholder="Option 3 (Optional)"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
                <input
                  name="option4"
                  placeholder="Option 4 (Optional)"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/95 transition-all text-sm cursor-pointer"
              >
                Publish Live Poll
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active and Closed Polls list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Existing Campus Polls</h2>
          </div>

          {polls.length > 0 ? (
            <div className="space-y-6">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, o) => sum + o._count.votes, 0);

                return (
                  <div key={poll.id} className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${poll.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          {poll.isActive ? "Active Poll" : "Closed"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle Active status */}
                        <form action={handleTogglePollStatus}>
                          <input type="hidden" name="pollId" value={poll.id} />
                          <button
                            type="submit"
                            title={poll.isActive ? "Close Poll" : "Open Poll"}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded transition-colors cursor-pointer"
                          >
                            <Power className={`w-3.5 h-3.5 ${poll.isActive ? "text-emerald-500" : "text-slate-400"}`} />
                          </button>
                        </form>

                        {/* Delete poll */}
                        <form action={handleDeletePoll}>
                          <input type="hidden" name="id" value={poll.id} />
                          <button
                            type="submit"
                            title="Delete Poll"
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-655 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {poll.question}
                    </h3>

                    {/* Options list with progress visualizer */}
                    <div className="space-y-3.5">
                      {poll.options.map((opt) => {
                        const percent = totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0;
                        return (
                          <div key={opt.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span>{opt.text}</span>
                              <span className="text-muted-foreground">
                                {percent}% ({opt._count.votes} votes)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-50 dark:border-slate-800/40 text-[10px] text-muted-foreground flex justify-between">
                      <span>Created by: {poll.creator.name}</span>
                      <span>Total votes cast: {totalVotes}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No polls" description="Use the poll creator form on the left to publish polls." />
          )}
        </div>
      </div>
    </div>
  );
}
