// src/lib/subscribers-admin.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const INTERNAL_KEY = process.env.INTERNAL_API_KEY as string;

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  status: string;
  subscribedAt: string;
}

export interface SubscriberListResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SubscriberStats {
  total: number;
  changePercent: number | null;
  unsubscribeRate: number | null;
  avgOpenRate: number | null;
  avgClickRate: number | null;
}

export interface SourceBreakdown {
  source: string;
  count: number;
}

export interface GrowthBucket {
  label: string;
  count: number;
}

export interface Campaign {
  id: string;
  subject: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  createdAt: string;
  openRate: number | null;
  clickRate: number | null;
}

export interface SubscriberQuery {
  status?: string;
  search?: string;
  page?: number;
}

const authHeaders = { "x-internal-api-key": INTERNAL_KEY };

export async function getSubscriberStats(): Promise<SubscriberStats> {
  try {
    const res = await fetch(`${API_URL}/newsletter/stats`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    return (await res.json()) as SubscriberStats;
  } catch {
    return { total: 0, changePercent: null, unsubscribeRate: null, avgOpenRate: null, avgClickRate: null };
  }
}

export async function getSourceBreakdown(): Promise<SourceBreakdown[]> {
  try {
    const res = await fetch(`${API_URL}/newsletter/source-breakdown`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as SourceBreakdown[];
  } catch {
    return [];
  }
}

export async function getSubscriberGrowth(months = 12): Promise<GrowthBucket[]> {
  try {
    const res = await fetch(`${API_URL}/newsletter/growth?months=${months}`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as GrowthBucket[];
  } catch {
    return [];
  }
}

export async function getAdminSubscribers(query: SubscriberQuery): Promise<SubscriberListResponse> {
  try {
    const params = new URLSearchParams();
    if (query.status && query.status !== "all") params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.page) params.set("page", String(query.page));

    const res = await fetch(`${API_URL}/newsletter/admin-list?${params.toString()}`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    return (await res.json()) as SubscriberListResponse;
  } catch {
    return { subscribers: [], total: 0, page: 1, pageSize: 8, totalPages: 1 };
  }
}

export async function getCampaigns(): Promise<{ campaigns: Campaign[]; total: number }> {
  try {
    const res = await fetch(`${API_URL}/newsletter/campaigns`, {
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) throw new Error();
    return (await res.json()) as { campaigns: Campaign[]; total: number };
  } catch {
    return { campaigns: [], total: 0 };
  }
}