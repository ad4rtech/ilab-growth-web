import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { ProfileForm } from "@/components/account/profile-form";
import { getOrderCount, getSavedItemsCount } from "@/lib/account";
import { getCartCount } from "@/lib/cart";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  const user = session.user as typeof session.user & {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
    businessName?: string;
    industry?: string;
    businessStage?: string;
    banned?: boolean;
    updatedAt?: string;
  };

  const userId = user.id;
  const [orderCount, savedCount, cartCount] = await Promise.all([
    getOrderCount(userId),
    getSavedItemsCount(userId),
    getCartCount(userId),
  ]);

  const nameParts = (user.name ?? "").split(" ");

  return (
    <>
      <DashboardHeader fullName={user.name ?? "there"} userId={userId} initialCartCount={cartCount} />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:underline">
            Account
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900">Profile</span>
        </nav>

        <div className="mt-6 flex flex-col gap-10 lg:flex-row">
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
            <ProfileForm
              initial={{
                firstName: user.firstName ?? nameParts[0] ?? "",
                lastName: user.lastName ?? nameParts.slice(1).join(" ") ?? "",
                email: user.email,
                emailVerified: !!user.emailVerified,
                phone: user.phone ?? "",
                country: user.country ?? "",
                city: user.city ?? "",
                businessName: user.businessName ?? "",
                industry: user.industry ?? "",
                businessStage: user.businessStage ?? "",
                imageUrl: user.image ?? "",
                updatedAt: user.updatedAt ?? null,
              }}
            />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </>
  );
}