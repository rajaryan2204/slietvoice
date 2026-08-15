import React from "react";
import { BadgeCheck } from "lucide-react";

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

  return (
    <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800/80 rounded-[8px] overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between group shadow-none">
      <div>
        {/* News Image */}
        {news.imageUrl && (
          <div className="h-44 overflow-hidden relative">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-2.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <span className="text-teal-700 dark:text-teal-400 font-black">{news.category}</span>
            <span>&bull;</span>
            <span>{dateFormatted}</span>
            {news.isVerified && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 ml-auto bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                <BadgeCheck className="w-3 h-3" />
                Verified Notice
              </span>
            )}
          </div>

          <h3 className="text-base font-serif font-black text-slate-900 dark:text-slate-100 mb-2 leading-tight">
            {news.title}
          </h3>

          <p className="text-xs text-slate-650 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {news.content}
          </p>
        </div>
      </div>

      <div className="p-5 pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{news.author.name}</span>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">{news.author.role}</span>
        </div>
      </div>
    </div>
  );
}
