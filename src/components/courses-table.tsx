"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatKES } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Pencil, GraduationCap, Star } from "lucide-react";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  level: string | null;
  category: string | null;
  instructor: string | null;
  thumbnailUrl: string | null;
  badge: string | null;
  status: string;
  lessonCount: number | null;
  durationLabel: string | null;
  createdAt: string;
  _count?: { enrollments: number };
};

const PAGE_SIZE = 8;

export function CoursesTable({
  initialCourses,
  revenueByCourse = {},
}: {
  initialCourses: Course[];
  revenueByCourse?: Record<string, number>;
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function handleDelete(id: string, title: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not delete course.");
        return;
      }
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`"${title}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete course.");
    } finally {
      setDeletingId(null);
    }
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <GraduationCap className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No courses yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Click &quot;Create New Course&quot; to add your first course.
        </p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(courses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = courses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-gradient-to-br from-blue-600 to-blue-800">
                    {c.thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.thumbnailUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.lessonCount != null ? `${c.lessonCount} lessons` : "— lessons"}
                      {" · "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {c.category ? (
                  <Badge variant="outline">{c.category}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {c.instructor ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-baseline gap-2">
                  <span>{formatKES(c.price)}</span>
                  {c.compareAtPrice && c.compareAtPrice > c.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatKES(c.compareAtPrice)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {c._count?.enrollments ?? 0}
              </TableCell>
              <TableCell>
                {formatKES(revenueByCourse[c.id] ?? 0)}
              </TableCell>
              {/* Inactive — no review/rating system exists yet */}
              <TableCell>
                <span
                  className="flex items-center gap-1 text-muted-foreground"
                  title="No reviews yet"
                >
                  <Star className="h-3.5 w-3.5" />—
                </span>
              </TableCell>
              <TableCell>
                {c.status === "published" ? (
                  <Badge className="bg-green-600 hover:bg-green-600">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/courses/${c.id}/edit`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete &quot;{c.title}&quot;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the course from the
                          catalogue.
                          {c._count?.enrollments
                            ? ` ${c._count.enrollments} enrolled student${
                                c._count.enrollments === 1 ? "" : "s"
                              } will lose access. `
                            : " "}
                          This can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id, c.title)}
                        >
                          {deletingId === c.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {courses.length} course
          {courses.length === 1 ? "" : "s"}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
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
                className={n === currentPage ? "bg-blue-700 hover:bg-blue-800" : ""}
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
    </div>
  );
}