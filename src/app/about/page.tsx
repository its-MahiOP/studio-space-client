import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  GlobeIcon,
  HandshakeIcon,
  HeartHandshakeIcon,
  LeafIcon,
} from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "About us",
  description:
    "StudioSpace is a peer-to-peer marketplace for creative space. Independent hosts, transparent pricing and a smaller cut for the people who make the work.",
};

const values = [
  {
    number: "01",
    title: "Rooms before algorithms",
    body: "A studio is a physical place with a door, a floor and a particular light. We describe it honestly and let the room do the selling.",
    icon: GlobeIcon,
  },
  {
    number: "02",
    title: "A fairer split",
    body: "Hosts keep 95% of every booking. Creators see the full price before they commit. The platform takes a small, visible fee — nothing hidden in a service charge.",
    icon: HandshakeIcon,
  },
  {
    number: "03",
    title: "Care is infrastructure",
    body: "Verification, insurance and real support aren't premium add-ons. They're the reason a stranger can hand you the keys to a $200k room.",
    icon: HeartHandshakeIcon,
  },
  {
    number: "04",
    title: "Keep it local",
    body: "The money stays in the creative community. Every booking supports an independent host, a small stage or a workshop in someone's neighbourhood.",
    icon: LeafIcon,
  },
] as const;

const team = [
  {
    name: "Maya Chen",
    role: "Co-founder & host lead",
    image: "/images/avatars/ava.jpg",
    note: "Photographer, set designer, keeper of the cleanest cyc wall in Brooklyn.",
  },
  {
    name: "Marcus Reed",
    role: "Co-founder & operations",
    image: "/images/avatars/marcus.jpg",
    note: "Former gaffer. Knows what a three-phase supply actually means for your shoot.",
  },
  {
    name: "Noor Haddad",
    role: "Head of community",
    image: "/images/avatars/noor.jpg",
    note: "Podcast producer and the person who answers when you write in at 2am.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us / The people behind the rooms"
        title={
          <>
            We built the marketplace
            <br />
            we wanted to <span className="italic text-sodium">book.</span>
          </>
        }
        description="StudioSpace started with a simple frustration: the best rooms in a city are often empty, while the people who need them are stuck in a group chat. So we made the introduction."
        aside={
          <div className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-4">
            {[
              { value: "2021", label: "Founded" },
              { value: "48", label: "Cities" },
              { value: "1,200+", label: "Rooms" },
            ].map((stat) => (
              <div key={stat.label} className="border-t border-paper/18 pt-3">
                <p className="font-display text-2xl leading-none text-paper">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[10px] tracking-[0.14em] text-paper/45 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        }
      />

      <section className="py-20 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <p className="eyebrow flex items-center gap-3 text-muted-ink">
              <span className="inline-block size-1.5 bg-clay" />
              01 / The mission
            </p>
            <h2 className="display-lg mt-5">
              Make the room
              <br />
              <span className="italic text-clay">findable.</span>
            </h2>
            <div className="mt-6 space-y-4 text-[14px] leading-7 text-ink/72">
              <p>
                There are photo studios above laundromats, sound stages behind
                auto shops, and pottery wheels in basements that have never seen
                a listing. Meanwhile, a whole generation of creators is working
                from kitchen tables and asking the internet where to shoot.
              </p>
              <p>
                StudioSpace is an attempt to close that gap without turning the
                people who own these rooms into landlords, or the people who
                need them into customers. It&apos;s a directory, a checkout and a
                safety net — three things that make a peer-to-peer market feel
                less like a gamble.
              </p>
              <p>
                We&apos;re small on purpose. Every listing is reviewed by a human
                before it goes live. Every price is stated up front. And every
                booking is covered, because trust shouldn&apos;t be an upgrade.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/studios" variant="primary" size="md">
                Explore the index
                <ArrowUpRightIcon />
              </ButtonLink>
              <ButtonLink href="/add-studio" variant="outline" size="md">
                List a room
              </ButtonLink>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-[22px] bg-ink">
            <Image
              src="/images/studios/clay-table.jpg"
              alt="A working art studio with tables, tools and north light."
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="eyebrow text-paper/55">Field note 001</p>
              <p className="mt-3 max-w-sm font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-tight text-paper">
                “The room was already there. It just needed a front door.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-deep/45 py-20 sm:py-24">
        <div className="shell">
          <SectionHeading
            index="02"
            eyebrow="What we believe"
            title={
              <>
                Four rules
                <br />
                <span className="italic text-clay">we don&apos;t bend.</span>
              </>
            }
            description="These show up in the product, the fees and the way support answers the phone."
          />

          <div className="mt-11 grid gap-4 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.number}
                  className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-[20px] border border-ink/10 bg-card-cream p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-muted-ink">
                      {value.number}
                    </span>
                    <span className="grid size-10 place-items-center rounded-full border border-ink/10 bg-paper transition-colors group-hover:border-sodium group-hover:bg-sodium">
                      <Icon className="size-4" />
                    </span>
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="font-display text-2xl leading-none tracking-[-0.02em]">
                      {value.title}
                    </h3>
                    <p className="mt-3 max-w-[48ch] text-[13px] leading-6 text-muted-ink">
                      {value.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="shell">
          <SectionHeading
            index="03"
            eyebrow="The team"
            title={
              <>
                Small crew,
                <br />
                <span className="italic text-clay">real rooms.</span>
              </>
            }
            action={
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:text-clay"
              >
                Read the host guide
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            }
          />

          <div className="mt-11 grid gap-5 sm:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-paper-deep">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-4 left-4 inline-flex h-7 items-center rounded-full bg-paper/90 px-3 text-[10px] font-semibold tracking-[0.1em] text-ink uppercase backdrop-blur-sm">
                    {member.role}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl tracking-[-0.02em]">
                  {member.name}
                </h3>
                <p className="mt-2 text-[12px] leading-6 text-muted-ink">
                  {member.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grain grain-dark relative overflow-hidden bg-sodium text-ink">
        <div className="pointer-events-none absolute -right-24 -bottom-40 size-[480px] rounded-full border border-ink/12" />
        <div className="shell relative z-10 flex flex-col gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-ink/60">04 / Say hello</p>
            <h2 className="display-lg mt-5 max-w-3xl">
              Have a room?
              <br />
              <span className="italic">We&apos;d like to see it.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink/66">
              Tell us what you have and how you like to host. We&apos;ll walk you
              through the listing, the fees and the calendar — no pressure.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/add-studio" variant="primary" size="lg">
              List your space
              <ArrowUpRightIcon />
            </ButtonLink>
            <ButtonLink href="/studios" variant="outline" size="lg">
              Browse the index
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
