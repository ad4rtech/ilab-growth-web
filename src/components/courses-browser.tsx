"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  GraduationCap,
  SlidersHorizontal,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { CourseCard, type Course } from "@/components/course-card";
import { LEVELS, PRICE_RANGES } from "@/lib/course-options";

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const ALL_LEVELS_VALUE = "All Levels";
const MULTIPLE_LEVELS_VALUE = "__multiple__";

export function CoursesBrowser({ courses, userId }: { courses: Course[]; userId: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All Courses");
  const [levels, setLevels] = useState<Set<string>>(new Set());
  const [priceRangeId, setPriceRangeId] = useState<string>("");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status === "published"),
    [courses]
  );

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    publishedCourses.forEach((c) => {
      if (c.category) map.set(c.category, (map.get(c.category) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [publishedCourses]);

  const levelCounts = useMemo(() => {
    const map = new Map<string, number>();
    publishedCourses.forEach((c) => {
      if (c.level) map.set(c.level, (map.get(c.level) ?? 0) + 1);
    });
    return map;
  }, [publishedCourses]);

  const priceRangeCounts = useMemo(() => {
    return PRICE_RANGES.map((r) => ({
      ...r,
      count: publishedCourses.filter(
        (c) => c.price >= r.min && c.price <= r.max
      ).length,
    }));
  }, [publishedCourses]);

  const activeFilterCount =
    (priceRangeId ? 1 : 0) + (levels.size > 0 ? 1 : 0);

  function toggleLevel(l: string) {
    setPage(1);
    setLevels((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  // Toolbar dropdown is a quick single-pick shortcut on top of the same
  // `levels` set the Sheet's checkboxes control — so both stay in sync.
  const toolbarLevelValue =
    levels.size === 0
      ? ALL_LEVELS_VALUE
      : levels.size === 1
        ? Array.from(levels)[0]
        : MULTIPLE_LEVELS_VALUE;

  const toolbarLevelOptions = [
    { value: ALL_LEVELS_VALUE, label: "All Levels" },
    ...LEVELS.map((l) => ({ value: l, label: l })),
    ...(levels.size > 1
      ? [{ value: MULTIPLE_LEVELS_VALUE, label: `${levels.size} levels selected` }]
      : []),
  ];

  const filtered = useMemo(() => {
    let result = publishedCourses;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          (c.instructor ?? "").toLowerCase().includes(q)
      );
    }
    if (category !== "All Courses") {
      result = result.filter((c) => c.category === category);
    }
    if (levels.size > 0) {
      result = result.filter((c) => c.level && levels.has(c.level));
    }
    if (priceRangeId) {
      const range = PRICE_RANGES.find((r) => r.id === priceRangeId);
      if (range) {
        result = result.filter(
          (c) => c.price >= range.min && c.price <= range.max
        );
      }
    }

    result = [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "popular") {
        return (b._count?.enrollments ?? 0) - (a._count?.enrollments ?? 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [publishedCourses, search, category, levels, priceRangeId, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold">Category</p>
        <RadioGroup
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          className="space-y-1"
        >
          <label className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted">
            <span className="flex items-center gap-2">
              <RadioGroupItem value="All Courses" />
              All Courses
            </span>
            <span className="text-xs text-muted-foreground">
              {publishedCourses.length}
            </span>
          </label>
          {categories.map((c) => (
            <label
              key={c.name}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <RadioGroupItem value={c.name} />
                {c.name}
              </span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Level</p>
        <div className="space-y-1">
          {LEVELS.map((l) => (
            <label
              key={l}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={levels.has(l)}
                  onCheckedChange={() => toggleLevel(l)}
                />
                {l}
              </span>
              <span className="text-xs text-muted-foreground">
                {levelCounts.get(l) ?? 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Price Range</p>
        <RadioGroup
          value={priceRangeId}
          onValueChange={(v) => {
            setPriceRangeId(v === priceRangeId ? "" : v);
            setPage(1);
          }}
          className="space-y-1"
        >
          {priceRangeCounts.map((r) => (
            <label
              key={r.id}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              onClick={(e) => {
                if (priceRangeId === r.id) {
                  e.preventDefault();
                  setPriceRangeId("");
                  setPage(1);
                }
              }}
            >
              <span className="flex items-center gap-2">
                <RadioGroupItem value={r.id} />
                {r.label}
              </span>
              <span className="text-xs text-muted-foreground">{r.count}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="rounded-lg border bg-orange-50/60 p-4">
        <p className="mb-2 text-sm font-semibold">Payment Options</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5" />
            M-Pesa (Kenya &amp; East Africa)
          </li>
          <li className="flex items-center gap-2">
            <CreditCard className="h-3.5 w-3.5" />
            Debit / Credit Card
          </li>
        </ul>
      </div>

      {(priceRangeId || levels.size > 0 || category !== "All Courses") && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setPriceRangeId("");
            setLevels(new Set());
            setCategory("All Courses");
            setPage(1);
          }}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div>
      {/* Top toolbar: search + category pills + level quick-pick */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search courses..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-1 flex-wrap gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setCategory("All Courses");
              setPage(1);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === "All Courses"
                ? "bg-blue-700 text-white"
                : "text-neutral-600 hover:bg-muted"
            }`}
          >
            All Courses
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setCategory(c.name);
                setPage(1);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c.name
                  ? "bg-blue-700 text-white"
                  : "text-neutral-600 hover:bg-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <Select
          items={toolbarLevelOptions}
          value={toolbarLevelValue}
          onValueChange={(v) => {
            setPage(1);
            if (v === ALL_LEVELS_VALUE) setLevels(new Set());
            else if (v !== MULTIPLE_LEVELS_VALUE) setLevels(new Set([v]));
          }}
        >
          <SelectTrigger className="w-full lg:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {toolbarLevelOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger className="relative flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-[10px] font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto p-6">
            <h3
              style={{ fontFamily: "var(--font-ubuntu)" }}
              className="mb-4 text-lg font-semibold"
            >
              Filters
            </h3>
            {FiltersPanel}
          </SheetContent>
        </Sheet>
      </div>

      {/* Heading + sort/view row */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="text-xl font-bold"
          >
            All Courses
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {paginated.length} of {filtered.length} course
            {filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select items={SORT_OPTIONS} value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-md border">
            <button
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center rounded-l-md ${
                view === "grid" ? "bg-blue-700 text-white" : "hover:bg-muted"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex h-9 w-9 items-center justify-center rounded-r-md ${
                view === "list" ? "bg-blue-700 text-white" : "hover:bg-muted"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid/List */}
      <div className="mt-6">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-20 text-center">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No courses found</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Try a different search, category, or level.
            </p>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            {paginated.map((c) => (
              <CourseCard key={c.id} course={c} view={view} userId={userId} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === currentPage ? "default" : "outline"}
              size="sm"
              className={
                n === currentPage ? "bg-blue-700 hover:bg-blue-800" : ""
              }
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}