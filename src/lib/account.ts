const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getOrderCount(userId: string): Promise<number> {
  if (!userId) return 0;
  try {
    const res = await fetch(`${API_URL}/payments/orders?userId=${userId}`, { cache: "no-store" });
    if (!res.ok) return 0;
    const orders: Array<{ status: string }> = await res.json();
    return orders.length;
  } catch {
    return 0;
  }
}

export async function getSavedItemsCount(userId: string): Promise<number> {
  if (!userId) return 0;
  try {
    const [favRes, blogRes] = await Promise.all([
      fetch(`${API_URL}/favourites/ids?userId=${userId}`, { cache: "no-store" }),
      fetch(`${API_URL}/blog-posts/public/saved-ids?userId=${userId}`, { cache: "no-store" }),
    ]);
    const favIds = favRes.ok ? await favRes.json() : [];
    const blogIds = blogRes.ok ? await blogRes.json() : [];
    return (favIds as string[]).length + (blogIds as string[]).length;
  } catch {
    return 0;
  }
}