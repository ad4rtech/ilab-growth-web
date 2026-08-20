"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-700 text-xs font-bold text-white">
            iL
          </span>
          <span
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="text-base font-bold"
          >
            iLab <span className="text-orange-500">Growth</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(pathname, link.href)
                  ? "text-sm font-semibold text-blue-700"
                  : "text-sm text-muted-foreground hover:text-blue-700"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login?redirect=/cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-full border border-blue-700 px-4 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-700 hover:text-white sm:inline-block"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="hidden text-sm font-medium hover:underline sm:inline"
          >
            Sign In
          </Link>
          <Button asChild size="sm" className="bg-blue-700 hover:bg-blue-800">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}