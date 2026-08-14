import React from "react";

export type ComplaintStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "ACTION_TAKEN"
  | "RESOLVED"
  | "ESCALATED";

export function StatusBadge({ status }: { status: string }) {
  let bg = "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  let dot = "bg-slate-400";
  let label = status;

  switch (status) {
    case "SUBMITTED":
      bg = "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50";
      dot = "bg-blue-500";
      label = "Submitted";
      break;
    case "UNDER_REVIEW":
      bg = "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900/50";
      dot = "bg-yellow-500";
      label = "Under Review";
      break;
    case "ASSIGNED":
      bg = "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50";
      dot = "bg-purple-500";
      label = "Assigned";
      break;
    case "ACTION_TAKEN":
      bg = "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50";
      dot = "bg-orange-500";
      label = "Action Taken";
      break;
    case "RESOLVED":
      bg = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50";
      dot = "bg-emerald-500";
      label = "Resolved";
      break;
    case "ESCALATED":
      bg = "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 animate-pulse";
      dot = "bg-rose-500";
      label = "Escalated";
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
