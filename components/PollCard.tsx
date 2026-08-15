"use client";

import React, { useState, useTransition } from "react";
import { BarChart3, Check } from "lucide-react";
import { votePollAction } from "@/actions/polls";

interface Option {
  id: string;
  text: string;
  _count: {
    votes: number;
  };
}

interface PollCardProps {
  poll: {
    id: string;
    question: string;
    isActive: boolean;
    options: Option[];
  };
  hasVoted: boolean;
  votedOptionId?: string;
}

export function PollCard({ poll, hasVoted: initialHasVoted, votedOptionId: initialVotedOptionId }: PollCardProps) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(initialVotedOptionId || null);
  const [isPending, startTransition] = useTransition();

  // Calculate totals
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt._count.votes, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isPending) return;

    // Optimistic vote update
    setSelectedOptionId(optionId);
    setHasVoted(true);

    startTransition(async () => {
      const res = await votePollAction(optionId);
      if (res.error) {
        // Revert on error
        setHasVoted(false);
        setSelectedOptionId(null);
        alert(res.error);
      }
    });
  };

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-5 shadow-none">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-black text-primary uppercase tracking-widest">
          Campus Opinion Poll
        </span>
        {!poll.isActive && (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ml-auto">
            Closed
          </span>
        )}
      </div>

      <h3 className="text-sm font-serif font-black text-slate-900 dark:text-slate-100 mb-4 leading-tight">
        {poll.question}
      </h3>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const votesCount = option._count.votes + (selectedOptionId === option.id && !initialHasVoted ? 1 : 0);
          const totalCalculated = totalVotes + (!initialHasVoted && hasVoted ? 1 : 0);
          const percent = totalCalculated > 0 ? Math.round((votesCount / totalCalculated) * 100) : 0;
          const isUserSelection = selectedOptionId === option.id;

          if (hasVoted || !poll.isActive) {
            // Editorial block progress bar (e.g. YES ██████ 55%)
            const barBlocks = Math.max(1, Math.round(percent / 8));
            return (
              <div key={option.id} className="text-xs space-y-1">
                <div className="flex justify-between items-baseline font-mono text-[11px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {option.text} {isUserSelection && <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold ml-1 uppercase">(Voted)</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary tracking-[1px] font-sans">
                      {"█".repeat(barBlocks)}
                    </span>
                    <span className="font-black text-slate-900 dark:text-white">
                      {percent}% ({votesCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Interactive Voting State
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isPending}
              className="w-full text-left py-2 px-3 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-[8px] text-xs transition-all duration-150 flex items-center justify-between group cursor-pointer"
            >
              <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{option.text}</span>
              <span className="w-3.5 h-3.5 rounded-full border border-slate-350 dark:border-slate-700 group-hover:border-primary flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary" />
              </span>
            </button>
          );
        })}
      </div>

      {(hasVoted || !poll.isActive) && (
        <p className="text-[9px] font-mono text-muted-foreground mt-4 text-right">
          Total Participation: {totalVotes + (!initialHasVoted && hasVoted ? 1 : 0)} students
        </p>
      )}
    </div>
  );
}
