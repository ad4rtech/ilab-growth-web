import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogPostsTable } from "@/components/blog-posts-table";
import {
  getAdminBlogList,
  getBlogStats,
  getTopAuthors,
  getMonthlyViews,
  getNewsletterStats,
} from "@/lib/blog-admin";
import { BlogStatCards } from "@/components/admin/blog-stat-cards";
import { MonthlyViewsChart } from "@/components/admin/monthly-views-chart";
import { TopAuthorsPanel } from "@/components/admin/top-authors-panel";
import { BlogPostsToolbar } from "@/components/admin/blog-posts-toolbar";
import { BlogPostsPagination } from "@/components/admin/blog-posts-pagination";

export const dynamic = "force-dynamic";

interface AdminBlogPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const status = params.status;
  const category = params.category;
  const search = params.search;

  const [listResponse, stats, topAuthors, monthlyViews, newsletterStats] = await Promise.all([
    getAdminBlogList({ page, status, category, search }),
    getBlogStats(),
    getTopAuthors(4),
    getMonthlyViews(12),
    getNewsletterStats(),
  ]);

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Blog Posts
        </h1>
        <p className="text-sm text-muted-foreground">Write and manage articles for the blog.</p>
      </div>

      <BlogStatCards stats={stats} newsletterStats={newsletterStats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <MonthlyViewsChart data={monthlyViews} />
        <TopAuthorsPanel authors={topAuthors} />
      </div>

      <BlogPostsToolbar />

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} post{listResponse.total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlogPostsTable
            key={`${page}-${status ?? ""}-${category ?? ""}-${search ?? ""}`}
            initialPosts={listResponse.posts}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.posts.length} of {listResponse.total} posts
            </p>
            <BlogPostsPagination
              currentPage={listResponse.page}
              totalPages={listResponse.totalPages}
              searchParams={urlSearchParams}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}