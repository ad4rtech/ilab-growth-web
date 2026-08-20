import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersTable, type AdminUser } from "@/components/users-table";
import { UsersToolbarButtons } from "@/components/users-toolbar-buttons";
import { UsersFilterForm } from "@/components/users-filter-form";
import { MonthlyBarChart } from "@/components/admin/monthly-bar-chart";
import { formatKES } from "@/lib/format";
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "unverified", label: "Unverified" },
  { value: "suspended", label: "Suspended" },
];

function statusWhere(status: string, now: Date) {
  switch (status) {
    case "suspended":
      return { banned: true };
    case "unverified":
      return { banned: false, emailVerified: false };
    case "active":
      return {
        banned: false,
        emailVerified: true,
        sessions: { some: { expiresAt: { gt: now } } },
      };
    case "inactive":
      return {
        banned: false,
        emailVerified: true,
        sessions: { none: { expiresAt: { gt: now } } },
      };
    default:
      return {};
  }
}

function countryWhere(country: string) {
  return country ? { country } : {};
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; country?: string; page?: string }>;
}) {
  const { q, status: statusParam, country: countryParam, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const status = statusParam ?? "";
  const country = countryParam ?? "";
  const page = Math.max(1, Number(pageParam) || 1);
  const now = new Date();

  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user.id ?? "";

  // NEW — real per-user purchase counts/totals, replacing honest dashes.
  // Cross-database join: Orders live in the NestJS/Prisma business DB,
  // Users live in this app's own Better Auth DB — resolved here by
  // merging the two, not by either database knowing about the other.
  const spend: { totalRevenue: number; byUser: Record<string, { purchases: number; totalSpent: number }> } =
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/admin/user-spend`, {
      headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY as string },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : { totalRevenue: 0, byUser: {} }))
      .catch(() => ({ totalRevenue: 0, byUser: {} }));

  const searchClause = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const where = {
    ...searchClause,
    ...statusWhere(status, now),
    ...countryWhere(country),
  };

  const [total, filteredCount, unverifiedCount, activeCount, rows] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where }),
      prisma.user.count({ where: { emailVerified: false } }),
      prisma.user.count({
        where: {
          banned: false,
          emailVerified: true,
          sessions: { some: { expiresAt: { gt: now } } },
        },
      }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          banned: true,
          banReason: true,
          createdAt: true,
          _count: {
            select: { sessions: { where: { expiresAt: { gt: now } } } },
          },
        },
      }),
    ]);

  // NEW — real New Sign-ups chart data. Users live in this app's own DB,
  // so no cross-DB call is needed here (unlike the spend fetch above).
  const monthsBack = 12;
  const sinceDate = new Date();
  sinceDate.setMonth(sinceDate.getMonth() - (monthsBack - 1));
  sinceDate.setDate(1);
  sinceDate.setHours(0, 0, 0, 0);

  const recentUsers = await prisma.user.findMany({
    where: { createdAt: { gte: sinceDate } },
    select: { createdAt: true },
  });

  const signupBuckets: Record<string, number> = {};
  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(sinceDate);
    d.setMonth(d.getMonth() + i);
    signupBuckets[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`] = 0;
  }
  for (const u of recentUsers) {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (key in signupBuckets) signupBuckets[key]++;
  }
  const monthlySignups = Object.entries(signupBuckets).map(([month, count]) => ({
    month,
    count,
  }));

  // NEW — real Users by Country breakdown. Requires a `country` field on
  // the User model (via Better Auth's additionalFields) — rows with no
  // country set are excluded rather than counted as a fake "Unknown" bucket.
  const countryRows = await prisma.user.groupBy({
    by: ["country"],
    _count: { _all: true },
    where: { country: { not: null } },
    orderBy: { _count: { country: "desc" } },
  });
  const usersByCountry = countryRows.map((r) => ({
    country: r.country as string,
    count: r._count._all,
  }));

  const users: AdminUser[] = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    role: u.role,
    emailVerified: u.emailVerified,
    banned: u.banned,
    banReason: u.banReason,
    createdAt: u.createdAt.toISOString(),
    hasActiveSession: u._count.sessions > 0,
    purchases: spend.byUser[u.id]?.purchases ?? 0,
    totalSpent: spend.byUser[u.id]?.totalSpent ?? 0,
  }));

  const avgRevenuePerUser = total > 0 ? spend.totalRevenue / total : 0;

  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  function pageHref(n: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    if (country) params.set("country", country);
    params.set("page", String(n));
    return `?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{ fontFamily: "var(--font-ubuntu)" }}
          className="text-2xl font-bold"
        >
          Users
        </h1>
        <p className="text-sm text-muted-foreground">
          All registered accounts.
        </p>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UsersToolbarButtons />

        <UsersFilterForm
          initialQuery={query}
          initialStatus={status}
          initialCountry={country}
        />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="mt-1 text-2xl font-bold">{total}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Users className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="mt-1 text-2xl font-bold">{activeCount}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Has a live session
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserCheck className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Unverified Accounts
                </p>
                <p className="mt-1 text-2xl font-bold">{unverifiedCount}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserX className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Revenue / User
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {formatKES(Math.round(avgRevenuePerUser))}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Sign-ups (real) + Users by Country (real) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">New Sign-ups</p>
                <p className="text-sm text-muted-foreground">
                  New user registrations per month — last 12 months
                </p>
              </div>
            </div>

            <MonthlyBarChart data={monthlySignups} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Users by Country</p>
            </div>
            {usersByCountry.length === 0 ? (
              <p className="text-sm text-muted-foreground">No country data yet.</p>
            ) : (
              <div className="space-y-2">
                {usersByCountry.slice(0, 6).map((c) => (
                  <div key={c.country} className="flex items-center justify-between text-sm">
                    <span>{c.country}</span>
                    <span className="text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Users */}
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 font-semibold">
            All Users{" "}
            <span className="font-normal text-muted-foreground">
              {filteredCount} total
            </span>
          </p>
          <UsersTable initialUsers={users} currentUserId={currentUserId} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {filteredCount} users
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {page === 1 ? (
                  <Button variant="outline" size="sm" disabled>
                    Prev
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <a href={pageHref(page - 1)}>Prev</a>
                  </Button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((n) =>
                    n === page ? (
                      <Button
                        key={n}
                        size="sm"
                        className="bg-blue-700 hover:bg-blue-800"
                      >
                        {n}
                      </Button>
                    ) : (
                      <Button key={n} asChild variant="outline" size="sm">
                        <a href={pageHref(n)}>{n}</a>
                      </Button>
                    )
                  )}
                {page === totalPages ? (
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <a href={pageHref(page + 1)}>Next</a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}