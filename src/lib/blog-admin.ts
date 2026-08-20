// src/lib/blog-admin.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AdminBlogPost {
  id: string;
  title: string;
  category: string | null;
  authorName: string | null;
  status: string;
  displayStatus: string; // "draft" | "published" | "scheduled"
  viewCount: number;
  commentCount: number;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface AdminBlogListResponse {
  posts: AdminBlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogStats {
  totalPosts: number;
  postsThisQuarter: number;
  totalViews: number;
  viewsChangePercent: number | null;
  totalComments: number;
  commentsChangePercent: number | null;
}

export interface TopAuthor {
  authorName: string;
  postCount: number;
  authorAvatarUrl: string | null;
}

export interface MonthlyViewsBucket {
  label: string;
  views: number;
}

export interface NewsletterStats {
  total: number;
  changePercent: number | null;
}

export interface AdminBlogListQuery {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
}

const EMPTY_LIST: AdminBlogListResponse = {
  posts: [],
  total: 0,
  page: 1,
  pageSize: 8,
  totalPages: 1,
};

const EMPTY_STATS: BlogStats = {
  totalPosts: 0,
  postsThisQuarter: 0,
  totalViews: 0,
  viewsChangePercent: null,
  totalComments: 0,
  commentsChangePercent: null,
};

function buildQuery(query: AdminBlogListQuery) {
  const params = new URLSearchParams();
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  return params.toString();
}

export async function getAdminBlogList(query: AdminBlogListQuery): Promise<AdminBlogListResponse> {
  try {
    const qs = buildQuery(query);
    const res = await fetch(`${API_URL}/blog-posts/admin-list${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_LIST;
    return (await res.json()) as AdminBlogListResponse;
  } catch {
    return EMPTY_LIST;
  }
}

export async function getBlogStats(): Promise<BlogStats> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/stats`, { cache: "no-store" });
    if (!res.ok) return EMPTY_STATS;
    return (await res.json()) as BlogStats;
  } catch {
    return EMPTY_STATS;
  }
}

export async function getTopAuthors(limit = 4): Promise<TopAuthor[]> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/top-authors?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as TopAuthor[];
  } catch {
    return [];
  }
}

export async function getMonthlyViews(months = 12): Promise<MonthlyViewsBucket[]> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/monthly-views?months=${months}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as MonthlyViewsBucket[];
  } catch {
    return [];
  }
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  try {
    const res = await fetch(`${API_URL}/newsletter/stats`, { cache: "no-store" });
    if (!res.ok) return { total: 0, changePercent: null };
    return (await res.json()) as NewsletterStats;
  } catch {
    return { total: 0, changePercent: null };
  }
}