import React from "react";
import { CheckCircle2, Circle, AlertTriangle, Clock, ShieldAlert } from "lucide-react";

interface TimelineUpdate {
  id: string;
  status: string;
  message: string;
  createdAt: Date;
  isInternal: boolean;
  author: {
    name: string;
    role: string;
  };
}

export function ComplaintTimeline({ updates }: { updates: TimelineUpdate[] }) {
  // Sort updates chronologically
  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "ESCALATED":
        return <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />;
      case "ACTION_TAKEN":
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
      case "ASSIGNED":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "UNDER_REVIEW":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sortedUpdates.map((update, updateIdx) => (
          <li key={update.id}>
            <div className="relative pb-8">
              {updateIdx !== sortedUpdates.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {getStatusIcon(update.status)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{getStatusLabel(update.status)}</span>
                      {update.isInternal && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-normal uppercase">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {update.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <span>By {update.author.name}</span>
                      <span className="text-[10px] px-1 bg-slate-100 dark:bg-slate-900 rounded capitalize">
                        {update.author.role.toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-xs whitespace-nowrap text-muted-foreground">
                    <time dateTime={update.createdAt.toString()}>
                      {new Date(update.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(update.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
