import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getSubscriberStats,
  getSourceBreakdown,
  getSubscriberGrowth,
  getAdminSubscribers,
  getCampaigns,
} from "@/lib/subscribers-admin";
import { SubscriberStatCards } from "@/components/admin/subscriber-stat-cards";
import { SubscriberGrowthChart } from "@/components/admin/subscriber-growth-chart";
import { TopSourcesPanel } from "@/components/admin/top-sources-panel";
import { CampaignsTable } from "@/components/admin/campaigns-table";
import { SubscribersTable } from "@/components/admin/subscribers-table";
import { SubscribersToolbar } from "@/components/admin/subscribers-toolbar";
import { SubscribersPagination } from "@/components/admin/subscribers-pagination";

export const dynamic = "force-dynamic";

interface AdminSubscribersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminSubscribersPage({ searchParams }: AdminSubscribersPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const status = params.status;
  const search = params.search;

  const [stats, sources, growth, listResponse, campaignsResponse] = await Promise.all([
    getSubscriberStats(),
    getSourceBreakdown(),
    getSubscriberGrowth(12),
    getAdminSubscribers({ page, status, search }),
    getCampaigns(),
  ]);

  const urlSearchParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Subscribers
        </h1>
        <p className="text-sm text-muted-foreground">Manage your newsletter list and campaigns.</p>
      </div>

      <SubscriberStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <SubscriberGrowthChart data={growth} />
        <TopSourcesPanel sources={sources} />
      </div>

      <SubscribersToolbar />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Email Campaigns · {campaignsResponse.total} total</p>
            <Link href="/admin/subscribers/campaigns" className="text-sm text-blue-600 hover:underline">
              View all campaigns
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <CampaignsTable campaigns={campaignsResponse.campaigns.slice(0, 7)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {listResponse.total} subscriber{listResponse.total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SubscribersTable
            key={`${page}-${status ?? ""}-${search ?? ""}`}
            initialSubscribers={listResponse.subscribers}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {listResponse.subscribers.length} of {listResponse.total} subscribers
            </p>
            <SubscribersPagination
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