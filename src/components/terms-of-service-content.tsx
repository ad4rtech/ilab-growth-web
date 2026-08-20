"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Landmark,
  Info,
  Calendar,
  RotateCw,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "use-of-services", title: "2. Use of Services" },
  { id: "account-registration", title: "3. Account Registration" },
  { id: "purchases-payments", title: "4. Purchases & Payments" },
  { id: "refund-policy", title: "5. Refund Policy" },
  { id: "intellectual-property", title: "6. Intellectual Property" },
  { id: "prohibited-conduct", title: "7. Prohibited Conduct" },
  { id: "limitation-of-liability", title: "8. Limitation of Liability" },
  { id: "privacy-data", title: "9. Privacy & Data" },
  { id: "governing-law", title: "10. Governing Law" },
  { id: "changes-to-terms", title: "11. Changes to Terms" },
  { id: "contact-us", title: "12. Contact Us" },
];

export function TermsOfServiceContent({
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

  return (
    <div className="flex min-h-screen flex-col">
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

      {/* Hero */}
      <div className="bg-orange-50/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href={user ? "/dashboard" : "/"} className="hover:underline">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-blue-700 text-white">
              <Landmark className="h-5 w-5" />
            </span>
            <h1
              style={{ fontFamily: "var(--font-ubuntu)" }}
              className="text-3xl font-bold sm:text-4xl"
            >
              Terms of Service
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Please read these Terms carefully before using iLab Growth. By
            accessing our platform, you agree to be bound by the conditions
            outlined below.
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
              Governing law: Kenya
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        {/* Sidebar TOC - desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border p-4">
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
        </aside>

        {/* Mobile TOC - dropdown */}
        <div className="lg:hidden">
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
              <p className="text-sm font-semibold text-blue-900">Summary</p>
              <p className="mt-1 text-sm text-blue-900/80">
                These Terms cover your rights and responsibilities when using
                iLab Growth. Key points: you must be 18+, you may not
                redistribute paid content, we offer a 7-day refund policy, and
                all disputes are governed by Kenyan law.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section id="acceptance">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                1. Acceptance of Terms
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                By accessing or using the iLab Growth website, courses,
                digital products, or any related services (collectively,
                &quot;Services&quot;), you agree to be bound by these Terms of
                Service (&quot;Terms&quot;). If you do not agree to these
                Terms, please do not use our Services. We reserve the right
                to modify these Terms at any time, and continued use of our
                Services constitutes acceptance of any updates.
              </p>
            </section>
            <hr />

            <section id="use-of-services">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                2. Use of Services
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You must be at least 18 years of age to create an account and
                purchase from iLab Growth. You agree to use the Services only
                for lawful purposes and in a manner consistent with all
                applicable local, national, and international laws. You may
                not resell, redistribute, or share any purchased digital
                products or course content with third parties without written
                consent from iLab Growth.
              </p>
            </section>
            <hr />

            <section id="account-registration">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                3. Account Registration
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To access certain features, you must register for an account.
                You are responsible for maintaining the confidentiality of
                your login credentials and for all activities that occur
                under your account. You agree to notify us immediately of any
                unauthorized use of your account. iLab Growth is not liable
                for any loss resulting from unauthorized use of your account.
              </p>
            </section>
            <hr />

            <section id="purchases-payments">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                4. Purchases &amp; Payments
              </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              All purchases are processed securely through our supported
              payment providers, including credit/debit card, PayPal, and
              M-Pesa. Prices are listed in Kenyan Shillings (KES) unless
              otherwise stated. By completing a purchase, you authorize iLab
              Growth to charge your selected payment method. All sales are
              subject to our Refund Policy outlined in Section 5.
            </p>
            </section>
            <hr />

            <section id="refund-policy">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                5. Refund Policy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We offer a 7-day money-back guarantee on all digital products
                and online courses, provided that less than 20% of the course
                content has been accessed or downloaded. Refund requests must
                be submitted via email to support@ilabgrowth.com within 7
                days of purchase. Refunds are not available for consulting
                services once the engagement has commenced. Processing may
                take 5-10 business days depending on your payment provider.
              </p>
            </section>
            <hr />

            <section id="intellectual-property">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                6. Intellectual Property
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                All content on iLab Growth — including but not limited to
                course materials, templates, guides, spreadsheets, graphics,
                logos, and written content — is the intellectual property of
                iLab Growth or its contributors and is protected under
                applicable copyright and intellectual property law. You are
                granted a limited, non-transferable, personal licence to use
                purchased content for your own business purposes only.
              </p>
            </section>
            <hr />

            <section id="prohibited-conduct">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                7. Prohibited Conduct
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                You agree not to: (a) copy, reproduce, or redistribute paid
                content; (b) use our platform to distribute spam, malware, or
                illegal content; (c) impersonate another user or misrepresent
                your affiliation with any organisation; (d) attempt to gain
                unauthorised access to any portion of our systems; or (e)
                engage in any activity that disrupts or interferes with the
                proper functioning of the Services.
              </p>
            </section>
            <hr />

            <section id="limitation-of-liability">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                8. Limitation of Liability
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                iLab Growth provides its Services on an &quot;as is&quot;
                basis. To the fullest extent permitted by law, iLab Growth
                shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of,
                or inability to use, our Services. Our total liability to you
                shall not exceed the total amount you paid to iLab Growth in
                the 12 months preceding the claim.
              </p>
            </section>
            <hr />

            <section id="privacy-data">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                9. Privacy &amp; Data
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your use of our Services is also governed by our Privacy
                Policy, which is incorporated into these Terms by reference.
                By using our Services, you consent to the collection and use
                of your information as described in the Privacy Policy. We do
                not sell personal data to third parties.
              </p>
            </section>
            <hr />

            <section id="governing-law">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                10. Governing Law
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                These Terms shall be governed by and construed in accordance
                with the laws of Kenya, without regard to its conflict of law
                provisions. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts of
                Nairobi, Kenya.
              </p>
            </section>
            <hr />

            <section id="changes-to-terms">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                11. Changes to Terms
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We reserve the right to update or modify these Terms at any
                time without prior notice. Changes will be posted on this page
                with a revised effective date. Your continued use of the
                Services after any changes constitutes your acceptance of the
                new Terms. We encourage you to review this page periodically.
              </p>
            </section>
            <hr />

            <section id="contact-us">
              <h2
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                12. Contact Us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If you have any questions about these Terms of Service,
                please contact us at legal@ilabgrowth.com or write to us at
                iLab Growth, Westlands Business Park, Nairobi, Kenya.
              </p>
            </section>
          </div>

          {/* CTA banner */}
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl bg-blue-700 p-6 text-white sm:flex-row sm:items-center">
            <div>
              <p
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold"
              >
                Questions about our Terms?
              </p>
              <p className="mt-1 text-sm text-blue-100">
                Our team is happy to clarify anything before you sign up.
              </p>
            </div>
            <div className="flex flex-none gap-3">
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <a href="mailto:support@ilabgrowth.com">Contact Support</a>
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

      {user ? <DashboardFooter /> : <SiteFooter />}
    </div>
  );
}