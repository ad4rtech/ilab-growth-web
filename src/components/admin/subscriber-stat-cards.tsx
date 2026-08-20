// src/components/admin/subscriber-stat-cards.tsx
import { Mail, TrendingUp as ClickIcon, UserMinus, TrendingUp, TrendingDown } from "lucide-react";
import type { SubscriberStats } from "@/lib/subscribers-admin";

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

export function SubscriberStatCards({ stats }: { stats: SubscriberStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Subscribers</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Mail className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">{stats.total.toLocaleString()}</p>
        <p className="mt-2 text-sm">
          <ChangeIndicator percent={stats.changePercent} />
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ClickIcon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">
          {stats.avgOpenRate === null ? "—" : `${stats.avgOpenRate}%`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {stats.avgOpenRate === null
            ? "No delivered-email data yet"
            : "Across all sent campaigns"}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Avg. Click Rate</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ClickIcon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">
          {stats.avgClickRate === null ? "—" : `${stats.avgClickRate}%`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {stats.avgClickRate === null
            ? "No delivered-email data yet"
            : "Across all sent campaigns"}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Unsubscribe Rate</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserMinus className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold">
          {stats.unsubscribeRate === null ? "—" : `${stats.unsubscribeRate}%`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Of everyone who ever subscribed</p>
      </div>
    </div>
  );
}