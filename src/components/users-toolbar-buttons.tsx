"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Download } from "lucide-react";

export function UsersToolbarButtons() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);

  async function handleInvite() {
    if (!inviteEmail.trim()) {
      toast.error("Enter an email address.");
      return;
    }
    setInviting(true);
    try {
      const res = await fetch("/api/admin/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not send invite.");
        return;
      }
      toast.success(`Invite sent to ${inviteEmail.trim()}`);
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("user");
      router.refresh();
    } catch {
      toast.error("Network error sending invite.");
    } finally {
      setInviting(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      const q = searchParams.get("q");
      const status = searchParams.get("status");
      const country = searchParams.get("country");
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (country) params.set("country", country);

      const res = await fetch(`/api/admin/users/export-csv?${params.toString()}`);
      if (!res.ok) {
        toast.error("Could not generate export.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Users exported.");
    } catch {
      toast.error("Network error during export.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogTrigger
  render={
    <Button type="button" className="gap-2 bg-blue-700 hover:bg-blue-800">
      <UserPlus className="h-4 w-4" />
      Invite User
    </Button>
  }
/>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a new user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => v !== null && setInviteRole(v)} items={[{ value: "user", label: "User" }, { value: "admin", label: "Admin" }]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvite} disabled={inviting} className="bg-blue-700 hover:bg-blue-800">
              {inviting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button type="button" variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
        <Download className="h-4 w-4" />
        {exporting ? "Exporting..." : "Export Users"}
      </Button>
    </div>
  );
}