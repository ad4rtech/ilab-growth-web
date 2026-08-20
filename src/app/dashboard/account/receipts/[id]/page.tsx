import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { PrintableReceipt } from "@/components/account/printable-receipt";
import { getReceipt } from "@/lib/orders";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function ReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as typeof session.user & { banned?: boolean };
  const userId = user.id;

  const [receipt, orderCount, savedCount, cartCount] = await Promise.all([
    getReceipt(id, userId),
    getOrderCount(userId),
    getSavedItemsCount(userId),
    getCartCount(userId),
  ]);

  if (!receipt) notFound();

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
          <div className="max-w-2xl flex-1">
            <PrintableReceipt receipt={receipt} />
          </div>
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}