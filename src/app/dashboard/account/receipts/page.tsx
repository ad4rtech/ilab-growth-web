import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { getOrdersForUser } from "@/lib/orders";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";
import { formatKES } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as typeof session.user & { banned?: boolean };
  const userId = user.id;

  const [orders, orderCount, savedCount, cartCount] = await Promise.all([
    getOrdersForUser(userId),
    getOrderCount(userId),
    getSavedItemsCount(userId),
    getCartCount(userId),
  ]);

  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <>
      <DashboardHeader fullName={user.name ?? "there"} userId={userId} imageUrl={user.image ?? null} initialCartCount={cartCount} />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <AccountSidebar
            name={user.name ?? "there"}
            email={user.email}
            imageUrl={user.image ?? null}
            emailVerified={!!user.emailVerified}
            banned={!!user.banned}
            orderCount={orderCount}
            savedCount={savedCount}
          />

          <div className="flex-1">
            <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
              Receipts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">View and print receipts for your completed purchases.</p>

            {completedOrders.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No completed purchases yet.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                {completedOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/account/receipts/${order.id}`}
                    className="flex items-center justify-between rounded-xl border bg-white p-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{order.item?.title ?? "Order"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {order.mpesaReceiptNumber && ` · ${order.mpesaReceiptNumber}`}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatKES(order.total)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}