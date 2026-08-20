const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  message: string | null;
  inquiryType: string;
  status: string;
  createdAt: string;
  service: { id: string; title: string } | null;
}

export interface AdminInquiryListResponse {
  inquiries: AdminInquiry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface InquiryStats {
  total: number;
  general: number;
  call: number;
  statusNew: number;
  statusContacted: number;
  statusClosed: number;
}

export interface AdminInquiryListQuery {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
}

const EMPTY_LIST: AdminInquiryListResponse = {
  inquiries: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

const EMPTY_STATS: InquiryStats = {
  total: 0,
  general: 0,
  call: 0,
  statusNew: 0,
  statusContacted: 0,
  statusClosed: 0,
};

function buildQuery(query: AdminInquiryListQuery) {
  const params = new URLSearchParams();
  if (query.type && query.type !== "all") params.set("type", query.type);
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  return params.toString();
}

export async function getAdminInquiryList(query: AdminInquiryListQuery): Promise<AdminInquiryListResponse> {
  try {
    const qs = buildQuery(query);
    const res = await fetch(`${API_URL}/services/inquiries/admin-list${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_LIST;
    return (await res.json()) as AdminInquiryListResponse;
  } catch {
    return EMPTY_LIST;
  }
}

export async function getInquiryStats(): Promise<InquiryStats> {
  try {
    const res = await fetch(`${API_URL}/services/inquiries/stats`, { cache: "no-store" });
    if (!res.ok) return EMPTY_STATS;
    return (await res.json()) as InquiryStats;
  } catch {
    return EMPTY_STATS;
  }
}