import {
  BadgeCheckIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

const assurances = [
  {
    number: "01",
    title: "Liability protection",
    description:
      "Every confirmed booking includes $1M in liability cover, arranged by StudioSpace and applied automatically.",
    note: "Included on every booking",
    icon: ShieldCheckIcon,
  },
  {
    number: "02",
    title: "Verified profiles",
    description:
      "Hosts and guests complete ID and payment verification before their first booking. Reviews stay tied to real sessions.",
    note: "ID + payment checked",
    icon: BadgeCheckIcon,
  },
  {
    number: "03",
    title: "Equipment safety",
    description:
      "Gear lists are agreed before the session, with clear house rules and a documented process if something gets damaged.",
    note: "Gear covered up to $25k",
    icon: WrenchIcon,
  },
  {
    number: "04",
    title: "24/7 host support",
    description:
      "A real person on call for lockouts, late crews and last-minute changes. Hosts get help; creators get an answer.",
    note: "Average reply under 8 min",
    icon: HeadphonesIcon,
  },
] as const;

export function HostGuarantee() {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Host guarantee & creator support"
          title={
            <>
              The safety net is
              <br />
              <span className="italic text-clay">part of the service.</span>
            </>
          }
          description="A marketplace only works when both sides feel looked after. These four things are built into every StudioSpace booking, not sold as an upgrade."
        />

        <div className="mt-11 grid gap-4 sm:grid-cols-2">
          {assurances.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.number}
                className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-[20px] border border-ink/10 bg-card-cream p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[var(--shadow-soft)] sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-muted-ink">
                    {item.number}
                  </span>
                  <span className="grid size-11 place-items-center rounded-full border border-ink/10 bg-paper text-ink transition-colors duration-500 group-hover:border-sodium group-hover:bg-sodium">
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="mt-auto pt-14">
                  <h3 className="font-display text-[clamp(1.5rem,2.3vw,2rem)] leading-none tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[13px] leading-6 text-muted-ink">
                    {item.description}
                  </p>
                  <p className="mt-5 text-[10px] font-medium tracking-[0.14em] text-clay uppercase">
                    {item.note}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
