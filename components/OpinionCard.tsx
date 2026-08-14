"use client";

import React, { useState, useTransition } from "react";
import { ArrowBigUp, Award, User, Clock } from "lucide-react";
import { supportOpinionAction } from "@/actions/opinions";

interface OpinionCardProps {
  opinion: {
    id: string;
    title: string;
    description: string;
    category: string;
    isAnonymous: boolean;
    createdAt: Date | string;
    author?: { name: string } | null;
    _count: {
      supports: number;
    };
  };
  currentUserId: string;
  hasSupported: boolean;
}

export function OpinionCard({ opinion, currentUserId, hasSupported: initialHasSupported }: OpinionCardProps) {
  const [supported, setSupported] = useState(initialHasSupported);
  const [supportCount, setSupportCount] = useState(opinion._count.supports);
  const [isPending, startTransition] = useTransition();

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

  const dateFormatted = new Date(opinion.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col md:flex-row gap-4 items-start">
      {/* Upvote Button Container */}
      <button
        onClick={handleSupport}
        disabled={isPending}
        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border w-14 transition-all duration-150 shrink-0 ${
          supported
            ? "bg-primary/10 border-primary text-primary"
            : "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        }`}
      >
        <ArrowBigUp className={`w-6 h-6 ${supported ? "fill-primary" : ""}`} />
        <span className="text-xs font-bold mt-1">{supportCount}</span>
      </button>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded">
            {opinion.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {dateFormatted}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          {opinion.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          {opinion.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>
            {opinion.isAnonymous ? "Anonymous Student" : opinion.author?.name || "Student"}
          </span>
        </div>
      </div>
    </div>
  );
}
