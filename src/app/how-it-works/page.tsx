import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  ClapperboardIcon,
  CreditCardIcon,
  HeadphonesIcon,
  SearchIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonLink } from "@/components/shared/button-link";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From search to wrap: how booking a studio on StudioSpace works for creators, and what hosts can expect when they list a space.",
};

const creatorSteps = [
  {
    number: "01",
    title: "Search with intention",
    body: "Filter by craft, city, budget and the details that matter: blackout, load-in, capacity, power. Every listing has the facts up front, not buried in a message thread.",
    icon: SearchIcon,
    note: "12 vetted rooms in the demo index",
  },
  {
    number: "02",
    title: "Pick your exact hours",
    body: "See the real calendar, not a vague 'available soon'. Choose your date, start time and duration, add your crew size, and watch the price update before you commit.",
    icon: CalendarDaysIcon,
    note: "Transparent hourly pricing",
  },
  {
    number: "03",
    title: "Book or request",
    body: "Instant-book rooms confirm on the spot. Request-only rooms send a short note to the host, who replies with a yes or a better time. Payment is held until the session ends.",
    icon: CreditCardIcon,
    note: "Funds released after the shoot",
  },
  {
    number: "04",
    title: "Shoot, wrap, repeat",
    body: "You get the address, load-in notes and host contact once confirmed. Support is on call if the day shifts. When you wrap, the room goes back on the calendar.",
    icon: ClapperboardIcon,
    note: "24/7 support on every booking",
  },
] as const;

const hostSteps = [
  {
    number: "01",
    title: "List the room",
    body: "Add photos, set your hourly rate, list the kit you already have and block the hours you can't host. The form takes about ten minutes.",
  },
  {
    number: "02",
    title: "Set your terms",
    body: "Choose instant book or approve each request. Add house rules, load-in notes and a capacity limit. You keep control of the calendar.",
  },
  {
    number: "03",
    title: "Host the session",
    body: "Meet the crew, hand over the keys, stay reachable. StudioSpace handles the payment, the paperwork and the liability cover.",
  },
  {
    number: "04",
    title: "Get paid",
    body: "Payouts land two business days after the session. No chasing invoices, no cash in an envelope, no awkward follow-up texts.",
  },
] as const;

const faqs = [
  {
    question: "What does StudioSpace charge?",
    answer:
      "Creators pay a 6% service fee on top of the host's hourly rate. Hosts pay a flat 5% platform fee. There are no listing fees, no subscription and no charge for cancelling within the policy window.",
  },
  {
    question: "How is my payment protected?",
    answer:
      "Card payments are authorised when you book and captured after the session ends. If a room isn't as described, open a case within 24 hours and support will hold the payout while it's reviewed.",
  },
  {
    question: "Can I visit a studio before booking?",
    answer:
      "Yes. Message the host from the listing and ask for a walkthrough. Most hosts offer a 15-minute look before a first booking, subject to availability.",
  },
  {
    question: "What happens if my plans change?",
    answer:
      "Reschedule free up to 72 hours before your start time. Inside 72 hours, the host's cancellation policy applies. If the host cancels, you're rebooked or fully refunded.",
  },
  {
    question: "Is equipment covered?",
    answer:
      "Every booking includes $1M in liability protection and gear cover up to $25k, provided the gear list was agreed before the session. Personal items are not covered.",
  },
  {
    question: "How do hosts get paid?",
    answer:
      "Payouts go to your bank account two business days after the session. You can see every booking, payout and fee in the host dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works / A clear path to the room"
        title={
          <>
            From the first search
            <br />
            to the final <span className="italic text-sodium">wrap.</span>
          </>
        }
        description="StudioSpace removes the email chains and the guesswork. Here's exactly what happens when you book a room, and what happens when you list one."
        aside={
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/studios" variant="accent" size="lg">
              Find a studio
              <ArrowUpRightIcon />
            </ButtonLink>
            <ButtonLink
              href="/add-studio"
              variant="outline-light"
              size="lg"
            >
              List your space
            </ButtonLink>
          </div>
        }
      />

      <section className="py-20 sm:py-24">
        <div className="shell">
          <SectionHeading
            index="01"
            eyebrow="For creators"
            title={
              <>
                Four steps,
                <br />
                <span className="italic text-clay">no surprises.</span>
              </>
            }
            description="The booking flow is designed to answer the questions you'd otherwise ask in a DM at 11pm."
          />

          <div className="mt-11 grid gap-4 sm:grid-cols-2">
            {creatorSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.number}
                  className="group flex min-h-[280px] flex-col rounded-[20px] border border-ink/10 bg-card-cream p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-5xl leading-none text-clay/80">
                      {step.number}
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border border-ink/10 bg-paper transition-colors group-hover:border-sodium group-hover:bg-sodium">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <div className="mt-auto pt-14">
                    <h3 className="font-display text-[clamp(1.5rem,2.3vw,2rem)] leading-none tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-6 text-muted-ink">
                      {step.body}
                    </p>
                    <p className="mt-5 text-[10px] font-medium tracking-[0.14em] text-clay uppercase">
                      {step.note}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-deep/45 py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-ink">
            <Image
              src="/images/studios/northlight-stage.jpg"
              alt="A production stage with lighting rigged and ready for a crew."
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="eyebrow text-paper/55">For hosts</p>
              <p className="mt-3 max-w-sm font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight text-paper">
                Your calendar, your rate, your rules.
              </p>
            </div>
          </div>

          <div>
            <SectionHeading
              index="02"
              eyebrow="For hosts"
              title={
                <>
                  List once,
                  <br />
                  <span className="italic text-clay">host on your terms.</span>
                </>
              }
              description="You already have the room. StudioSpace gives it a calendar, a checkout and an insurance policy."
            />
            <ol className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
              {hostSteps.map((step) => (
                <li key={step.number} className="flex gap-5 py-5">
                  <span className="font-mono text-[10px] text-ink/35">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-6 text-muted-ink">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="shell">
          <SectionHeading
            index="03"
            eyebrow="Cover, built in"
            title={
              <>
                Both sides are
                <br />
                <span className="italic text-clay">looked after.</span>
              </>
            }
          />
          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Liability cover",
                body: "$1M per booking, applied automatically. No forms.",
              },
              {
                icon: BadgeCheckIcon,
                title: "Verified people",
                body: "ID and payment checks before the first booking.",
              },
              {
                icon: WrenchIcon,
                title: "Gear protection",
                body: "Up to $25k cover on agreed equipment lists.",
              },
              {
                icon: HeadphonesIcon,
                title: "Real support",
                body: "A person on call, average reply under eight minutes.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-ink/10 bg-card-cream p-6"
                >
                  <Icon className="size-5 text-clay" />
                  <h3 className="mt-8 text-[14px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[12px] leading-6 text-muted-ink">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-deep/40 py-20 sm:py-24">
        <div className="shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow flex items-center gap-3 text-muted-ink">
              <span className="inline-block size-1.5 bg-clay" />
              04 / Questions
            </p>
            <h2 className="display-lg mt-5">
              The things
              <br />
              <span className="italic text-clay">people ask.</span>
            </h2>
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-muted-ink">
              Still stuck? Email{" "}
              <a
                href="mailto:hello@studiospace.demo"
                className="text-ink underline decoration-sodium decoration-2 underline-offset-4"
              >
                hello@studiospace.demo
              </a>{" "}
              and a human will write back.
            </p>
          </div>

          <Accordion className="border-t border-ink/15">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-5 text-[14px] font-medium">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] text-ink/35">
                      0{index + 1}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-8 text-[13px] leading-6 text-muted-ink">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
