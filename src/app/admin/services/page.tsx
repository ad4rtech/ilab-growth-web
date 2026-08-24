import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ServicesTable } from "@/components/services-table";
import {
  getAdminServiceList,
  getServiceStats,
  getTopServicesByInquiries,
  getMonthlyInquiries,
} from "@/lib/services-admin";
import { ServiceStatCards } from "@/components/admin/service-stat-cards";
import { MonthlyBarChart } from "@/components/admin/monthly-inquiries-chart";
import { TopServicesPanel } from "@/components/admin/top-services-panel";
import { ServicesToolbar } from "@/components/admin/services-toolbar";
import { ServicesPagination } from "@/components/admin/services-pagination";

export const dynamic = "force-dynamic";

interface AdminServicesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminServicesPage({ searchParams }: AdminServicesPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const status = params.status;
  const category = params.category;
  const search = params.search;

const [listResponse, stats, topServices, monthlyInquiries] = await Promise.all([
    getAdminServiceList({ page, status, category, search }),
    getServiceStats(),
    getTopServicesByInquiries(3),
    getMonthlyInquiries(12),
  ]);

   const monthlyInquiriesData = monthlyInquiries.map((b) => ({
    month: b.label,
    count: b.inquiryCount,
  }));

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Services
        </h1>
        <p className="text-sm text-muted-foreground">Manage your service listings and inquiries.</p>
      </div>

      <ServiceStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <MonthlyBarChart data={monthlyInquiriesData} />
        <TopServicesPanel services={topServices} />
      </div>

<ServicesToolbar atCapacity={stats.atCapacity} maxServices={stats.maxServices} />
      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} service{listResponse.total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ServicesTable
            key={`${page}-${status ?? ""}-${category ?? ""}-${search ?? ""}`}
            initialServices={listResponse.services}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.services.length} of {listResponse.total} services
            </p>
            <ServicesPagination
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