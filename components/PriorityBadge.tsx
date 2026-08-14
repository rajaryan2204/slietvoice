import React from "react";

export function PriorityBadge({ priority }: { priority: string }) {
  let style = "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
  let label = priority;

  switch (priority) {
    case "LOW":
      style = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
      label = "Low";
      break;
    case "MEDIUM":
      style = "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
      label = "Medium";
      break;
    case "HIGH":
      style = "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30";
      label = "High";
      break;
    case "URGENT":
      style = "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 font-bold";
      label = "Urgent";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
