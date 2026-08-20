const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface MyInquiry {
  id: string;
  referenceCode: string;
  serviceTitle: string | null;
  status: string;
  inquiryType: string;
  createdAt: string;
}

export async function getMyInquiries(email: string): Promise<MyInquiry[]> {
  if (!email) return [];
  try {
    const res = await fetch(`${API_URL}/services/inquiries/my?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as MyInquiry[];
  } catch {
    return [];
  }
}