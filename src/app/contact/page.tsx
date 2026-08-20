import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { ContactForm } from "@/components/contact/contact-form";
import { getCartCount } from "@/lib/cart";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556z" />
    </svg>
  );
}

export default async function ContactPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as (typeof session extends null ? never : NonNullable<typeof session>["user"]) & { role?: string } | undefined;
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      {user ? (
        <DashboardHeader fullName={user.name ?? "there"} userId={user.id} imageUrl={user.image ?? null} initialCartCount={cartCount} />
      ) : (
        <SiteHeader />
      )}

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Get in Touch</p>
          <h1 style={{ fontFamily: "var(--font-ubuntu)" }} className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Have a question about a course, product, or your account? Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <ContactForm defaultName={user?.name ?? ""} defaultEmail={user?.email ?? ""} />

          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-5">
              <p className="flex items-center gap-2 font-semibold text-gray-900">
                <Mail className="h-4 w-4 text-blue-700" />
                Email Us
              </p>
              <a href="mailto:support@ilabgrowth.com" className="mt-2 block text-sm text-blue-700 hover:underline">
                support@ilabgrowth.com
              </a>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <p className="font-semibold text-gray-900">Follow Us</p>
              <div className="mt-3 flex gap-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {user ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}