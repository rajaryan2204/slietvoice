"use client";

import React, { useState, useTransition } from "react";
import { supportOpinionAction, deleteOpinionAction } from "@/actions/opinions";
import { Trash2 } from "lucide-react";

interface OpinionCardProps {
  opinion: {
    id: string;
    title: string;
    description: string;
    category: string;
    isAnonymous: boolean;
    authorId?: string | null;
    createdAt: Date | string;
    author?: { name: string } | null;
    _count: {
      supports: number;
    };
  };
  hasSupported: boolean;
  isAdmin?: boolean;
}

export function OpinionCard({ opinion, hasSupported: initialHasSupported, isAdmin = false }: OpinionCardProps) {
  const [supported, setSupported] = useState(initialHasSupported);
  const [supportCount, setSupportCount] = useState(opinion._count.supports);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSupport = async () => {
    // Optimistic Update
    const nextSupported = !supported;
    setSupported(nextSupported);
    setSupportCount((prev) => (nextSupported ? prev + 1 : prev - 1));

    startTransition(async () => {
      const res = await supportOpinionAction(opinion.id);
      if (res.error) {
        // Revert on error
        setSupported(!nextSupported);
        setSupportCount((prev) => (!nextSupported ? prev + 1 : prev - 1));
        alert(res.error);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;

    setIsDeleting(true);
    startTransition(async () => {
      const res = await deleteOpinionAction(opinion.id);
      if (res.error) {
        alert(res.error);
        setIsDeleting(false);
      }
    });
  };

  const dateFormatted = new Date(opinion.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  if (isDeleting) return null;

  return (
    <div className="border-b border-border/80 pb-6 pt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="text-[10px] font-black tracking-widest text-slate-450 dark:text-slate-400 uppercase flex items-center justify-between">
          <span>{opinion.category} &bull; {opinion.isAnonymous ? "ANONYMOUS" : opinion.author?.name?.toUpperCase() || "STUDENT"}</span>
        </div>
        <h3 className="text-base font-serif font-black text-slate-900 dark:text-white leading-tight">
          {opinion.title}
        </h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl">
          {opinion.description}
        </p>
        <div className="text-[10px] font-mono text-muted-foreground pt-1">
          {supportCount} students supported &bull; Published {dateFormatted}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={handleSupport}
          disabled={isPending}
          className={`px-3 py-1.5 rounded-[4px] border text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
            supported
              ? "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/20 dark:border-teal-800 dark:text-teal-400"
              : "bg-transparent border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
          }`}
        >
          {supported ? "✓ Supported" : "Support"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          title="Delete this suggestion"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

