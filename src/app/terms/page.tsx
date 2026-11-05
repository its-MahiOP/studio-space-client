import type { Metadata } from "next";
import Link from "next/link";
import { MailIcon } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & privacy",
  description:
    "The terms of service and privacy summary for StudioSpace: bookings, cancellations, fees, cover and how we handle your data.",
};

const sections = [
  {
    id: "the-service",
    title: "01 / The service",
    body: [
      "StudioSpace is a marketplace that connects creators with independent hosts of creative space. We are not the owner or operator of any listed studio. The contract for the use of a space is between the creator and the host; StudioSpace provides the listing, the booking flow, payment handling and support.",
      "Listings are reviewed by a human before they go live. We may remove a listing or suspend an account if a space is misrepresented, unsafe, or used in a way that breaches these terms.",
    ],
  },
  {
    id: "bookings",
    title: "02 / Bookings & payment",
    body: [
      "When you book, your payment method is authorised for the full amount shown at checkout. For instant-book rooms, the booking is confirmed immediately. For request-only rooms, the host has 24 hours to accept, after which the authorisation is released.",
      "Payment is captured after the session ends. If a session does not go ahead, the authorisation is voided and no funds are taken. A 6% creator service fee applies to every booking and is shown before you confirm.",
      "Hosts receive 95% of the hourly subtotal, paid to their nominated bank account two business days after the session.",
    ],
  },
  {
    id: "cancellations",
    title: "03 / Changes & cancellations",
    body: [
      "Creators may reschedule or cancel free of charge up to 72 hours before the booked start time. Inside 72 hours, the host's cancellation policy applies and is shown on the listing before checkout.",
      "If a host cancels, StudioSpace will help you rebook or refund the full amount, including the service fee. Repeated host cancellations may result in removal from the marketplace.",
      "If a space is not as described on arrival, contact support within 24 hours. We may hold the host's payout while the case is reviewed.",
    ],
  },
  {
    id: "cover",
    title: "04 / Insurance & liability",
    body: [
      "Every confirmed booking includes $1M in third-party liability protection and equipment cover up to $25k, subject to the gear list being agreed in writing before the session. Personal belongings, cash and vehicles are not covered.",
      "Creators are responsible for the safe operation of their equipment and for the conduct of their crew. Hosts are responsible for the safety of the space and for disclosing known hazards.",
      "Cover is provided by our insurance partners and is subject to their policy terms. It is not a substitute for a creator's own equipment insurance.",
    ],
  },
  {
    id: "conduct",
    title: "05 / Conduct & content",
    body: [
      "Be accurate, be on time, and leave the room as you found it. Discrimination, harassment, illegal activity and unauthorised commercial filming are grounds for immediate removal.",
      "Reviews must reflect a real session. We remove reviews that are abusive, extortionate or clearly unrelated to the booking.",
      "Photos and descriptions on a listing must be of the actual space. Staged or stock imagery must be labelled as representative.",
    ],
  },
  {
    id: "privacy",
    title: "06 / Privacy",
    body: [
      "We collect the information needed to run a booking: your name, contact details, payment token and messages with your host. We do not sell personal data.",
      "Payment details are handled by our payment processor; StudioSpace does not store full card numbers. Exact studio addresses are shared only with confirmed guests.",
      "You can request a copy or deletion of your data by emailing us. Some records are retained where required for tax, fraud prevention or insurance.",
    ],
  },
  {
    id: "changes",
    title: "07 / Changes to these terms",
    body: [
      "We may update these terms as the marketplace develops. Material changes will be announced by email or in-product at least 14 days before they take effect. Continued use of StudioSpace after that date means you accept the updated terms.",
      "This is a demonstration site. Bookings, payments and cover described here are illustrative and do not create a real contract.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal / Terms & privacy"
        title={
          <>
            The short version,
            <br />
            <span className="italic text-sodium">in plain English.</span>
          </>
        }
        description="A marketplace only works when everyone knows the rules. Here's what you agree to when you book or host on StudioSpace, without the forty-page preamble."
        aside={
          <div className="rounded-2xl border border-paper/16 bg-paper/5 p-5">
            <p className="eyebrow text-paper/45">Last updated</p>
            <p className="mt-2 font-display text-2xl">1 November 2026</p>
            <p className="mt-2 text-[11px] leading-5 text-paper/45">
              This is a demo project. Nothing here constitutes legal advice or a
              real booking contract.
            </p>
          </div>
        }
      />

      <div className="shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-[94px] lg:self-start">
          <p className="eyebrow text-muted-ink">On this page</p>
          <nav aria-label="Terms sections" className="mt-4 flex flex-col gap-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg px-2 py-2 text-[12px] text-ink/62 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {section.title}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-ink/12 bg-card-cream p-4">
            <MailIcon className="size-4 text-clay" />
            <p className="mt-3 text-[12px] font-semibold">Questions?</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-ink">
              Write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-ink underline decoration-sodium decoration-2 underline-offset-2"
              >
                {site.email}
              </a>
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="space-y-10">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-ink/12 pt-7"
              >
                <h2 className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none tracking-[-0.02em]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="max-w-[70ch] text-[13px] leading-7 text-ink/72"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-[20px] border border-ink/12 bg-paper-deep/45 p-6 text-[12px] leading-6 text-muted-ink">
            By using StudioSpace you agree to these terms and to our privacy
            summary. If you don&apos;t agree, please don&apos;t book or list a
            space. Questions about a specific booking should go through the
            support thread on that booking.
          </div>
        </div>
      </div>
    </>
  );
}
