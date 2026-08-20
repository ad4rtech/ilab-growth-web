const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface Service {
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

export async function getPublishedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    const all = (await res.json()) as Service[];
    return all.filter((s) => s.status === "published");
  } catch {
    return [];
  }
}

export interface SubmitInquiryPayload {
  serviceId?: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
  inquiryType?: "general" | "call";
}

export async function submitServiceInquiry(
  payload: SubmitInquiryPayload,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/services/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: data?.message ?? "Could not submit inquiry." };
    return { success: true };
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function getCallBookingCount(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/services/inquiries/call-count`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return 0;
  }
}