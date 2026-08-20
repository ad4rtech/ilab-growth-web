// src/lib/products-admin.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface AdminProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  category: string | null;
  productType: string | null;
  badge: string | null;
  status: string;
  fileUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface AdminProductListResponse {
  products: AdminProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductStats {
  totalProducts: number;
  productsCreatedThisMonth: number;
  productRevenue: number;
  totalSales: number;
  salesChangePercent: number | null;
  downloadsToday: number | null;
}

export interface TopProduct {
  product: AdminProduct;
  sales: number;
  revenue: number;
}

export interface MonthlySalesBucket {
  label: string;
  unitsSold: number;
}

export interface AdminListQuery {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
}

const EMPTY_LIST: AdminProductListResponse = {
  products: [],
  total: 0,
  page: 1,
  pageSize: 8,
  totalPages: 1,
};

const EMPTY_STATS: ProductStats = {
  totalProducts: 0,
  productsCreatedThisMonth: 0,
  productRevenue: 0,
  totalSales: 0,
  salesChangePercent: null,
  downloadsToday: null,
};

function buildQuery(query: AdminListQuery) {
  const params = new URLSearchParams();
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.category && query.category !== "all") params.set("category", query.category);
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  return params.toString();
}

export async function getAdminProductList(query: AdminListQuery): Promise<AdminProductListResponse> {
  try {
    const qs = buildQuery(query);
    const res = await fetch(`${API_URL}/products/admin-list${qs ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_LIST;
    return (await res.json()) as AdminProductListResponse;
  } catch {
    return EMPTY_LIST;
  }
}

export async function getProductStats(): Promise<ProductStats> {
  try {
    const res = await fetch(`${API_URL}/products/stats`, { cache: "no-store" });
    if (!res.ok) return EMPTY_STATS;
    return (await res.json()) as ProductStats;
  } catch {
    return EMPTY_STATS;
  }
}

export async function getTopProductsByRevenue(limit = 3): Promise<TopProduct[]> {
  try {
    const res = await fetch(`${API_URL}/products/top-by-revenue?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as TopProduct[];
  } catch {
    return [];
  }
}

export async function getMonthlySales(months = 12): Promise<MonthlySalesBucket[]> {
  try {
    const res = await fetch(`${API_URL}/products/monthly-sales?months=${months}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as MonthlySalesBucket[];
  } catch {
    return [];
  }
}