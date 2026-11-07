"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BadgeCheckIcon,
  CalendarCheckIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { getCategoryForValue } from "@/data/categories";
import { relatedStudios } from "@/lib/studios";
import { formatCurrency, formatRating } from "@/lib/format";
import { useStudio, useStudios } from "@/hooks/use-api-data";
import { BookingModal } from "@/components/studios/booking-modal";
import { BookingPanel } from "@/components/studios/booking-panel";
import { MobileBookingBar } from "@/components/studios/mobile-booking-bar";
import { ReviewsSection } from "@/components/studios/reviews-section";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioImage } from "@/components/shared/studio-image";
import { DataError } from "@/components/shared/data-states";

function DetailSkeleton() {
  return (
    <div className="shell py-8">
      <div className="h-4 w-56 animate-pulse rounded bg-paper-deep" />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="aspect-[4/3] animate-pulse rounded-[20px] bg-paper-deep sm:aspect-[16/11]" />
          <div className="mt-8 space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-paper-deep" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-paper-deep" />
            <div className="h-24 w-full animate-pulse rounded bg-paper-deep/70" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-[22px] bg-paper-deep" />
      </div>
    </div>
  );
}

export function StudioDetail() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const { data: studio, loading, error, reload } = useStudio(id);
  const { data: allStudios } = useStudios();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) return <DetailSkeleton />;

  if (error || !studio) {
    const notFound = !error || error.toLowerCase().includes("not found");
    return (
      <div className="shell py-16 sm:py-20">
        {notFound ? (
          <div className="mx-auto max-w-xl rounded-[22px] border border-ink/12 bg-card-cream p-8 text-center sm:p-12">
            <p className="eyebrow text-clay">404 / Studio not found</p>
            <h1 className="display-lg mt-4">
              This door doesn&apos;t
              <br />
              <span className="italic text-clay">open onto a studio.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[13px] leading-6 text-muted-ink">
              The listing may have been removed by its host, or the link is
              incomplete.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
            >
              <ArrowLeftIcon className="size-4" />
              Back to the index
            </Link>
          </div>
        ) : (
          <DataError message={error ?? "The studio could not be loaded."} onRetry={reload} />
        )}
      </div>
    );
  }

  const category = getCategoryForValue(studio.category);
  const categoryHref = category
    ? `/studios?category=${category.slug}`
    : "/studios";
  const images = Array.from(
    new Set(
      [studio.imageUrl, ...(studio.images ?? [])].filter(
        (image): image is string => Boolean(image),
      ),
    ),
  );
  const related = relatedStudios(studio, allStudios, 3);

  return (
    <div className="pb-28 lg:pb-24">
      <div className="shell pt-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[11px] text-muted-ink"
        >
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="size-3" />
            All studios
          </Link>
          <span className="text-ink/25">/</span>
          <Link href={categoryHref} className="transition-colors hover:text-ink">
            {category?.label ?? studio.category}
          </Link>
          <span className="text-ink/25">/</span>
          <span className="truncate text-ink/60">{studio.title}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="min-w-0">
            <div className="grid gap-2.5">
              <div className="relative overflow-hidden rounded-[20px]">
                <StudioImage
                  src={images[activeImage] ?? images[0]}
                  alt={`${studio.title} — view ${activeImage + 1}`}
                  priority
                  className="aspect-[4/3] sm:aspect-[16/11]"
                />
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          (current) =>
                            (current - 1 + images.length) % images.length,
                        )
                      }
                      aria-label={`Previous photo, ${images.length} in gallery`}
                      className="absolute top-1/2 left-3 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-paper/40 bg-ink/55 text-paper backdrop-blur-sm transition-colors hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-sodium/70"
                    >
                      <ArrowLeftIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage(
                          (current) => (current + 1) % images.length,
                        )
                      }
                      aria-label={`Next photo, ${images.length} in gallery`}
                      className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-paper/40 bg-ink/55 text-paper backdrop-blur-sm transition-colors hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-sodium/70"
                    >
                      <ArrowRightIcon className="size-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="absolute right-3 bottom-3 rounded-full bg-ink/65 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-paper backdrop-blur-sm"
                    >
                      {String(activeImage + 1).padStart(2, "0")} /{" "}
                      {String(images.length).padStart(2, "0")}
                    </span>
                  </>
                ) : null}
              </div>
              {images.length > 1 ? (
                <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show image ${index + 1} of ${images.length}`}
                      aria-pressed={activeImage === index}
                      className={
                        activeImage === index
                          ? "shrink-0 rounded-xl border-2 border-ink opacity-100"
                          : "shrink-0 rounded-xl border-2 border-transparent opacity-60 transition-opacity hover:opacity-100"
                      }
                    >
                      <StudioImage
                        src={image}
                        alt=""
                        className="aspect-[4/3] w-24 rounded-lg sm:w-32"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <header className="mt-8 border-b border-ink/10 pb-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex h-7 items-center rounded-full bg-ink px-3 text-[10px] font-semibold tracking-[0.12em] text-paper uppercase">
                  {category?.value ?? studio.category}
                </span>
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-sage/40 bg-sage/10 px-3 text-[10px] font-semibold tracking-[0.1em] text-sage-ink uppercase">
                  <span className="size-1.5 rounded-full bg-sage" />
                  Accepting bookings
                </span>
              </div>

              <h1 className="display-lg mt-5">{studio.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-ink">
                <span className="inline-flex items-center gap-1.5">
                  <StarIcon
                    className={
                      studio.rating > 0
                        ? "size-3.5 fill-sodium stroke-sodium"
                        : "size-3.5 stroke-muted-ink"
                    }
                  />
                  <span className="font-semibold text-ink">
                    {studio.rating > 0 ? formatRating(studio.rating) : "New"}
                  </span>
                  {studio.rating > 0 ? "creator rating" : "no reviews yet"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5 text-clay" />
                  {studio.location || "Location on request"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon className="size-3.5" />
                  Up to {studio.maxCapacity} people
                </span>
              </div>
            </header>

            <div className="mt-7 flex items-start gap-4 border-b border-ink/10 pb-7">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper-deep font-display text-lg text-ink/60">
                {(studio.ownerName || "H").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">
                  Hosted by {studio.ownerName || "an independent host"}
                  <BadgeCheckIcon className="ml-1 inline size-3.5 text-sage" />
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-ink">
                  <span className="inline-flex items-center gap-1">
                    <MailIcon className="size-3" />
                    {studio.ownerEmail}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="size-3" />
                    Replies within a day
                  </span>
                </p>
              </div>
            </div>

            <section className="mt-8" aria-labelledby="about-space">
              <p className="eyebrow text-muted-ink">01 / The space</p>
              <h2 id="about-space" className="display-md mt-3">
                About this room
              </h2>
              <p className="mt-4 max-w-[70ch] whitespace-pre-line text-[14px] leading-7 text-ink/72">
                {studio.overview || "The host hasn't written an overview yet."}
              </p>
            </section>

            <section className="mt-9" aria-labelledby="amenities">
              <p className="eyebrow text-muted-ink">02 / What&apos;s included</p>
              <h2 id="amenities" className="display-md mt-3">
                Amenities &amp; kit
              </h2>
              {studio.amenities.length > 0 ? (
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
              ) : (
                <p className="mt-3 text-[12px] text-muted-ink">
                  The host hasn&apos;t listed specific kit yet — message them for
                  the full inventory.
                </p>
              )}
            </section>

            <section className="mt-9" aria-labelledby="policies">
              <p className="eyebrow text-muted-ink">03 / Good to know</p>
              <h2 id="policies" className="display-md mt-3">
                House rules
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheckIcon,
                    title: "Deposit",
                    body:
                      studio.securityDeposit > 0
                        ? `${formatCurrency(studio.securityDeposit)} refundable security deposit, held until the room is returned in order.`
                        : "No security deposit is required for this room.",
                  },
                  {
                    icon: UsersIcon,
                    title: "Capacity",
                    body: `The room is set up for up to ${studio.maxCapacity} people. Message the host before adding more crew.`,
                  },
                  {
                    icon: CalendarCheckIcon,
                    title: "Changes",
                    body: "Cancel a pending request any time. Confirmed sessions can be rescheduled with the host.",
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

            <ReviewsSection studio={studio} onRatingChange={reload} />
          </div>

          <BookingPanel studio={studio} onBook={() => setBookingOpen(true)} />
        </div>

        {related.length > 0 ? (
          <section className="mt-20" aria-labelledby="related-studios">
            <div className="flex flex-col gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-muted-ink">Similar rooms</p>
                <h2 id="related-studios" className="display-md mt-3">
                  More {category?.label.toLowerCase() ?? "studios"}
                </h2>
              </div>
              <Link
                href={categoryHref}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:text-clay"
              >
                See the full category
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((item) => (
                <StudioCard key={item._id} studio={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <MobileBookingBar
        rate={studio.hourlyRate}
        rating={studio.rating}
        onBook={() => setBookingOpen(true)}
      />
      <BookingModal
        studio={studio}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
