import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import type { AdminService } from "@/lib/services-admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const dynamic = "force-dynamic";

async function getService(id: string): Promise<AdminService | null> {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminService;
  } catch {
    return null;
  }
}

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="text-2xl font-bold">
          Edit Service
        </h1>
        <p className="text-sm text-muted-foreground">Editing &quot;{service.title}&quot;.</p>
      </div>

      <ServiceForm initial={service} />
    </div>
  );
}