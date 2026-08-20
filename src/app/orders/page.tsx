import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { OrdersList } from "@/components/orders/orders-list";
import { getOrdersForUser } from "@/lib/orders";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/orders");

  const user = session.user as typeof session.user & { role?: string };
  if (user.role === "admin") redirect("/admin");

  const userId = user.id;
  const [orders, cartCount] = await Promise.all([getOrdersForUser(userId), getCartCount(userId)]);

  return (
    <>
      <DashboardHeader
        fullName={user.name ?? "there"}
        userId={userId}
        imageUrl={user.image ?? null}
        initialCartCount={cartCount}
      />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Your full order history.</p>

        <div className="mt-6">
          <OrdersList initialOrders={orders} />
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}