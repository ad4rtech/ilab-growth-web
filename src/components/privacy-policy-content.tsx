"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Lock,
  Info,
  Calendar,
  RotateCw,
  Globe,
  ShieldCheck,
  EyeOff,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "data-we-collect", title: "2. Data We Collect" },
  { id: "how-we-use-data", title: "3. How We Use Your Data" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "data-sharing", title: "5. Data Sharing" },
  { id: "cookies-tracking", title: "6. Cookies & Tracking" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "your-rights", title: "8. Your Rights" },
  { id: "international-transfers", title: "9. International Data Transfers" },
  { id: "data-security", title: "10. Data Security" },
  { id: "childrens-privacy", title: "11. Children's Privacy" },
  { id: "changes-to-policy", title: "12. Changes to This Policy" },
  { id: "contact-dpo", title: "13. Contact & DPO" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "We never sell your data" },
  { icon: EyeOff, label: "No third-party ad tracking" },
  { icon: Lock, label: "TLS encrypted at all times" },
  { icon: Trash2, label: "Delete your data anytime" },
];

const RIGHTS = ["Access", "Correct", "Delete", "Export", "Opt out"];

export function PrivacyPolicyContent({
  user,
  cartCount = 0,
}: {
  user: { fullName: string; userId: string; imageUrl: string | null } | null;
  cartCount?: number;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function handleDownloadPdf() {
    window.print();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only-content { padding: 0 !important; }
        }
      `}</style>

      <div className="no-print">
        {user ? (
          <DashboardHeader
            fullName={user.fullName}
            userId={user.userId}
            imageUrl={user.imageUrl}
            initialCartCount={cartCount}
          />
        ) : (
          <SiteHeader />
        )}
      </div>

      {/* Hero */}
      <div className="bg-orange-50/60 px-4 py-10 sm:px-6 lg:px-8 no-print">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href={user ? "/dashboard" : "/"} className="hover:underline">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-blue-700 text-white">
              <Lock className="h-5 w-5" />
            </span>
            <h1
              style={{ fontFamily: "var(--font-ubuntu)" }}
              className="text-3xl font-bold sm:text-4xl"
            >
              Privacy Policy
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Your privacy matters to us. This policy explains clearly what
            data we collect, why we collect it, and how you stay in control.
          </p>

          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Effective: 1 January 2026
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCw className="h-3.5 w-3.5" />
              Last updated: 4 July 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Applies to: iLab Growth platform
            </span>
          </div>
        </div>
      </div>

      {/* Trust badges row */}
      <div className="border-y bg-white px-4 py-4 sm:px-6 lg:px-8 no-print">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="mr-1.5 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 print-only-content">
        {/* Sidebar TOC - desktop */}
        <aside className="hidden lg:block no-print">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
                TABLE OF CONTENTS
              </p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      activeId === s.id
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-xl border p-4">
              <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground">
                YOUR RIGHTS AT A GLANCE
              </p>
              <ul className="space-y-2">
                {RIGHTS.map((r) => (
                  <li
                    key={r}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Mobile TOC - dropdown */}
        <div className="lg:hidden no-print">
          <label className="mb-2 block text-xs font-semibold text-muted-foreground">
            JUMP TO SECTION
          </label>
          <select
            value={activeId}
            onChange={(e) => scrollToSection(e.target.value)}
            className="w-full rounded-md border bg-background p-2 text-sm"
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Main content */}
        <div className="min-w-0">
          <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
            <Info className="mt-0.5 h-5 w-5 flex-none text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Plain-language summary
              </p>
              <p className="mt-1 text-sm text-blue-900/80">
                We collect your name, email, and payment info to deliver what
                you buy. We use analytics to improve the platform. We never
                sell your data. You can request deletion at any time by
                emailing privacy@ilabgrowth.com.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section id="introduction">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                1. Introduction
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                iLab Growth (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
                is committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, store, and share your
                information when you use our website, courses, digital
                products, and related services. By using our platform, you
                agree to the practices described here.
              </p>
            </section>
            <hr />

            <section id="data-we-collect">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                2. Data We Collect
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We collect information you provide directly, including: your
                name, email address, country, and payment details when you
                register or make a purchase. We also collect data
                automatically via cookies and analytics tools, including your
                IP address, browser type, pages visited, and time spent on
                the platform. If you contact us, we retain those
                communications.
              </p>
            </section>
            <hr />

            <section id="how-we-use-data">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                3. How We Use Your Data
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We use your data to: (a) process purchases and deliver
                products or course access; (b) send transactional emails such
                as receipts and password resets; (c) send marketing emails
                where you have opted in; (d) improve the platform through
                analytics; (e) comply with legal obligations; and (f) prevent
                fraud and maintain platform security.
              </p>
            </section>
            <hr />

            <section id="legal-basis">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                4. Legal Basis for Processing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We process your personal data on the following legal bases:
                contract performance (to fulfill your purchases), legitimate
                interests (to improve our services and prevent fraud),
                consent (for marketing emails and non-essential cookies), and
                legal obligation (when required by applicable law). You may
                withdraw consent at any time without affecting lawfulness of
                prior processing.
              </p>
            </section>
            <hr />

            <section id="data-sharing">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                5. Data Sharing
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We do not sell your personal data to third parties. We may
                share data with trusted service providers who process data on
                our behalf, including payment processors (Stripe,
                Flutterwave, M-Pesa), email platforms (Mailchimp), and
                analytics tools (Google Analytics). These providers are
                contractually bound to protect your data and use it only for
                the purposes we specify.
              </p>
            </section>
            <hr />

            <section id="cookies-tracking">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                6. Cookies &amp; Tracking
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We use essential cookies to keep you logged in and process
                transactions. We also use optional analytics cookies to
                understand how users interact with the platform. You can
                control non-essential cookies via your browser settings or
                our cookie preference centre. Disabling essential cookies may
                affect core functionality.
              </p>
            </section>
            <hr />

            <section id="data-retention">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                7. Data Retention
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We retain your personal data for as long as your account is
                active or as needed to provide services. Purchase records are
                retained for 7 years for financial compliance purposes.
                Marketing preferences and email lists are retained until you
                unsubscribe. You may request deletion of your data at any
                time, subject to our legal retention obligations.
              </p>
            </section>
            <hr />

            <section id="your-rights">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                8. Your Rights
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You have the right to: access the personal data we hold about
                you; correct inaccurate data; request deletion (&quot;right
                to be forgotten&quot;); restrict or object to processing;
                data portability; and withdraw consent. To exercise any of
                these rights, contact us at privacy@ilabgrowth.com. We will
                respond within 30 days.
              </p>
            </section>
            <hr />

            <section id="international-transfers">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                9. International Data Transfers
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                iLab Growth operates primarily from Kenya. Some of our
                service providers are based outside Africa. Where data is
                transferred internationally, we ensure appropriate safeguards
                are in place, including standard contractual clauses or
                equivalent protections as required by applicable data
                protection law.
              </p>
            </section>
            <hr />

            <section id="data-security">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                10. Data Security
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We implement industry-standard security measures including
                TLS encryption, secure password hashing, and access controls.
                However, no system is completely secure. We encourage you to
                use a strong, unique password and to notify us immediately if
                you suspect unauthorised access to your account.
              </p>
            </section>
            <hr />

            <section id="childrens-privacy">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                11. Children&apos;s Privacy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our services are intended for users aged 18 and over. We do
                not knowingly collect personal data from individuals under
                18. If you believe a minor has provided us with personal
                data, please contact us and we will delete it promptly.
              </p>
            </section>
            <hr />

            <section id="changes-to-policy">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                12. Changes to This Policy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We may update this Privacy Policy periodically. Changes will
                be posted on this page with a revised effective date.
                Continued use of our services after changes constitutes
                acceptance of the updated policy. For material changes, we
                will notify you by email.
              </p>
            </section>
            <hr />

            <section id="contact-dpo">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                13. Contact &amp; DPO
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                For all privacy-related queries, to exercise your rights, or
                to reach our Data Protection Officer, contact us at
                privacy@ilabgrowth.com or write to iLab Growth, Westlands
                Business Park, Nairobi, Kenya. We aim to respond to all
                requests within 30 days.
              </p>
            </section>
          </div>

          {/* CTA banner */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-blue-700 p-6 text-white sm:flex-row sm:items-center no-print">
            <div>
              <p
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                Privacy questions or data requests?
              </p>
              <p className="mt-1 text-sm text-blue-100">
                Email our DPO at privacy@ilabgrowth.com — we respond within
                30 days.
              </p>
            </div>
            <div className="flex flex-none gap-3">
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <a href="mailto:privacy@ilabgrowth.com">Contact Our DPO</a>
              </Button>
              <Button
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-blue-700"
                onClick={() => router.push(user ? "/dashboard" : "/login")}
              >
                {user ? "Back to Dashboard" : "Back to Sign In"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print">
        {user ? <DashboardFooter /> : <SiteFooter />}
      </div>
    </div>
  );
}