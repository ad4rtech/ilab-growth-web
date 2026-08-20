import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { ActiveSessions } from "@/components/account/active-sessions";
import { TwoFactorCard } from "@/components/account/two-factor-card";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function AccountSecurityPage() {
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
      <DashboardHeader
        fullName={user.name ?? "there"}
        userId={userId}
        imageUrl={user.image ?? null}
        initialCartCount={cartCount}
      />
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
                Security
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your password and see where you&apos;re signed in.
              </p>
            </div>

            <ChangePasswordForm />
            <ActiveSessions />
            <TwoFactorCard />
          </div>
        </div>
      </main>
      <DashboardFooter />
    </>
  );
}