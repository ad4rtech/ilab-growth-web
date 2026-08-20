// src/components/admin/products-pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: URLSearchParams;
}

function pageHref(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params.toString());
  if (page <= 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  const qs = next.toString();
  return `/admin/products${qs ? `?${qs}` : ""}`;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function ProductsPagination({
  currentPage,
  totalPages,
  searchParams,
}: ProductsPaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center gap-2">
      <Link
        href={pageHref(searchParams, Math.max(1, currentPage - 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border",
          currentPage === 1
            ? "pointer-events-none text-gray-300"
            : "text-gray-600 hover:bg-gray-50",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(searchParams, page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm",
              page === currentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50",
            )}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={pageHref(searchParams, Math.min(totalPages, currentPage + 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border",
          currentPage === totalPages
            ? "pointer-events-none text-gray-300"
            : "text-gray-600 hover:bg-gray-50",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}