"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Package, X } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type AppNotification,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function loadNotifications() {
    const data = await getNotifications(10);
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
    setLoaded(true);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !loaded) await loadNotifications();
  }

  async function handleNotificationClick(n: AppNotification) {
    if (!n.read) {
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
      setUnreadCount((c) => Math.max(0, c - 1));
      await markNotificationRead(n.id);
    }
    setOpen(false);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  }

  async function handleDelete(e: React.MouseEvent, n: AppNotification) {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== n.id));
    if (!n.read) setUnreadCount((c) => Math.max(0, c - 1));
    await deleteNotification(n.id);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="font-semibold text-gray-900">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-blue-700 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Package className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const content = (
                  <div
                    className={cn(
                      "group flex gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-gray-50",
                      !n.read && "bg-blue-50/50",
                    )}
                  >
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", !n.read ? "bg-blue-700" : "bg-transparent")} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, n)}
                      className="h-5 w-5 shrink-0 rounded text-gray-300 opacity-0 hover:bg-gray-200 hover:text-gray-600 group-hover:opacity-100"
                      aria-label="Delete notification"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );

                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => handleNotificationClick(n)}>
                    {content}
                  </Link>
                ) : (
                  <button key={n.id} onClick={() => handleNotificationClick(n)} className="block w-full text-left">
                    {content}
                  </button>
                );
              })
            )}
          </div>

          <Link
            href="/dashboard/account/notifications"
            onClick={() => setOpen(false)}
            className="block border-t px-4 py-3 text-center text-sm font-medium text-blue-700 hover:bg-gray-50"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}