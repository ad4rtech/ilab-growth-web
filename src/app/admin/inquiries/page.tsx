import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAdminInquiryList, getInquiryStats } from "@/lib/inquiries-admin";
import { InquiryStatCards } from "@/components/admin/inquiry-stat-cards";
import { InquiriesToolbar } from "@/components/admin/inquiries-toolbar";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { InquiriesPagination } from "@/components/admin/inquiries-pagination";

export const dynamic = "force-dynamic";

interface AdminInquiriesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const type = params.type;
  const status = params.status;
  const search = params.search;

  const [listResponse, stats] = await Promise.all([
    getAdminInquiryList({ page, type, status, search }),
    getInquiryStats(),
  ]);

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Inquiries
        </h1>
        <p className="text-sm text-muted-foreground">
          Service enquiries and discovery call requests from the Services page.
        </p>
      </div>

      <InquiryStatCards stats={stats} />

      <InquiriesToolbar stats={stats} />

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} inquir{listResponse.total === 1 ? "y" : "ies"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <InquiriesTable
            key={`${page}-${type ?? ""}-${status ?? ""}-${search ?? ""}`}
            initialInquiries={listResponse.inquiries}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.inquiries.length} of {listResponse.total} inquiries
            </p>
            <InquiriesPagination
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