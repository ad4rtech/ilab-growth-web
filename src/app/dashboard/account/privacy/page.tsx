import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Database, Server, FileText, ArrowUpRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function AccountPrivacyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = session.user as typeof session.user & { banned?: boolean };
  const userId = user.id;
  const [orderCount, savedCount, cartCount] = await Promise.all([
    getOrderCount(userId),
    getSavedItemsCount(userId),
    getCartCount(userId),
  ]);

  return (
    <>
      <DashboardHeader fullName={user.name ?? "there"} userId={userId} initialCartCount={cartCount} />
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

          <div className="flex-1 space-y-6">
            <div>
              <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
                Privacy &amp; Data
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                An overview of what we store about you and where it lives.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                <div>
                  <h2 className="font-bold text-gray-900">Account & Profile Data</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your name, email, phone, business details, and profile photo link are stored
                    in our authentication system, separate from your purchase history.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-start gap-3">
                <Server className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                <div>
                  <h2 className="font-bold text-gray-900">Orders, Courses & Inquiries</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your orders, course enrollments, cart, favourites, and service inquiries are
                    stored in a separate business-data system, linked to your account only by an
                    internal ID — not your name or email directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                <div>
                  <h2 className="font-bold text-gray-900">Full Privacy Policy</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For the complete terms on how your data is collected, used, and protected,
                    see our Privacy Policy.
                  </p>
                  <Link
                    href="/privacy"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
                  >
                    Read Privacy Policy
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-xs text-muted-foreground">
              Self-service data export and account deletion aren&apos;t available yet — if you
              need either, contact support directly.
            </div>
          </div>
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}