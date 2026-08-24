"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { AdminInquiry } from "@/lib/inquiries-admin";

const STATUS_ITEMS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function statusBadgeClass(status: string) {
  if (status === "new") return "bg-orange-100 text-orange-700 hover:bg-orange-100";
  if (status === "contacted") return "bg-blue-100 text-blue-700 hover:bg-blue-100";
  return "bg-green-100 text-green-700 hover:bg-green-100"; // closed
}

export function InquiriesTable({ initialInquiries }: { initialInquiries: AdminInquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Could not update status.");
        return;
      }
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      toast.success("Status updated.");
    } catch {
      toast.error("Network error. Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete inquiry.");
        return;
      }
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      toast.success(`Inquiry from "${name}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No inquiries yet</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Submissions from the Services page enquiry form and call requests will show up here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Business</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Received</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((i) => (
          <TableRow key={i.id}>
            <TableCell>
              <Badge variant="outline" className="gap-1">
                {i.inquiryType === "call" ? (
                  <Phone className="h-3 w-3" />
                ) : (
                  <MessageSquare className="h-3 w-3" />
                )}
                {i.inquiryType === "call" ? "Call" : "General"}
              </Badge>
            </TableCell>
            <TableCell>
              <p className="font-medium">{i.name}</p>
              <p className="text-xs text-muted-foreground">{i.email}</p>
              {i.phone && <p className="text-xs text-muted-foreground">{i.phone}</p>}
            </TableCell>
            <TableCell className="text-muted-foreground">{i.businessName ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{i.service?.title ?? "—"}</TableCell>
            <TableCell className="max-w-xs">
              <p className="line-clamp-2 text-sm text-gray-700">{i.message ?? "—"}</p>
            </TableCell>
            <TableCell>
              <Select
                value={i.status}
                onValueChange={(v) => v !== null && handleStatusChange(i.id, v)}
                items={STATUS_ITEMS}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue>
                    <Badge className={statusBadgeClass(i.status)} variant="secondary">
                      {STATUS_ITEMS.find((s) => s.value === i.status)?.label ?? i.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ITEMS.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={updatingId === i.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(i.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the inquiry from &quot;{i.name}&quot;. This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deletingId === i.id}
                      onClick={() => handleDelete(i.id, i.name)}
                    >
                      {deletingId === i.id ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}