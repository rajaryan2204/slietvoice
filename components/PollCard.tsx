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
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Campus Poll
        </span>
        {!poll.isActive && (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-normal uppercase ml-auto">
            Closed
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug">
        {poll.question}
      </h3>

      <div className="space-y-2.5">
        {poll.options.map((option) => {
          const votesCount = option._count.votes + (selectedOptionId === option.id && !initialHasVoted ? 1 : 0);
          const totalCalculated = totalVotes + (!initialHasVoted && hasVoted ? 1 : 0);
          const percent = totalCalculated > 0 ? Math.round((votesCount / totalCalculated) * 100) : 0;
          const isUserSelection = selectedOptionId === option.id;

          if (hasVoted || !poll.isActive) {
            return (
              <div
                key={option.id}
                className={`relative py-2.5 px-4 border rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 transition-all ${
                  isUserSelection
                    ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                    : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                {/* Visual Fill Percentage Bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out ${
                    isUserSelection ? "bg-primary/10 dark:bg-primary/20" : "bg-slate-200/40 dark:bg-slate-800/40"
                  }`}
                  style={{ width: `${percent}%` }}
                />
                
                <div className="relative flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {option.text}
                    {isUserSelection && <Check className="w-4 h-4 text-primary" />}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {percent}% ({votesCount} votes)
                  </span>
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
              className="w-full text-left py-2.5 px-4 border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg text-sm transition-all duration-150 flex items-center justify-between group"
            >
              <span className="font-medium group-hover:text-primary transition-colors">{option.text}</span>
              <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-primary flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary" />
              </span>
            </button>
          );
        })}
      </div>

      {hasVoted && (
        <p className="text-[10px] text-muted-foreground mt-3 text-right">
          Total votes: {totalVotes + (!initialHasVoted && hasVoted ? 1 : 0)}
        </p>
      )}
    </div>
  );
}
