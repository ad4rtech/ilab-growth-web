"use client";

// src/app/admin/subscribers/new-campaign/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function NewCampaignPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitCampaign(sendNow: boolean) {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    if (!sendNow && scheduledAt && new Date(scheduledAt).getTime() <= Date.now()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          body: body.trim(),
          sendNow,
          scheduledAt: !sendNow && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.message ?? "Could not save campaign.");
        setLoading(false);
        return;
      }

      toast.success(
        sendNow ? "Campaign sent." : scheduledAt ? "Campaign scheduled." : "Draft saved.",
      );
      router.push("/admin/subscribers/campaigns");
    } catch {
      toast.error("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Create Campaign
        </h1>
        <p className="text-sm text-muted-foreground">
          Sends to every active subscriber. There's no preview/test-send yet — double-check
          before sending.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign Details</CardTitle>
          <CardDescription>Body supports basic HTML.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="April Growth Tactics Roundup"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Body (HTML)</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="<p>Hi there — here's what's new...</p>"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Schedule for later (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to send immediately or save as a draft.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => submitCampaign(false)}
              >
                {scheduledAt ? "Schedule Campaign" : "Save Draft"}
              </Button>

              <AlertDialog>
            <AlertDialogTrigger
  render={<Button type="button" disabled={loading || !subject.trim() || !body.trim()} />}
>
  Send Now
</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send this campaign now?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This emails every active subscriber immediately. This can&apos;t be undone
                      or unsent.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => submitCampaign(true)}>
                      {loading ? "Sending..." : "Send Now"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/admin/subscribers")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}