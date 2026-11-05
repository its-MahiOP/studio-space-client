import {
  CalendarDaysIcon,
  ClapperboardIcon,
  CreditCardIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    number: "01",
    title: "Discover spaces",
    description:
      "Filter by craft, neighbourhood, budget and the details that actually matter on the day.",
    icon: SearchIcon,
  },
  {
    number: "02",
    title: "Select shoot hours",
    description:
      "Inspect real availability, choose the exact hours you need and see the price before you commit.",
    icon: CalendarDaysIcon,
  },
  {
    number: "03",
    title: "Book instantly",
    description:
      "Instant-book a room or send a request. Payment is held securely until the session is done.",
    icon: CreditCardIcon,
  },
  {
    number: "04",
    title: "Create & produce",
    description:
      "Arrive, shoot, wrap. Your host is one message away and support is on call if plans change.",
    icon: ClapperboardIcon,
  },
] as const;

export function BookingSteps() {
  return (
    <section className="grain grain-dark relative overflow-hidden bg-ink py-20 text-paper sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -top-32 right-0 size-[460px] rounded-full bg-sodium/8 blur-3xl" />
      <div className="shell relative z-10">
        <SectionHeading
          tone="dark"
          index="03"
          eyebrow="How booking works"
          title={
            <>
              From idea to call sheet
              <br />
              <span className="italic text-sodium">in four steps.</span>
            </>
          }
          description="No email chains, no invoices in a notes app. A clear path from discovering a room to walking into it with your crew."
          action={
            <ButtonLink href="/how-it-works" variant="outline-light" size="md">
              Full walkthrough
              <SparklesIcon />
            </ButtonLink>
          }
        />

        <div className="mt-12 grid overflow-hidden rounded-[22px] border border-paper/12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="group relative flex min-h-[270px] flex-col border-paper/12 bg-ink/55 p-6 transition-colors duration-500 hover:bg-paper/5 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0 [&:not(:last-child)]:border-b sm:[&:nth-child(3)]:border-b-0 lg:[&:not(:last-child)]:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl leading-none text-sodium/85">
                    {step.number}
                  </span>
                  <Icon className="size-5 text-paper/28 transition-colors group-hover:text-sodium/70" />
                </div>
                <div className="mt-auto pt-12">
                  <h3 className="font-display text-[clamp(1.4rem,2vw,1.75rem)] leading-tight tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[12px] leading-6 text-paper/52">
                    {step.description}
                  </p>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sodium/0 to-transparent transition-all duration-500 group-hover:via-sodium/50" />
              </article>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col gap-2 text-[10px] tracking-[0.14em] text-paper/38 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>Average time from search to confirmed booking: 4 minutes</p>
          <p className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-sodium" />
            No hidden fees, ever
          </p>
        </div>
      </div>
    </section>
  );
}
