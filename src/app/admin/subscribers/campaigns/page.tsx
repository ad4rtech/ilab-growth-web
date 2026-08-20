import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCampaigns } from "@/lib/subscribers-admin";
import { CampaignsTable } from "@/components/admin/campaigns-table";
import { Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const { campaigns, total } = await getCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
            Email Campaigns
          </h1>
          <p className="text-sm text-muted-foreground">All campaigns, sent and scheduled.</p>
        </div>
        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link href="/admin/subscribers/new-campaign" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <p className="font-semibold">
            {total} campaign{total === 1 ? "" : "s"}
          </p>
        </CardHeader>
        <CardContent>
          <CampaignsTable campaigns={campaigns} />
        </CardContent>
      </Card>
    </div>
  );
}