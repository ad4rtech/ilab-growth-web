"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ManageUserDialog } from "@/components/manage-user-dialog";
import { formatKES } from "@/lib/format";
import { Trash2, Pencil, Users } from "lucide-react";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  banReason: string | null;
  createdAt: string;
  hasActiveSession: boolean;
  purchases: number;
  totalSpent: number;
};

function initialsOf(name: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusFor(u: AdminUser): { label: string; className: string } {
  if (u.banned) {
    return { label: "Suspended", className: "bg-red-100 text-red-700 hover:bg-red-100" };
  }
  if (!u.emailVerified) {
    return { label: "Unverified", className: "bg-muted text-muted-foreground hover:bg-muted" };
  }
  if (u.hasActiveSession) {
    return { label: "Active", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" };
  }
  return { label: "Inactive", className: "bg-muted text-muted-foreground hover:bg-muted" };
}

export function UsersTable({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [managingUser, setManagingUser] = useState<AdminUser | null>(null);

  async function handleDelete(id: string, label: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not delete user.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`"${label}" deleted.`);
    } catch {
      toast.error("Network error. Could not delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleUpdated(id: string, patch: Partial<AdminUser>) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...patch } : u))
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No users found</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const status = statusFor(u);
            const isSelf = u.id === currentUserId;
            const label = u.name || u.email;
            return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.image ?? undefined} alt={u.name ?? ""} />
                      <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                        {initialsOf(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                {/* Inactive — no country field on the user model yet */}
                <TableCell className="text-muted-foreground" title="Not collected yet">
                  —
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.purchases}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatKES(u.totalSpent)}
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === "admin" ? "default" : "outline"}>
                    {u.role === "admin" ? "Admin" : "Student"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={status.className}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setManagingUser(u)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        disabled={isSelf}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete &quot;{label}&quot;?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes the account and all
                            associated sessions. This is a hard delete and
                            can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingId === u.id}
                            onClick={() => handleDelete(u.id, label)}
                          >
                            {deletingId === u.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {managingUser && (
        <ManageUserDialog
          user={managingUser}
          open={!!managingUser}
          onOpenChange={(open) => !open && setManagingUser(null)}
          isSelf={managingUser.id === currentUserId}
          onUpdated={(patch) => {
            handleUpdated(managingUser.id, patch);
            setManagingUser(null);
          }}
        />
      )}
    </>
  );
}