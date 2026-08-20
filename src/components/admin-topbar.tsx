"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ADMIN_NAV_ITEMS } from "@/components/admin-nav-items";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
  Zap,
  UserPlus,
  PackagePlus,
  PackageMinus,
  FileText,
  FileMinus,
  Pencil,
  ShoppingCart,
  GraduationCap,
  Briefcase,
  Mail,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const LAST_VIEWED_KEY = "ilab-admin-notifications-last-viewed";
const SEARCH_DEBOUNCE_MS = 300;

type ActivityItem = {
  type: string;
  title: string;
  createdAt: string;
};

// Fallback (Bell) covers any activity type not explicitly mapped here —
// this is what prevents a crash the next time a new activity type is
// logged somewhere and the topbar hasn't been updated to recognize it yet.
const ACTIVITY_ICON: Record<string, LucideIcon> = {
  user_signup: UserPlus,
  product_created: PackagePlus,
  product_deleted: PackageMinus,
  product_updated: Pencil,
  blog_post_created: FileText,
  blog_post_deleted: FileMinus,
  order_completed: ShoppingCart,
  enrollment_created: GraduationCap,
  course_created: GraduationCap,
  course_updated: Pencil,
  course_deleted: PackageMinus,
  service_created: Briefcase,
  service_updated: Pencil,
  service_deleted: PackageMinus,
  inquiry_submitted: Mail,
  comment_submitted: MessageSquare,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// One entry per searchable admin section. `param` matches whatever query
// key that section's own toolbar/table already reads (verified against
// ProductsToolbar/ServicesToolbar/InquiriesToolbar's "search", and the
// original Users search's "q" — kept as-is rather than silently renamed).
const SEARCH_SECTIONS: Record<string, { placeholder: string; param: string }> = {
  products: { placeholder: "Search products...", param: "search" },
  courses: { placeholder: "Search courses...", param: "search" },
  blog: { placeholder: "Search blog posts...", param: "search" },
  users: { placeholder: "Search users...", param: "q" },
  services: { placeholder: "Search services...", param: "search" },
  inquiries: { placeholder: "Search inquiries...", param: "search" },
  subscribers: { placeholder: "Search subscribers...", param: "search" },
  comments: { placeholder: "Search comments...", param: "search" },
};
const DEFAULT_SECTION = { placeholder: "Search users...", param: "q", basePath: "/admin/users" };

export function AdminTopbar({
  user,
  onSignOut,
}: {
  user: { name: string; email: string };
  onSignOut: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Which admin section are we in? e.g. "/admin/products/new" -> "products"
  const segment = pathname.split("/")[2] ?? "";
  const sectionConfig = SEARCH_SECTIONS[segment];
  const basePath = sectionConfig ? `/admin/${segment}` : DEFAULT_SECTION.basePath;
  const placeholder = sectionConfig?.placeholder ?? DEFAULT_SECTION.placeholder;
  const paramKey = sectionConfig?.param ?? DEFAULT_SECTION.param;

  // Only prefill from the URL when we're actually sitting on that
  // section's list page (not e.g. /admin/products/new, which has no
  // relevant query param to read).
  const initialQuery = pathname === basePath ? (searchParams.get(paramKey) ?? "") : "";

  const [query, setQuery] = useState(initialQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const isDirtyRef = useRef(false);

  // Reset the input's value (without treating it as a user edit) whenever
  // the section itself changes — e.g. navigating from Products to Courses
  // via the sidebar shouldn't carry over a stale "products" search term.
  useEffect(() => {
    isDirtyRef.current = false;
    setQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath]);

  useEffect(() => {
    const lastViewed =
      localStorage.getItem(LAST_VIEWED_KEY) ??
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    fetch(`/api/admin/notifications?since=${encodeURIComponent(lastViewed)}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, []);

  // Debounced live search — fires as the user types, not on Enter.
  useEffect(() => {
    if (!isDirtyRef.current) return;

    const handle = setTimeout(() => {
      const params = new URLSearchParams(pathname === basePath ? searchParams.toString() : "");
      if (query.trim()) {
        params.set(paramKey, query.trim());
      } else {
        params.delete(paramKey);
      }
      params.delete("page"); // reset pagination on a new search, same as every other toolbar

      const qs = params.toString();
      // scroll: false — this is the actual fix for "takes me to the start
      // of the page." router.push scrolls to top by default; we only want
      // the query param to update, not the viewport to jump.
      router.push(`${basePath}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault(); // Enter still works — just no longer required
  }

  function handleNotificationsOpenChange(open: boolean) {
    if (!open) {
      localStorage.setItem(LAST_VIEWED_KEY, new Date().toISOString());
      setItems([]);
    }
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b bg-white px-4 sm:px-6">
      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger className="flex h-9 w-9 flex-none items-center justify-center rounded-md border md:hidden">
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-none bg-neutral-900 p-0 text-neutral-300"
        >
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
                  onClick={() => setMobileOpen(false)}
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
              onClick={() => {
                setMobileOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <form
        onSubmit={handleSearchSubmit}
        className="relative hidden max-w-sm flex-1 sm:block"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            isDirtyRef.current = true;
            setQuery(e.target.value);
          }}
          placeholder={placeholder}
          className="pl-9"
        />
      </form>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => router.push(basePath, { scroll: false })}
        >
          <Search className="h-4 w-4" />
        </Button>

        <DropdownMenu onOpenChange={handleNotificationsOpenChange}>
          <DropdownMenuTrigger className="relative flex h-9 w-9 flex-none items-center justify-center rounded-full border hover:bg-muted">
            <Bell className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                {items.length > 9 ? "9+" : items.length}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {items.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {items.map((item, i) => {
                  const Icon = ACTIVITY_ICON[item.type] ?? Bell;
                  return (
                    <DropdownMenuItem key={i} className="items-start gap-2">
                      <Icon className="mt-0.5 h-4 w-4 flex-none text-blue-700" />
                      <div className="min-w-0">
                        <p className="truncate text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(item.createdAt)}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ) : (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No new activity right now.
              </div>
            )}
            {items.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/notifications")}>
                  <span className="w-full text-center text-sm font-medium text-blue-700">
                    View all
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pr-2 hover:bg-muted">
            <Avatar className="h-8 w-8 flex-none">
              <AvatarFallback className="bg-blue-700 text-xs text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline">
              {user.name}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 flex-none text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="mt-0.5 break-all text-xs text-muted-foreground">
                  {user.email}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}