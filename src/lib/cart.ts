const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface CartLineItem {
  id: string;
  quantity: number;
  productId: string | null;
  courseId: string | null;
  product: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    category: string | null;
    productType: string | null;
    imageUrl: string | null;
  } | null;
  course: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    category: string | null;
    level: string | null;
    thumbnailUrl: string | null;
    lessonCount: number | null;
    durationLabel: string | null;
  } | null;
}

export async function getCartCount(userId: string): Promise<number> {
  if (!userId) return 0;
  try {
    const res = await fetch(`${API_URL}/cart/count?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return 0;
  }
}

export async function getCartItems(userId: string): Promise<CartLineItem[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/cart/items?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as CartLineItem[];
  } catch {
    return [];
  }
}

export async function addProductToCart(userId: string, productId: string, quantity = 1): Promise<number | null> {
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

export async function addCourseToCart(userId: string, courseId: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, quantity: 1 }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

export async function updateCartItemQuantity(id: string, userId: string, quantity: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_URL}/cart/items/${id}?userId=${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}

export async function removeCartItem(id: string, userId: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_URL}/cart/items/${id}?userId=${userId}`, { method: "DELETE" });
    if (!res.ok) return null;
    const data = (await res.json()) as { count: number };
    return data.count;
  } catch {
    return null;
  }
}