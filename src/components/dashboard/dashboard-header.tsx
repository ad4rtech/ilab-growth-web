"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getCartCount } from "@/lib/cart";
import { signOut } from "@/lib/auth-client";
import { NotificationBell } from "@/components/dashboard/notification-bell";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/courses", label: "Courses" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function isActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

interface DashboardHeaderProps {
  fullName: string;
  userId: string;
  imageUrl?: string | null;
  initialCartCount?: number;
}

export function DashboardHeader({ fullName, userId, imageUrl, initialCartCount = 0 }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(initialCartCount);
  const firstName = fullName.trim().split(/\s+/)[0] ?? fullName;
  const initials = getInitials(fullName);

  useEffect(() => {
    function handleCartUpdated(e: Event) {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") setCartCount(detail);
    }
    window.addEventListener("cart:updated", handleCartUpdated);
    return () => window.removeEventListener("cart:updated", handleCartUpdated);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          >
            iL
          </span>
          <span style={{ fontFamily: "var(--font-ubuntu)" }} className="text-lg font-bold text-gray-900">
            iLab <span className="text-orange-600">Growth</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(pathname, link.href)
                  ? "text-sm font-semibold text-blue-700"
                  : "text-sm font-medium text-gray-600 hover:text-blue-700"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="rounded-full border border-blue-700 px-4 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-700 hover:text-white"
          >
            Contact Us
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </span>
              <span className="text-sm font-medium text-gray-900">{firstName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/dashboard/account/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(pathname, link.href) ? "text-sm font-semibold text-blue-700" : "text-sm font-medium text-gray-700"}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
            <Link
              href="/dashboard/account/notifications"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              Notifications
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="inline-flex w-fit items-center rounded-full border border-blue-700 px-4 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-700 hover:text-white"
            >
              Contact Us
            </Link>
            <div className="mt-2 flex items-center gap-3 border-t pt-4">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </span>
              <span className="text-sm font-medium text-gray-900">{firstName}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setMobileOpen(false);
                router.push("/dashboard/account/profile");
              }}
            >
              Settings
            </Button>
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm font-medium text-red-600">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}