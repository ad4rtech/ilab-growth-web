// src/components/admin/blog-stat-cards.tsx
import { FileText, Eye, MessageCircle, Rss, TrendingUp, TrendingDown } from "lucide-react";
import type { BlogStats, NewsletterStats } from "@/lib/blog-admin";

interface BlogStatCardsProps {
  stats: BlogStats;
  newsletterStats: NewsletterStats;
}

function ChangeIndicator({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span className="text-muted-foreground">No prior month data yet</span>;
  }
  const positive = percent >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={positive ? "text-green-600" : "text-red-600"}>
      <Icon className="mr-1 inline h-3.5 w-3.5" />
      {positive ? "+" : ""}
      {percent}%{" "}
      <span className="text-muted-foreground">vs last month</span>
    </span>
  );
}

export function BlogStatCards({ stats, newsletterStats }: BlogStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.totalPosts}</p>
        <p className="mt-2 text-sm">
          <span className="text-orange-600">
            <TrendingUp className="mr-1 inline h-3.5 w-3.5" />+{stats.postsThisQuarter}
          </span>{" "}
          <span className="text-muted-foreground">this quarter</span>
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Eye className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={stats.viewsChangePercent} />
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Comments</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <MessageCircle className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.totalComments.toLocaleString()}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={stats.commentsChangePercent} />
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Newsletter Subscribers</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Rss className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{newsletterStats.total.toLocaleString()}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={newsletterStats.changePercent} />
        </p>
      </div>
    </div>
  );
}