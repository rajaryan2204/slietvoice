"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Calendar, Tag, ShieldCheck, Heart, Trash2 } from "lucide-react";
import { upvoteComplaintAction, deleteComplaintAction } from "@/actions/complaints";

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    isAnonymous: boolean;
    createdAt: Date | string;
    upvotes?: number;
    student?: { name: string } | null;
  };
  isAdmin?: boolean;
}

export function ComplaintCard({ complaint, isAdmin = false }: ComplaintCardProps) {
  const dateFormatted = new Date(complaint.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`upvoted_${complaint.id}`) === "true";
    }
    return false;
  });
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    const nextUpvoted = !hasUpvoted;
    setHasUpvoted(nextUpvoted);
    setUpvotes((prev) => (nextUpvoted ? prev + 1 : prev - 1));
    if (typeof window !== "undefined") {
      localStorage.setItem(`upvoted_${complaint.id}`, String(nextUpvoted));
    }

    startTransition(async () => {
      const res = await upvoteComplaintAction(complaint.id, nextUpvoted);
      if (res.error) {
        setHasUpvoted(!nextUpvoted);
        setUpvotes((prev) => (!nextUpvoted ? prev + 1 : prev - 1));
        if (typeof window !== "undefined") {
          localStorage.setItem(`upvoted_${complaint.id}`, String(!nextUpvoted));
        }
        alert(res.error);
      }
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this grievance?")) return;

    setIsDeleting(true);
    startTransition(async () => {
      const res = await deleteComplaintAction(complaint.id);
      if (res.error) {
        alert(res.error);
        setIsDeleting(false);
      }
    });
  };

  const detailUrl = isAdmin
    ? `/admin/complaints/${complaint.id}`
    : `/student/complaints/${complaint.id}`;

  if (isDeleting) return null;

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800/80 rounded-[8px] p-5 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between group shadow-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {complaint.id}
            {!isAdmin && (
              <button
                onClick={handleUpvote}
                disabled={isPending}
                className={`ml-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                  hasUpvoted
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-550"
                }`}
                title="Support this grievance"
              >
                <Heart className={`w-3 h-3 transition-colors ${hasUpvoted ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{upvotes} Support</span>
              </button>
            )}
            {isAdmin && complaint.upvotes !== undefined && (
              <span className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-muted-foreground">
                <Heart className="w-3 h-3 text-slate-400" />
                <span>{complaint.upvotes} Support</span>
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
            {!isAdmin && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                title="Delete this complaint"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {complaint.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {complaint.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-muted-foreground gap-3">
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {dateFormatted}
          </span>
          <span className="flex items-center gap-1 capitalize">
            <Tag className="w-3.5 h-3.5" />
            {complaint.category.toLowerCase()}
          </span>
          {isAdmin && (
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {complaint.isAnonymous ? "Anonymous Student" : complaint.student?.name || "Student"}
            </span>
          )}
        </div>

        <Link
          href={detailUrl}
          className="text-xs font-semibold text-primary hover:underline shrink-0"
        >
          Track Status &rarr;
        </Link>
      </div>
    </div>
  );
}

