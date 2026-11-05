import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  RulerIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { getCategory } from "@/data/categories";
import { studios } from "@/data/studios";
import {
  getRelatedStudios,
  getStudioBySlug,
} from "@/lib/studios";
import { formatCurrency, formatRating } from "@/lib/format";
import { BookingCard } from "@/components/studios/booking-card";
import { MobileBookingBar } from "@/components/studios/mobile-booking-bar";
import { StudioGallery } from "@/components/studios/studio-gallery";
import { StudioCard } from "@/components/studios/studio-card";

interface StudioPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return studios.map((studio) => ({ slug: studio.slug }));
}

export async function generateMetadata({
  params,
}: StudioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);

  if (!studio) {
    return { title: "Studio not found" };
  }

  return {
    title: studio.title,
    description: `${studio.title} in ${studio.location.neighborhood}, ${studio.location.city}. ${studio.sizeSqft.toLocaleString()} sq ft from ${formatCurrency(studio.hourlyRate)}/hour.`,
    openGraph: {
      title: `${studio.title} · StudioSpace`,
      description: studio.description.slice(0, 180),
      images: [{ url: studio.image }],
    },
  };
}

export default async function StudioDetailPage({ params }: StudioPageProps) {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);

  if (!studio) {
    notFound();
  }

  const category = getCategory(studio.category);
  const related = getRelatedStudios(studio, 3);

  return (
    <div className="pb-24">
      <div className="shell pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-muted-ink">
          <Link href="/studios" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
            <ArrowLeftIcon className="size-3" />
            All studios
          </Link>
          <span className="text-ink/25">/</span>
          <Link
            href={`/studios?category=${studio.category}`}
            className="transition-colors hover:text-ink"
          >
            {category?.label}
          </Link>
          <span className="text-ink/25">/</span>
          <span className="truncate text-ink/60">{studio.title}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="min-w-0">
            <StudioGallery images={studio.gallery} title={studio.title} />

            <header className="mt-8 border-b border-ink/10 pb-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-7 items-center rounded-full bg-ink px-3 text-[10px] font-semibold tracking-[0.12em] text-paper uppercase">
                  {category?.label}
                </span>
                {studio.instantBook ? (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-sage/40 bg-sage/10 px-3 text-[10px] font-semibold tracking-[0.1em] text-sage-ink uppercase">
                    <span className="size-1.5 rounded-full bg-sage" />
                    Instant book
                  </span>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-clay/30 bg-clay/8 px-3 text-[10px] font-semibold tracking-[0.1em] text-clay uppercase">
                    On request
                  </span>
                )}
              </div>

              <h1 className="display-lg mt-5">{studio.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-ink">
                <span className="inline-flex items-center gap-1.5">
                  <StarIcon className="size-3.5 fill-sodium stroke-sodium" />
                  <span className="font-semibold text-ink">
                    {formatRating(studio.rating)}
                  </span>
                  ({studio.reviews} reviews)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5 text-clay" />
                  {studio.location.neighborhood}, {studio.location.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon className="size-3.5" />
                  Up to {studio.capacity} people
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RulerIcon className="size-3.5" />
                  {studio.sizeSqft.toLocaleString()} sq ft
                </span>
              </div>
            </header>

            <div className="mt-7 flex items-start gap-4 border-b border-ink/10 pb-7">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-paper-deep">
                <Image
                  src={studio.host.avatar}
                  alt={studio.host.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">
                  Hosted by {studio.host.name}
                  {studio.host.verified ? (
                    <BadgeCheckIcon className="ml-1 inline size-3.5 text-sage" />
                  ) : null}
                </p>
                <p className="mt-1 text-[11px] text-muted-ink">
                  Hosting since {studio.host.since} · Replies {studio.host.responseTime}
                </p>
              </div>
              <Link
                href="/about"
                className="ml-auto hidden shrink-0 text-[11px] font-medium text-clay transition-colors hover:text-ink sm:block"
              >
                Host profile →
              </Link>
            </div>

            <section className="mt-8" aria-labelledby="about-space">
              <p className="eyebrow text-muted-ink">01 / The space</p>
              <h2 id="about-space" className="display-md mt-3">
                About this room
              </h2>
              <p className="mt-4 max-w-[70ch] text-[14px] leading-7 text-ink/72">
                {studio.description}
              </p>
            </section>

            <section className="mt-9" aria-labelledby="amenities">
              <p className="eyebrow text-muted-ink">02 / What&apos;s included</p>
              <h2 id="amenities" className="display-md mt-3">
                Amenities &amp; kit
              </h2>
              <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-3 border-b border-ink/8 pb-3 text-[13px] text-ink/75"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-sage/15 text-sage-ink">
                      <CheckIcon className="size-3" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-9" aria-labelledby="policies">
              <p className="eyebrow text-muted-ink">03 / Good to know</p>
              <h2 id="policies" className="display-md mt-3">
                House rules
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: ClockIcon,
                    title: "Hours",
                    body: "Sessions run 8am–11pm. Overtime is billed in 30-minute blocks.",
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: "Cover",
                    body: "Every booking includes $1M liability protection at no extra cost.",
                  },
                  {
                    icon: CalendarCheckIcon,
                    title: "Changes",
                    body: "Reschedule free up to 72 hours before your start time.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-ink/10 bg-card-cream p-4"
                    >
                      <Icon className="size-4 text-clay" />
                      <p className="mt-4 text-[12px] font-semibold">{item.title}</p>
                      <p className="mt-1.5 text-[11px] leading-5 text-muted-ink">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-9 rounded-[20px] border border-ink/10 bg-paper-deep/45 p-6">
              <p className="eyebrow text-muted-ink">04 / Getting there</p>
              <h2 className="mt-3 font-display text-2xl tracking-[-0.02em]">
                {studio.location.neighborhood}, {studio.location.city}
              </h2>
              <p className="mt-2 max-w-xl text-[12px] leading-6 text-muted-ink">
                Exact address and load-in notes are shared once your booking is
                confirmed. {studio.host.name} usually replies {studio.host.responseTime}.
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.12em] text-clay uppercase">
                <MapPinIcon className="size-3.5" />
                {studio.location.city}
              </div>
            </section>
          </div>

          <div id="book" className="scroll-mt-24">
            <BookingCard studio={studio} />
          </div>
        </div>

        <MobileBookingBar
          rate={studio.hourlyRate}
          rating={studio.rating}
          reviews={studio.reviews}
        />

        <section className="mt-20" aria-labelledby="related-studios">
          <div className="flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-ink">Similar rooms</p>
              <h2 id="related-studios" className="display-md mt-3">
                More {category?.label.toLowerCase()}
              </h2>
            </div>
            <Link
              href={`/studios?category=${studio.category}`}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:text-clay"
            >
              See all {category?.label.toLowerCase()}
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>

          {related.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((item) => (
                <StudioCard key={item.slug} studio={item} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[13px] text-muted-ink">
              This is the only {category?.label.toLowerCase().replace(/s$/, "")} on
              the books right now — browse the full index for other crafts.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
