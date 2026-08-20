"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { LogOut, Zap } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/components/admin-nav-items";
import { AdminTopbar } from "@/components/admin-topbar";

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - desktop only */}
      <aside className="hidden w-64 flex-none flex-col bg-neutral-900 text-neutral-300 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
            <Zap className="h-4 w-4 text-white" fill="currentColor" />
          </span>
          <div>
            <p
              style={{ fontFamily: "var(--font-ubuntu)" }}
              className="text-sm font-bold text-white"
            >
              iLab Growth
            </p>
            <p className="text-xs text-neutral-500">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-blue-700 font-medium text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-800 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <AdminTopbar user={user} onSignOut={handleSignOut} />
        <main className="flex-1 overflow-x-hidden bg-muted/20 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}