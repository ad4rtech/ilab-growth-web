import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatKES } from "@/lib/format";
import { SalesReportsToolbar } from "@/components/sales-reports-toolbar";
import { MonthlyBarChart } from "@/components/admin/monthly-bar-chart";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  RotateCcw,
  PieChart,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Summary = { totalRevenue: number; totalOrders: number; avgOrderValue: number };
type CategorySlice = { label: string; revenue: number; percent: number };
type TopItem = { title: string; type: "course" | "product"; revenue: number; sales: number };
type RecentOrder = {
  id: string;
  userId: string;
  total: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  itemTitle: string;
};
type MonthlyRevenuePoint = { month: string; revenue: number };

const API = process.env.NEXT_PUBLIC_API_URL;
const KEY = process.env.INTERNAL_API_KEY as string;

async function fetchAdmin<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { "x-internal-api-key": KEY },
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

function statusBadge(status: RecentOrder["status"]) {
  if (status === "completed") {
    return <Badge className="bg-green-600 hover:bg-green-600">Completed</Badge>;
  }
  if (status === "pending") {
    return <Badge variant="outline">Pending</Badge>;
  }
  // NOTE: mockup shows a "Refunded" status — there's no refund flow built,
  // so a failed/cancelled payment shows as "Failed" here, which is a
  // different (real) concept, not a substitute for refunds.
  return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Online Courses": "#1d4ed8", // blue-700
  "Digital Products": "#93c5fd", // blue-300
};

interface SalesReportsPageProps {
  searchParams: Promise<{ from?: string; to?: string; category?: string }>;
}

export default async function SalesReportsPage({ searchParams }: SalesReportsPageProps) {
  const { from, to, category } = await searchParams;

  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  if (category) qs.set("category", category);
  const filterQsOnly = qs.toString() ? `?${qs.toString()}` : "";
  const filterQsAmp = qs.toString() ? `&${qs.toString()}` : "";

  const [summary, categories, topItems, recentOrders, monthlyRevenue] = await Promise.all([
    fetchAdmin<Summary>(`/payments/admin/summary${filterQsOnly}`, {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    }),
    fetchAdmin<CategorySlice[]>(`/payments/admin/revenue-by-category${filterQsOnly}`, []),
    fetchAdmin<TopItem[]>(`/payments/admin/top-items?limit=4${filterQsAmp}`, []),
    fetchAdmin<RecentOrder[]>(`/payments/admin/recent-orders?limit=10${filterQsAmp}`, []),
    fetchAdmin<MonthlyRevenuePoint[]>("/payments/admin/monthly-revenue", []),
  ]);

  // Users live in a separate database from Orders (Better Auth vs. the
  // NestJS business DB) — resolve names/emails locally rather than
  // fabricating them or leaving raw IDs in the UI.
  const userIds = Array.from(new Set(recentOrders.map((o) => o.userId)));
  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Build a conic-gradient donut from real category percentages — no
  // charting library needed for something this simple.
  let cursor = 0;
  const gradientStops = categories
    .map((c) => {
      const start = cursor;
      cursor += c.percent;
      const color = CATEGORY_COLORS[c.label] ?? "#e5e7eb";
      return `${color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="text-2xl font-bold"
        >
          Sales Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Revenue and order performance, built from real completed orders.
        </p>
      </div>

      <SalesReportsToolbar
        exportRows={recentOrders.map((o) => ({
          id: o.id,
          customer: userMap.get(o.userId)?.name || userMap.get(o.userId)?.email || o.userId,
          item: o.itemTitle,
          amount: o.total,
          status: o.status,
          date: o.createdAt,
        }))}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatKES(summary.totalRevenue)}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="mt-1 text-2xl font-bold">{summary.totalOrders}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <ShoppingCart className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatKES(Math.round(summary.avgOrderValue))}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inactive — no refund flow exists yet (only pending/completed/failed) */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refund Rate</p>
                <p className="mt-1 text-2xl font-bold text-muted-foreground">—</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  No refund flow yet
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <RotateCcw className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue (real) + Revenue by Category (real) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <p className="font-semibold">Monthly Revenue</p>
            <p className="text-sm text-muted-foreground">
              Total revenue per month — last 12 months
            </p>
            <div className="mt-6">
              <MonthlyBarChart
                data={monthlyRevenue}
                valueKey="revenue"
                format="currency"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Revenue by Category</p>
            </div>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No revenue yet.</p>
            ) : (
              <>
                <div className="flex justify-center py-2">
                  <div
                    className="relative h-32 w-32 rounded-full"
                    style={{
                      background: `conic-gradient(${gradientStops})`,
                    }}
                  >
                    <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white text-center">
                      <p className="text-sm font-bold">
                        {formatKES(summary.totalRevenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">total</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {categories.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: CATEGORY_COLORS[c.label] ?? "#e5e7eb",
                          }}
                        />
                        {c.label}
                      </span>
                      <span className="text-muted-foreground">
                        {c.percent}% · {formatKES(c.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  No Consulting &amp; Services bucket — that epic hasn&apos;t
                  been built yet.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Revenue Products + Recent Transactions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4 font-semibold">Top Revenue Products</p>
            {topItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales yet.</p>
            ) : (
              <div className="space-y-3">
                {topItems.map((item, i) => (
                  <div
                    key={`${item.type}-${item.title}-${i}`}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === "course" ? "Course" : "Product"} ·{" "}
                          {item.sales} sale{item.sales === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatKES(item.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="mb-4 font-semibold">Recent Transactions</p>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((o) => {
                    const user = userMap.get(o.userId);
                    return (
                      <TableRow key={o.id}>
                        <TableCell>
                          <p className="font-medium">{user?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email ?? o.userId.slice(0, 8)}
                          </p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {o.itemTitle}
                        </TableCell>
                        <TableCell>{formatKES(o.total)}</TableCell>
                        <TableCell>{statusBadge(o.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}