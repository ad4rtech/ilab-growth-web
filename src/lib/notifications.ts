export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

export async function getNotifications(limit = 10): Promise<NotificationsResponse> {
  try {
    const res = await fetch(`/api/notifications?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) return { notifications: [], unreadCount: 0 };
    return (await res.json()) as NotificationsResponse;
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  } catch {
    // Non-blocking — UI already optimistically updates.
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await fetch(`/api/notifications`, { method: "POST" });
  } catch {
    // Non-blocking.
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}