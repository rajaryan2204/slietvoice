import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No items found",
  description = "There is nothing to display here at the moment.",
  icon = <Inbox className="w-12 h-12 text-slate-400 dark:text-slate-600" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-card/50 backdrop-blur-sm min-h-[300px]">
      <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-full">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
}
