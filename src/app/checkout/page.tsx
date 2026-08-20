import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { getCartItems, getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/checkout");

  const user = session.user as typeof session.user & { role?: string };
  if (user.role === "admin") redirect("/admin");

  const userId = user.id;
  const [items, cartCount] = await Promise.all([getCartItems(userId), getCartCount(userId)]);

  if (items.length === 0) redirect("/cart");

  const nameParts = (user.name ?? "").trim().split(/\s+/);

  return (
    <>
      <DashboardHeader
        fullName={user.name ?? "there"}
        userId={userId}
        imageUrl={user.image ?? null}
        initialCartCount={cartCount}
      />
      <CheckoutFlow
        items={items}
        defaultFirstName={nameParts[0] ?? ""}
        defaultLastName={nameParts.slice(1).join(" ") ?? ""}
        defaultEmail={user.email}
      />
      <DashboardFooter />
    </>
  );
}