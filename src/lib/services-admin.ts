const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AdminService {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  whatsIncluded: string[];
  duration: string | null;
  icon: string | null;
  price: number | null;
  ctaLabel: string | null;
  badge: string | null;
  category: string | null;
  serviceType: string | null;
  status: string;
  createdAt: string;
}

export interface AdminServiceListResponse {
  services: AdminService[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ServiceStats {
  totalServices: number;
  servicesCreatedThisMonth: number;
  totalInquiries: number;
  inquiriesThisMonth: number;
  inquiriesChangePercent: number | null;
  atCapacity: boolean;
  maxServices: number;
}

export interface TopService {
  service: AdminService;
  inquiries: number;
}

export interface MonthlyInquiryBucket {
  label: string;
  inquiryCount: number;
}

export interface AdminListQuery {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
}

const EMPTY_LIST: AdminServiceListResponse = { services: [], total: 0, page: 1, pageSize: 8, totalPages: 1 };

const EMPTY_STATS: ServiceStats = {
  totalServices: 0,
  servicesCreatedThisMonth: 0,
  totalInquiries: 0,
  inquiriesThisMonth: 0,
  inquiriesChangePercent: null,
  atCapacity: false,
  maxServices: 3,
};

function buildQuery(query: AdminListQuery) {
  const params = new URLSearchParams();
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  return params.toString();
}

export async function getAdminServiceList(query: AdminListQuery): Promise<AdminServiceListResponse> {
  try {
    const qs = buildQuery(query);
    const res = await fetch(`${API_URL}/services/admin-list${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    if (!res.ok) return EMPTY_LIST;
    return (await res.json()) as AdminServiceListResponse;
  } catch {
    return EMPTY_LIST;
  }
}

export async function getServiceStats(): Promise<ServiceStats> {
  try {
    const res = await fetch(`${API_URL}/services/stats`, { cache: "no-store" });
    if (!res.ok) return EMPTY_STATS;
    return (await res.json()) as ServiceStats;
  } catch {
    return EMPTY_STATS;
  }
}

export async function getTopServicesByInquiries(limit = 3): Promise<TopService[]> {
  try {
    const res = await fetch(`${API_URL}/services/top-by-inquiries?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as TopService[];
  } catch {
    return [];
  }
}

export async function getMonthlyInquiries(months = 12): Promise<MonthlyInquiryBucket[]> {
  try {
    const res = await fetch(`${API_URL}/services/monthly-inquiries?months=${months}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as MonthlyInquiryBucket[];
  } catch {
    return [];
  }
}