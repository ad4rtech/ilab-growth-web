import type { PublicBlogPost } from "@/lib/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getSavedPosts(userId: string): Promise<PublicBlogPost[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/saved?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as PublicBlogPost[];
  } catch {
    return [];
  }
}

export async function getSavedIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/saved-ids?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as string[];
  } catch {
    return [];
  }
}

export interface MostViewedEntry {
  post: PublicBlogPost;
  viewCount: number;
}

export async function getMyMostViewed(userId: string, limit = 3): Promise<MostViewedEntry[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/most-viewed-by-me?userId=${userId}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as MostViewedEntry[];
  } catch {
    return [];
  }
}

export async function toggleSavePost(userId: string, blogPostId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/${blogPostId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { saved: boolean };
    return data.saved;
  } catch {
    return false;
  }
}