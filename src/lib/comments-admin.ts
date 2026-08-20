// src/lib/comments-admin.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AdminComment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: string;
  createdAt: string;
  blogPost: { title: string; slug: string };
}

export interface AdminCommentListResponse {
  comments: AdminComment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: { pending: number; approved: number; spam: number };
}

export interface AdminCommentQuery {
  status?: string;
  search?: string;
  page?: number;
}

const EMPTY: AdminCommentListResponse = {
  comments: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  counts: { pending: 0, approved: 0, spam: 0 },
};

// Server-side only — this list contains commenter emails, so it's fetched
// with the internal key directly (same pattern as the products/blog
// dashboard stats), not exposed through an unauthenticated route.
export async function getAdminComments(query: AdminCommentQuery): Promise<AdminCommentListResponse> {
  try {
    const params = new URLSearchParams();
    if (query.status && query.status !== "all") params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.page) params.set("page", String(query.page));

    const res = await fetch(
      `${API_URL}/blog-posts/comments/admin-list?${params.toString()}`,
      {
        headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY as string },
        cache: "no-store",
      },
    );
    if (!res.ok) return EMPTY;
    return (await res.json()) as AdminCommentListResponse;
  } catch {
    return EMPTY;
  }
}