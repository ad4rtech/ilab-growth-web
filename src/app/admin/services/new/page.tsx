import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { getServiceStats } from "@/lib/services-admin";
import { ServiceForm } from "@/components/admin/service-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const stats = await getServiceStats();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Add New Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Services are capped at {stats.maxServices} — delete one to make room for a new one.
        </p>
      </div>

      {stats.atCapacity ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-amber-600" />
          <p className="font-medium text-amber-900">
            You&apos;ve reached the {stats.maxServices}-service limit.
          </p>
          <p className="max-w-sm text-sm text-amber-800">
            Delete an existing service from the Services list before adding a new one.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/services">Back to Services</Link>
          </Button>
        </div>
      ) : (
        <ServiceForm />
      )}
    </div>
  );
}