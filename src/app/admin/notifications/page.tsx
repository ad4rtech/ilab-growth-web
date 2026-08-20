"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  UserPlus,
  PackagePlus,
  PackageMinus,
  FileText,
  FileMinus,
  Pencil,
  ShoppingCart,
  GraduationCap,
  Briefcase,
  Mail,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const LAST_VIEWED_KEY = "ilab-admin-notifications-last-viewed";

type ActivityItem = {
  type: string;
  title: string;
  createdAt: string;
};

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  user_signup: UserPlus,
  product_created: PackagePlus,
  product_deleted: PackageMinus,
  product_updated: Pencil,
  blog_post_created: FileText,
  blog_post_deleted: FileMinus,
  order_completed: ShoppingCart,
  enrollment_created: GraduationCap,
  course_created: GraduationCap,
  course_updated: Pencil,
  course_deleted: PackageMinus,
  service_created: Briefcase,
  service_updated: Pencil,
  service_deleted: PackageMinus,
  inquiry_submitted: Mail,
  comment_submitted: MessageSquare,
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastViewed, setLastViewed] = useState<string>("");

  useEffect(() => {
    // 30-day window on this full page — deliberately wider than the bell
    // dropdown's 7-day default, since this is the "see everything" view.
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const previouslyViewed =
      localStorage.getItem(LAST_VIEWED_KEY) ?? new Date(0).toISOString();
    setLastViewed(previouslyViewed);

    fetch(`/api/admin/notifications?since=${encodeURIComponent(since)}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  function handleMarkAllRead() {
    localStorage.setItem(LAST_VIEWED_KEY, new Date().toISOString());
    setLastViewed(new Date().toISOString());
  }

  const hasUnread = items.some((item) => new Date(item.createdAt) > new Date(lastViewed));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            Activity across the platform — last 30 days.
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Bell className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity in the last 30 days.</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item, i) => {
              const Icon = ACTIVITY_ICON[item.type] ?? Bell;
              const isUnread = new Date(item.createdAt) > new Date(lastViewed);
              return (
                <div key={i} className="flex items-start gap-3 py-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      isUnread ? "bg-blue-700" : "bg-gray-200"
                    }`}
                  />
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}