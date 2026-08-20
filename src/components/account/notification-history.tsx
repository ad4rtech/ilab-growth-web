"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { getNotifications, markAllNotificationsRead, deleteNotification, type AppNotification } from "@/lib/notifications";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function NotificationHistory() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(25).then((data) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setLoading(false);
    });
  }, []);

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  }

  async function handleDelete(n: AppNotification) {
    setNotifications((prev) => prev.filter((item) => item.id !== n.id));
    if (!n.read) setUnreadCount((c) => Math.max(0, c - 1));
    await deleteNotification(n.id);
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Recent Notifications</h2>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs font-medium text-blue-700 hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <Bell className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="mt-4 divide-y">
          {notifications.map((n) => (
            <div key={n.id} className="group flex gap-3 py-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? "bg-blue-700" : "bg-gray-200"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(n)}
                className="h-6 w-6 shrink-0 rounded text-gray-300 opacity-0 hover:bg-gray-100 hover:text-red-600 group-hover:opacity-100"
                aria-label="Delete notification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}