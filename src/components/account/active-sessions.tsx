"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Monitor, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SessionRow {
  id: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  isCurrent: boolean;
}

function parseDevice(userAgent: string | null): { label: string; isMobile: boolean } {
  if (!userAgent) return { label: "Unknown device", isMobile: false };
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  if (/iPhone/i.test(userAgent)) return { label: "iPhone", isMobile: true };
  if (/Android/i.test(userAgent)) return { label: "Android device", isMobile: true };
  if (/Mac/i.test(userAgent)) return { label: "Mac", isMobile: false };
  if (/Windows/i.test(userAgent)) return { label: "Windows PC", isMobile: false };
  return { label: "Unknown device", isMobile };
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  async function loadSessions() {
    try {
      const [{ data: sessionList, error: listError }, { data: current }] = await Promise.all([
        authClient.listSessions(),
        authClient.getSession(),
      ]);
      if (listError || !sessionList) throw new Error(listError?.message ?? "Unexpected response shape");

      const rows: SessionRow[] = sessionList.map((s) => ({
        id: s.id,
        token: s.token,
        ipAddress: s.ipAddress ?? null,
        userAgent: s.userAgent ?? null,
        createdAt: s.createdAt.toString(),
        isCurrent: s.id === current?.session.id,
      }));
      setSessions(rows);
    } catch {
      setUnsupported(true);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleRevoke(token: string) {
    setRevokingToken(token);
    try {
      await authClient.revokeSession({ token });
      setSessions((prev) => (prev ? prev.filter((s) => s.token !== token) : prev));
      toast.success("Session signed out.");
    } catch {
      toast.error("Could not sign out that session.");
    } finally {
      setRevokingToken(null);
    }
  }

  async function handleRevokeAllOthers() {
    setRevokingAll(true);
    try {
      await authClient.revokeOtherSessions();
      toast.success("Signed out of all other devices.");
      await loadSessions();
    } catch {
      toast.error("Could not sign out other sessions.");
    } finally {
      setRevokingAll(false);
    }
  }

  if (unsupported) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-bold text-gray-900">Active Sessions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Session management isn&apos;t available yet in this version of the app.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Active Sessions</h2>
        {sessions && sessions.length > 1 && (
          <Button variant="outline" size="sm" onClick={handleRevokeAllOthers} disabled={revokingAll}>
            {revokingAll ? "Signing out..." : "Sign out all other devices"}
          </Button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Devices currently signed in to your account.
      </p>

      {!sessions ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="mt-4 divide-y">
          {sessions.map((s) => {
            const device = parseDevice(s.userAgent);
            const Icon = device.isMobile ? Smartphone : Monitor;
            return (
              <div key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {device.label}
                      {s.isCurrent && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.ipAddress ?? "Unknown IP"} ·{" "}
                      {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                {!s.isCurrent && (
                  <button
                    onClick={() => handleRevoke(s.token)}
                    disabled={revokingToken === s.token}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}