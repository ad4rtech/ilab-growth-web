const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface OrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  mpesaReceiptNumber: string | null;
  item: { type: "product" | "course"; id: string; title: string; fileUrl?: string | null } | null;
}

export interface ReceiptItem {
  title: string;
  quantity: number;
  price: number;
}

export interface FullReceipt {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  mpesaReceiptNumber: string | null;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingEmail: string | null;
  items: ReceiptItem[];
}

export async function getOrdersForUser(userId: string): Promise<OrderSummary[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/payments/orders?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as OrderSummary[];
  } catch {
    return [];
  }
}

export async function getReceipt(orderId: string, userId: string): Promise<FullReceipt | null> {
  try {
    const res = await fetch(`${API_URL}/payments/orders/${orderId}/receipt?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as FullReceipt;
  } catch {
    return null;
  }
}

export async function hideOrder(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/orders/${orderId}/hide`, { method: "PATCH" });
    return res.ok;
  } catch {
    return false;
  }
}