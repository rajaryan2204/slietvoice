import React from "react";
import { BadgeCheck, Calendar, ArrowUpRight } from "lucide-react";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    content: string;
    category: string;
    isVerified: boolean;
    imageUrl?: string | null;
    createdAt: Date | string;
    author: {
      name: string;
      role: string;
    };
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const dateFormatted = new Date(news.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Category specific gradients for placeholders
  const getCategoryGradient = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "EMERGENCY":
        return "from-red-500 to-rose-600";
      case "ACADEMICS":
        return "from-indigo-500 to-blue-600";
      case "EXAMINATION":
        return "from-amber-500 to-orange-600";
      case "HOSTEL":
        return "from-teal-500 to-emerald-600";
      case "MESS":
        return "from-violet-500 to-purple-600";
      default:
        return "from-slate-500 to-slate-700";
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* News Image / Color Block */}
        {news.imageUrl ? (
          <div className="h-40 overflow-hidden relative">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
              {news.category}
            </span>
          </div>
        ) : (
          <div className={`h-24 bg-gradient-to-br ${getCategoryGradient(news.category)} relative flex items-end p-3`}>
            <span className="absolute top-3 left-3 bg-black/35 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
              {news.category}
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateFormatted}</span>
            {news.isVerified && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 ml-auto bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {news.content}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{news.author.name}</span>
          <span className="block text-[10px] capitalize">{news.author.role.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
}
