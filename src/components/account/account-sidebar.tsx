"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Lock,
  Bell,
  Package,
  GraduationCap,
  ClipboardCheck,
  Bookmark,
  ShieldCheck,
  LogOut,
  FileText
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface AccountSidebarProps {
  name: string;
  email: string;
  imageUrl: string | null;
  emailVerified: boolean;
  banned: boolean;
  orderCount: number;
  savedCount: number;
}

const NAV_ITEMS = [
  { href: "/dashboard/account/profile", label: "Profile", icon: User },
  { href: "/dashboard/account/security", label: "Security", icon: Lock },
  { href: "/dashboard/account/notifications", label: "Notifications", icon: Bell },
  { href: "/cart?tab=library", label: "My Library", icon: Package },
  { href: "/dashboard/courses", label: "My Learning", icon: GraduationCap },
  { href: "/orders", label: "Order History", icon: ClipboardCheck, countKey: "orderCount" as const },
  { href: "/dashboard/account/receipts", label: "Receipts", icon: FileText },
  { href: "/dashboard/account/saved", label: "Saved Items", icon: Bookmark, countKey: "savedCount" as const },
  { href: "/dashboard/account/privacy", label: "Privacy & Data", icon: ShieldCheck },
];

export function AccountSidebar({
  name,
  email,
  imageUrl,
  emailVerified,
  banned,
  orderCount,
  savedCount,
}: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = getInitials(name);

  const statusLabel = banned ? "Suspended" : !emailVerified ? "Unverified" : "Active member";
  const statusColor = banned ? "bg-red-500" : !emailVerified ? "bg-orange-500" : "bg-green-500";

  const counts = { orderCount, savedCount };

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="w-full max-w-xs shrink-0 border-r pr-6">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <p className="mt-3 font-bold text-gray-900">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
        <span className="mt-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          <span className={cn("h-1.5 w-1.5 rounded-full", statusColor)} />
          {statusLabel}
        </span>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Account Settings</p>
        <nav className="mt-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const count = item.countKey ? counts[item.countKey] : undefined;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                  active ? "bg-blue-50 font-medium text-blue-700" : "text-gray-600 hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {count != null && count > 0 && (
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white",
                      active ? "bg-blue-700" : "bg-orange-500",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-6 flex w-full items-center gap-2.5 border-t px-3 py-3 text-sm text-gray-500 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}