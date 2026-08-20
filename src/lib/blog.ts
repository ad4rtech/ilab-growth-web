// src/lib/blog.ts
// Server-side fetch helpers for the public blog. Mirrors the pattern used
// for /products (real data, no fabrication, honest fallback on failure).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  readTimeMinutes: number | null;
  viewCount: number;
  tags: string[];
  isPopular: boolean;
  isNew: boolean;
}

export interface PublicBlogResponse {
  posts: PublicBlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryCounts {
  all: number;
  categories: { name: string; count: number }[];
}

export interface TagCount {
  name: string;
  count: number;
}

export interface PublicBlogQuery {
  page?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: "recent" | "oldest" | "popular";
}

const EMPTY_LIST: PublicBlogResponse = {
  posts: [],
  total: 0,
  page: 1,
  pageSize: 6,
  totalPages: 1,
};

function buildQueryString(query: PublicBlogQuery) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.tag) params.set("tag", query.tag);
  if (query.search) params.set("search", query.search);
  if (query.sort) params.set("sort", query.sort);
  return params.toString();
}

export async function getPublicBlogPosts(query: PublicBlogQuery): Promise<PublicBlogResponse> {
  try {
    const qs = buildQueryString(query);
    const res = await fetch(`${API_URL}/blog-posts/public${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_LIST;
    return (await res.json()) as PublicBlogResponse;
  } catch {
    // Backend unreachable — fail honestly with an empty list, never fake posts.
    return EMPTY_LIST;
  }
}

export async function getBlogPostBySlug(slug: string, userId?: string): Promise<PublicBlogPost | null> {
  try {
    const qs = userId ? `?userId=${userId}` : "";
    const res = await fetch(`${API_URL}/blog-posts/public/${slug}${qs}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as PublicBlogPost;
  } catch {
    return null;
  }
}

export async function getBlogCategoryCounts(): Promise<CategoryCounts> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/categories`, { cache: "no-store" });
    if (!res.ok) return { all: 0, categories: [] };
    return (await res.json()) as CategoryCounts;
  } catch {
    return { all: 0, categories: [] };
  }
}

export async function getBlogTags(): Promise<TagCount[]> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/tags`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as TagCount[];
  } catch {
    return [];
  }
}

export async function getPopularBlogPosts(limit = 4): Promise<PublicBlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/public/popular?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as PublicBlogPost[];
  } catch {
    return [];
  }
}

export function formatBlogDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}