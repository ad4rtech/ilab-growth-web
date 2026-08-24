"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminUser } from "@/components/users-table";

const ROLE_ITEMS = [
  { value: "user", label: "Student" },
  { value: "admin", label: "Admin" },
];

export function ManageUserDialog({
  user,
  open,
  onOpenChange,
  onUpdated,
  isSelf,
}: {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: Partial<AdminUser>) => void;
  isSelf: boolean;
}) {
  const [role, setRole] = useState(user.role);
  const [banReason, setBanReason] = useState(user.banReason ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      if (role !== user.role) {
        const res = await fetch(`/api/admin/users/${user.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data?.message ?? "Could not update role.");
          setSaving(false);
          return;
        }
      }
      onUpdated({ role });
      toast.success("User updated.");
      onOpenChange(false);
    } catch {
      toast.error("Network error. Could not update user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSuspend() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banReason: banReason.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not suspend user.");
        return;
      }
      onUpdated({ banned: true, banReason: banReason.trim() || null });
      toast.success(`${user.name || user.email} suspended.`);
      onOpenChange(false);
    } catch {
      toast.error("Network error. Could not suspend user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/unban`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not reactivate user.");
        return;
      }
      onUpdated({ banned: false, banReason: null });
      toast.success(`${user.name || user.email} reactivated.`);
      onOpenChange(false);
    } catch {
      toast.error("Network error. Could not reactivate user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {user.name || user.email}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              items={ROLE_ITEMS}
              value={role}
              onValueChange={(v) => v !== null && setRole(v)}
              disabled={isSelf}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_ITEMS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isSelf && (
              <p className="text-xs text-muted-foreground">
                You can&apos;t change your own role from here.
              </p>
            )}
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            {user.banned ? (
              <>
                <p className="text-sm font-medium">Account suspended</p>
                {user.banReason && (
                  <p className="text-sm text-muted-foreground">
                    Reason: {user.banReason}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={saving || isSelf}
                  onClick={handleReactivate}
                >
                  {saving ? "Reactivating..." : "Reactivate Account"}
                </Button>
              </>
            ) : (
              <>
                <Label htmlFor="banReason">
                  Suspend this account (optional reason)
                </Label>
                <Textarea
                  id="banReason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Terms of service violation"
                  rows={2}
                  disabled={isSelf}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  disabled={saving || isSelf}
                  onClick={handleSuspend}
                >
                  {saving ? "Suspending..." : "Suspend Account"}
                </Button>
                {isSelf && (
                  <p className="text-xs text-muted-foreground">
                    You can&apos;t suspend your own account.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || role === user.role}>
            {saving ? "Saving..." : "Save Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}