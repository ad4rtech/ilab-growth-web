const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface FavouriteEntry {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    category: string | null;
    productType: string | null;
    badge: string | null;
    imageUrl: string | null;
    createdAt: string;
  };
}

export async function getFavouriteIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/favourites/ids?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as string[];
  } catch {
    return [];
  }
}

export async function getFavourites(userId: string): Promise<FavouriteEntry[]> {
  if (!userId) return [];
  try {
    const res = await fetch(`${API_URL}/favourites?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as FavouriteEntry[];
  } catch {
    return [];
  }
}

export async function toggleFavourite(userId: string, productId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/favourites/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { favourited: boolean };
    return data.favourited;
  } catch {
    return false;
  }
}