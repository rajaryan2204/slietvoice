import React from "react";
import { db } from "@/lib/db";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";

interface SearchParams {
  category?: string;
}

export const revalidate = 0; // Dynamic rendering

export default async function CampusNewsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";

  const categories = [
    { label: "All News", value: "" },
    { label: "Academics", value: "Academics" },
    { label: "Examination", value: "Examination" },
    { label: "Hostel", value: "Hostel" },
    { label: "Mess", value: "Mess" },
    { label: "Events", value: "Events" },
    { label: "Administration", value: "Administration" },
    { label: "Emergency", value: "Emergency" },
  ];

  // Fetch filtered news from the database
  const newsItems = await db.news.findMany({
    where: currentCategory ? { category: currentCategory } : {},
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          Campus News & Announcements
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stay updated with verified college notices and news.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value;
          const href = cat.value ? `/student/news?category=${cat.value}` : "/student/news";

          return (
            <Link
              key={cat.label}
              href={href}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                  : "bg-card text-slate-600 border border-slate-200 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      {newsItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No news matches this category"
          description="There are currently no announcements posted under this filter. Check back later."
        />
      )}
    </div>
  );
}
