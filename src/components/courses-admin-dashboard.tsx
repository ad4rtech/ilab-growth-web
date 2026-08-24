"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoursesTable, type Course } from "@/components/courses-table";
import { MonthlyBarChart } from "@/components/admin/monthly-bar-chart";
import { formatKES } from "@/lib/format";
import {
  Search,
  GraduationCap,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Plus,
  Download,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";

const STATUS_ITEMS = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function CoursesAdminDashboard({
  initialCourses,
  totalRevenue = 0,
  revenueByCourse = {},
  monthlyEnrolments = [],
}: {
  initialCourses: Course[];
  totalRevenue?: number;
  revenueByCourse?: Record<string, number>;
  monthlyEnrolments?: { month: string; count: number }[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const totalCourses = initialCourses.length;
  const totalEnrolments = initialCourses.reduce(
    (sum, c) => sum + (c._count?.enrollments ?? 0),
    0
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialCourses.forEach((c) => c.category && set.add(c.category));
    return Array.from(set).sort();
  }, [initialCourses]);

  const categoryItems = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const topCourses = useMemo(() => {
    return [...initialCourses]
      .sort((a, b) => (b._count?.enrollments ?? 0) - (a._count?.enrollments ?? 0))
      .filter((c) => (c._count?.enrollments ?? 0) > 0)
      .slice(0, 3);
  }, [initialCourses]);

  const filtered = useMemo(() => {
    let result = initialCourses;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.instructor ?? "").toLowerCase().includes(q)
      );
    }
    if (category !== "all") {
      result = result.filter((c) => c.category === category);
    }
    if (status !== "all") {
      result = result.filter((c) => c.status === status);
    }
    return result;
  }, [initialCourses, search, category, status]);

  return (
    <div className="space-y-6">
      {/* Action row: create/export on the left, search/filters on the right — matches the mockup's single combined bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link href="/admin/courses/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Course
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => toast.info("Export isn't connected yet.")}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="pl-9"
            />
          </div>
          <Select items={categoryItems} value={category} onValueChange={(v) => v !== null && setCategory(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryItems.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select items={STATUS_ITEMS} value={status} onValueChange={(v) => v !== null && setStatus(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="mt-1 text-2xl font-bold">{totalCourses}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <GraduationCap className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Enrolments
                </p>
                <p className="mt-1 text-2xl font-bold">{totalEnrolments}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Users className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inactive — no orders/checkout data exists to back this yet */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Revenue</p>
                <p className="mt-1 text-2xl font-bold">
                  {formatKES(totalRevenue)}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inactive — no review/rating system exists yet */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Course Rating
                </p>
                <p className="mt-1 text-2xl font-bold text-muted-foreground">
                  —
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  No reviews yet
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Star className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Enrolments (real) + Top Courses (real) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Monthly Enrolments</p>
                <p className="text-sm text-muted-foreground">
                  New students enrolled per month — last 12 months
                </p>
              </div>
            </div>

            <div className="mt-6">
              <MonthlyBarChart data={monthlyEnrolments} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">Top Courses by Enrolment</p>
            </div>
            {topCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No enrolments yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topCourses.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-medium">{c.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {c._count?.enrollments ?? 0} student
                      {(c._count?.enrollments ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Courses */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold">
              All Courses{" "}
              <span className="font-normal text-muted-foreground">
                {filtered.length} total
              </span>
            </p>
            <div className="flex rounded-md border">
              <button
                type="button"
                onClick={() =>
                  toast.info("Grid view isn't connected yet — table view only for now.")
                }
                className="flex h-8 w-8 items-center justify-center rounded-l-md text-muted-foreground hover:bg-muted"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-r-md bg-blue-700 text-white"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Keyed to the filter values so the table remounts with the
              filtered list — CoursesTable seeds its own state from
              initialCourses once on mount, so a plain prop change
              wouldn't otherwise be picked up. */}
          <CoursesTable
            key={`${search}-${category}-${status}`}
            initialCourses={filtered}
            revenueByCourse={revenueByCourse}
          />
        </CardContent>
      </Card>
    </div>
  );
}