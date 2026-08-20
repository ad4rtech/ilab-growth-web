import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAdminComments } from "@/lib/comments-admin";
import { CommentsTable } from "@/components/admin/comments-table";
import { CommentsToolbar } from "@/components/admin/comments-toolbar";
import { CommentsPagination } from "@/components/admin/comments-pagination";

export const dynamic = "force-dynamic";

interface AdminCommentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminCommentsPage({ searchParams }: AdminCommentsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const status = params.status;
  const search = params.search;

  const listResponse = await getAdminComments({ page, status, search });

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Comments
        </h1>
        <p className="text-sm text-muted-foreground">
          Review, approve, or remove comments left on blog posts.
        </p>
      </div>

      <CommentsToolbar counts={listResponse.counts} />

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} comment{listResponse.total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <CommentsTable
            key={`${page}-${status ?? ""}-${search ?? ""}`}
            initialComments={listResponse.comments}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.comments.length} of {listResponse.total} comments
            </p>
            <CommentsPagination
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