import React from "react";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { EmptyState } from "@/components/EmptyState";
import { Megaphone, MessageSquarePlus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Dynamic rendering

export default async function AdminVoicePage() {
  const user = await getSessionUser();
  if (!user) return null;

  const opinions = await db.opinion.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { supports: true } },
    },
  });

  const handleDeleteOpinion = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    try {
      await db.opinion.delete({ where: { id } });
      revalidatePath("/admin/voice");
      revalidatePath("/student/voice");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Student Voice Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, analyze, and manage student opinions and upvoted suggestions.
        </p>
      </div>

      {opinions.length > 0 ? (
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-4 font-bold text-muted-foreground">Category</th>
                  <th className="p-4 font-bold text-muted-foreground">Title / Suggestion</th>
                  <th className="p-4 font-bold text-muted-foreground">Submitted By</th>
                  <th className="p-4 font-bold text-muted-foreground text-center">Supports</th>
                  <th className="p-4 font-bold text-muted-foreground text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {opinions.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="p-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        {op.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="font-bold block text-slate-900 dark:text-slate-150 text-sm mb-0.5">
                        {op.title}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-lg">
                        {op.description}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {op.isAnonymous ? (
                        <span className="text-muted-foreground italic">Anonymous Student</span>
                      ) : (
                        <div>
                          <span className="block font-semibold">{op.author?.name}</span>
                          <span className="block text-[10px] text-muted-foreground">{op.author?.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-primary text-sm">
                      {op._count.supports}
                    </td>
                    <td className="p-4 text-center">
                      <form action={handleDeleteOpinion} className="inline-block">
                        <input type="hidden" name="id" value={op.id} />
                        <button
                          type="submit"
                          title="Remove Suggestion"
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No suggestions posted"
          description="There are currently no active public opinions submitted by students."
        />
      )}
    </div>
  );
}
