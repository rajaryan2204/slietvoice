import React from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Calendar, Tag, ShieldCheck, MapPin } from "lucide-react";

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

  const detailUrl = isAdmin
    ? `/admin/complaints/${complaint.id}`
    : `/student/complaints/${complaint.id}`;

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
            {complaint.id}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
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
