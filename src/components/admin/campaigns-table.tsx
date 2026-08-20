// src/components/admin/campaigns-table.tsx
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Campaign } from "@/lib/subscribers-admin";

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No campaigns yet — click "Create Campaign" to send your first one.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Sent / Scheduled</TableHead>
          <TableHead>Recipients</TableHead>
          <TableHead>Open Rate</TableHead>
          <TableHead>Click Rate</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.subject}</TableCell>
            <TableCell className="text-muted-foreground">
              {c.sentAt
                ? new Date(c.sentAt).toLocaleDateString()
                : c.scheduledAt
                ? new Date(c.scheduledAt).toLocaleDateString()
                : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {c.status === "sent" ? c.recipientCount.toLocaleString() : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {c.openRate === null ? "—" : `${c.openRate}%`}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {c.clickRate === null ? "—" : `${c.clickRate}%`}
            </TableCell>
            <TableCell>
              {c.status === "sent" && <Badge className="bg-green-600 hover:bg-green-600">Sent</Badge>}
              {c.status === "scheduled" && (
                <Badge className="bg-amber-500 hover:bg-amber-500">Scheduled</Badge>
              )}
              {c.status === "draft" && <Badge variant="outline">Draft</Badge>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}