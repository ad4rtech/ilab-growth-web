import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { DateRangeSelect } from "@/components/admin-date-range-select";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { SubscriberGrowthChart } from "@/components/admin/subscriber-growth-chart";
import { formatKES } from "@/lib/format";
import {
  Plus,
  FileText,
  Download,
  DollarSign,
  Users,
  Mail,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
} from "lucide-react";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

function initialsOf(name: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AdminSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

interface DailyRevenueBucket {
  label: string;
  revenue: number;
}

interface RecentOrder {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  itemTitle: string;
}

interface BlogPostSummary {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  category: string | null;
}

interface NewsletterStats {
  total: number;
  changePercent: number | null;
  unsubscribeRate: number | null;
  avgOpenRate: number | null;
  avgClickRate: number | null;
}

interface GrowthBucket {
  label: string;
  count: number;
}

async function fetchAdminJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "x-internal-api-key": INTERNAL_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function getRecentBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_URL}/blog-posts/admin-list?pageSize=3`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.posts ?? []) as BlogPostSummary[];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const now = Date.now();
  const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const prev7 = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    usersLast7,
    usersPrev7,
    recentUsers,
    summary,
    ordersThisMonth,
    dailyRevenue,
    recentOrders,
    recentBlogPosts,
    newsletterStats,
    subscriberGrowth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: last7 } } }),
    prisma.user.count({ where: { createdAt: { gte: prev7, lt: last7 } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { name: true, email: true, role: true, createdAt: true, image: true },
    }),
    fetchAdminJson<AdminSummary>("/payments/admin/summary", { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }),
    fetchAdminJson<{ count: number }>("/payments/admin/orders-this-month", { count: 0 }),
    fetchAdminJson<DailyRevenueBucket[]>("/payments/admin/daily-revenue?days=7", []),
    fetchAdminJson<RecentOrder[]>("/payments/admin/recent-orders?limit=5", []),
    getRecentBlogPosts(),
    fetchAdminJson<NewsletterStats>("/newsletter/stats", {
      total: 0,
      changePercent: null,
      unsubscribeRate: null,
      avgOpenRate: null,
      avgClickRate: null,
    }),
    fetchAdminJson<GrowthBucket[]>("/newsletter/growth?months=12", []),
  ]);

  const userGrowthPct =
    usersPrev7 === 0
      ? usersLast7 > 0
        ? 100
        : 0
      : Math.round(((usersLast7 - usersPrev7) / usersPrev7) * 100);

  // Cross-DB resolve: recentOrders only has raw userId (Order lives in the
  // api DB, User lives here) — batch-resolve names in this layer, same
  // pattern already used elsewhere for admin recent-orders displays.
  const orderUserIds = [...new Set(recentOrders.map((o) => o.userId))];
  const orderUsers = orderUserIds.length
    ? await prisma.user.findMany({
        where: { id: { in: orderUserIds } },
        select: { id: true, name: true, email: true, image: true },
      })
    : [];
  const orderUserMap = new Map(orderUsers.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="text-2xl font-bold"
        >
          Dashboard
        </h1>
        <DateRangeSelect />
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/blog/new" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/sales-reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              View Sales Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm text-muted-foreground">Total Revenue</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <DollarSign className="h-4 w-4 text-blue-700" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(summary.totalRevenue)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {summary.totalOrders} order{summary.totalOrders === 1 ? "" : "s"} all-time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm text-muted-foreground">Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-4 w-4 text-blue-700" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {userGrowthPct >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              )}
              <span className={userGrowthPct >= 0 ? "text-green-600" : "text-red-600"}>
                {userGrowthPct >= 0 ? "+" : ""}
                {userGrowthPct}%
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm text-muted-foreground">Email Subscribers</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Mail className="h-4 w-4 text-blue-700" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.total.toLocaleString()}</div>
            {newsletterStats.changePercent === null ? (
              <p className="mt-1 text-xs text-muted-foreground">No prior month data yet</p>
            ) : (
              <div className="mt-1 flex items-center gap-1 text-xs">
                {newsletterStats.changePercent >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                )}
                <span className={newsletterStats.changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                  {newsletterStats.changePercent >= 0 ? "+" : ""}
                  {newsletterStats.changePercent}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm text-muted-foreground">Orders This Month</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ShoppingCart className="h-4 w-4 text-blue-700" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersThisMonth.count.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <p className="font-semibold">Revenue — Last 7 Days</p>
              <p className="text-sm text-muted-foreground">
                Daily sales across all products & courses
              </p>
            </div>
            <DateRangeSelect variant="compact" />
          </CardHeader>
          <CardContent>
            {dailyRevenue.some((d) => d.revenue > 0) ? (
              <RevenueChart data={dailyRevenue} />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  No sales data yet
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  This chart will populate automatically once your store starts
                  processing orders.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-semibold">Subscriber Growth</p>
            <p className="text-sm text-muted-foreground">Last 12 months</p>
          </CardHeader>
          <CardContent>
            {subscriberGrowth.some((d) => d.count > 0) ? (
              <SubscriberGrowthChart data={subscriberGrowth} />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  No subscribers yet
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  This chart fills in as people subscribe to your newsletter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <p className="font-semibold">Recent Sales</p>
            <Link
              href="/admin/sales-reports"
              className="text-sm text-blue-700 hover:underline"
            >
              View report
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No sales yet. This list fills in once orders start coming
                  through.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const buyer = orderUserMap.get(order.userId);
                  return (
                    <div key={order.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{order.itemTitle}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {buyer?.name || buyer?.email || "Unknown buyer"}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{formatKES(order.total)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <p className="font-semibold">Blog Posts</p>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-1 text-sm text-blue-700 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              New Post
            </Link>
          </CardHeader>
          <CardContent>
            {recentBlogPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No blog posts yet. Create your first post to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/blog/${post.id}/edit`}
                    className="flex items-center justify-between gap-3 hover:opacity-70"
                  >
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <Badge variant={post.status === "published" ? "default" : "outline"} className="shrink-0">
                      {post.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <p className="font-semibold">Recent Users</p>
            <Link
              href="/admin/users"
              className="text-sm text-blue-700 hover:underline"
            >
              Manage all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No users yet.
              </p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.email} className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 flex-none">
                    <AvatarImage src={u.image ?? undefined} alt={u.name ?? ""} />
                    <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                      {initialsOf(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {u.name || "—"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                  <Badge variant={u.role === "admin" ? "default" : "outline"}>
                    {u.role}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}