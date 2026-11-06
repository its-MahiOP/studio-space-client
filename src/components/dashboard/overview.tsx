"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  Building2Icon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useBookings, useStudios } from "@/hooks/use-api-data";
import {
  formatBookingDate,
  formatCurrency,
  formatShortDate,
  formatBookingTime,
} from "@/lib/format";
import { getCategoryForValue } from "@/data/categories";
import { StudioImage } from "@/components/shared/studio-image";
import { DataError, StudioCardSkeleton } from "@/components/shared/data-states";
import type { BookingStatus } from "@/types/studio";

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-clay/35 bg-clay/10 text-clay",
  Confirmed: "border-sage/40 bg-sage/12 text-sage-ink",
  Completed: "border-ink/15 bg-ink/5 text-ink/55",
  Cancelled: "border-ink/15 bg-ink/4 text-ink/40",
};

export function DashboardOverview() {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const firstName = user?.name.split(" ")[0] ?? "there";

  const {
    data: listings,
    loading: listingsLoading,
    error: listingsError,
    reload: reloadListings,
  } = useStudios({ ownerEmail: email });
  const {
    data: bookings,
    loading: bookingsLoading,
    error: bookingsError,
    reload: reloadBookings,
  } = useBookings(email);

  const upcoming = bookings
    .filter(
      (booking) =>
        booking.status === "Pending" || booking.status === "Confirmed",
    )
    .sort(
      (a, b) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
    )
    .slice(0, 4);

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const spend = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((total, b) => total + b.totalPrice, 0);

  const stats = [
    {
      label: "My listings",
      value: listingsLoading ? "—" : String(listings.length),
      note: "Spaces saved under your account",
    },
    {
      label: "Pending requests",
      value: bookingsLoading ? "—" : String(pending),
      note: "Awaiting host confirmation",
    },
    {
      label: "Confirmed",
      value: bookingsLoading ? "—" : String(confirmed),
      note: "Sessions on the calendar",
    },
    {
      label: "Booked value",
      value: bookingsLoading ? "—" : formatCurrency(spend),
      note: "Excludes cancelled requests",
    },
  ];

  const activity = [
    ...listings.slice(0, 3).map((listing) => ({
      id: `listing-${listing._id}`,
      title: `Listing live: ${listing.title}`,
      detail: `${getCategoryForValue(listing.category)?.label ?? listing.category} · ${formatCurrency(listing.hourlyRate)}/hr`,
      time: formatShortDate(listing.createdAt),
      tone: "sage" as const,
    })),
    ...bookings.slice(0, 3).map((booking) => ({
      id: `booking-${booking._id}`,
      title: `${booking.status} booking · ${booking.studioTitle}`,
      detail: `${formatBookingDate(booking.bookingDate)} · ${formatCurrency(booking.totalPrice)}`,
      time: formatBookingTime(booking.bookingDate) || "All day",
      tone:
        booking.status === "Pending"
          ? ("amber" as const)
          : booking.status === "Cancelled"
            ? ("clay" as const)
            : ("sage" as const),
    })),
  ].slice(0, 5);

  const errors = [listingsError, bookingsError].filter(Boolean) as string[];

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            Overview / Live account data
          </p>
          <h1 className="display-lg mt-4">
            Good to see you,
            <br />
            <span className="italic text-clay">{firstName}.</span>
          </h1>
          <p className="mt-3 max-w-md text-[13px] leading-6 text-muted-ink">
            {listings.length === 0
              ? "You haven't listed a room yet. Add your first studio and it will appear here with its own public page."
              : `${listings.length} ${listings.length === 1 ? "listing" : "listings"} and ${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"} tied to ${email}.`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/add-studio"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            <PlusIcon className="size-4" />
            Add a studio
          </Link>
          <Link
            href="/studios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-[12px] font-medium transition-colors hover:bg-ink/5"
          >
            Browse rooms
            <ArrowUpRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>

      {errors.length > 0 ? (
        <DataError
          className="mt-6"
          message={errors.join(" ")}
          onRetry={() => {
            reloadListings();
            reloadBookings();
          }}
        />
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-[18px] border border-ink/12 bg-card-cream p-4"
          >
            <div className="flex items-start justify-between">
              <p className="eyebrow text-[9px] text-muted-ink">{stat.label}</p>
              <span className="font-mono text-[9px] text-ink/30">
                0{index + 1}
              </span>
            </div>
            <p className="mt-5 font-display text-[28px] leading-none tracking-[-0.03em]">
              {stat.value}
            </p>
            <p className="mt-2 text-[10px] leading-4 text-muted-ink">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[20px] border border-ink/12 bg-card-cream">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="flex items-center gap-2 text-[13px] font-semibold">
              <CalendarDaysIcon className="size-4 text-clay" />
              Upcoming bookings
            </h2>
            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-ink transition-colors hover:text-ink"
            >
              View all
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>

          {bookingsLoading && bookings.length === 0 ? (
            <div className="space-y-3 p-4">
              <StudioCardSkeleton />
              <StudioCardSkeleton />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="p-6 text-center sm:p-8">
              <p className="text-[12px] leading-6 text-muted-ink">
                Nothing on the calendar. Book a room from the index and your
                pending request will show up here.
              </p>
              <Link
                href="/studios"
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
              >
                Find a workspace
                <ArrowUpRightIcon className="size-3" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/8">
              {upcoming.map((booking) => (
                <li
                  key={booking._id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <StudioImage
                    src={booking.imageUrl}
                    alt={booking.studioTitle}
                    className="aspect-[4/3] w-full shrink-0 rounded-xl sm:size-16 sm:aspect-auto"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[13px] font-semibold">
                        {booking.studioTitle}
                      </p>
                      <span
                        className={`inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-semibold tracking-[0.08em] uppercase ${statusStyles[booking.status] ?? statusStyles.Pending}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-ink">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDaysIcon className="size-3" />
                        {formatBookingDate(booking.bookingDate)}
                      </span>
                      {formatBookingTime(booking.bookingDate) ? (
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {formatBookingTime(booking.bookingDate)}
                        </span>
                      ) : null}
                      <span>Host: {booking.hostEmail}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <p className="text-[13px] font-semibold tabular-nums">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="text-[10px] tracking-[0.1em] text-clay uppercase transition-colors hover:text-ink"
                    >
                      Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-ink/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper-deep/55 px-4 py-3">
              <p className="min-w-0 text-[11px] leading-5 text-muted-ink">
                You have{" "}
                <span className="font-semibold text-ink">
                  {formatCurrency(spend)}
                </span>{" "}
                in active bookings.
              </p>
              <Link
                href="/my-listings"
                className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:text-clay"
              >
                Manage listings
                <ArrowUpRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[20px] border border-ink/12 bg-card-cream">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h2 className="flex items-center gap-2 text-[13px] font-semibold">
                <SparklesIcon className="size-4 text-clay" />
                Recent activity
              </h2>
            </div>
            {activity.length === 0 ? (
              <div className="px-5 py-6">
                <span className="grid size-10 place-items-center rounded-full border border-ink/12 bg-paper-deep/60">
                  <SparklesIcon className="size-4.5 text-clay" />
                </span>
                <p className="mt-4 text-[11px] leading-5 text-muted-ink">
                  Your listings and reservations will appear here as soon as you
                  create them.
                </p>
                <Link
                  href="/add-studio"
                  className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
                >
                  <PlusIcon className="size-3.5" />
                  Create your first listing
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-ink/8">
                {activity.map((item) => (
                  <li key={item.id} className="flex gap-3 px-5 py-3.5">
                    <span
                      className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                        item.tone === "amber"
                          ? "bg-sodium"
                          : item.tone === "sage"
                            ? "bg-sage"
                            : item.tone === "clay"
                              ? "bg-clay"
                              : "bg-ink/40"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-5 text-muted-ink">
                        {item.detail}
                      </p>
                      <p className="mt-1 text-[9px] tracking-[0.1em] text-ink/35 uppercase">
                        {item.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[20px] border border-ink/12 bg-ink p-5 text-paper">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-paper/45">Listing health</p>
                <p className="mt-3 font-display text-2xl leading-none">
                  {listingsLoading
                    ? "—"
                    : `${listings.length} live ${listings.length === 1 ? "room" : "rooms"}`}
                </p>
              </div>
              <TrendingUpIcon className="size-4 text-sodium" />
            </div>
            <div className="mt-5 space-y-3">
              {listings.length === 0 ? (
                <p className="text-[11px] leading-5 text-paper/55">
                  No listings yet. Add your first studio to start taking
                  bookings.
                </p>
              ) : (
                listings.map((listing) => (
                  <div key={listing._id}>
                    <div className="flex items-center justify-between gap-3 text-[10px]">
                      <span className="truncate text-paper/65">
                        {listing.title}
                      </span>
                      <span className="shrink-0 text-sodium">live</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-paper/12">
                      <div
                        className="h-full rounded-full bg-sodium"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              18,
                              (listing.amenities.length / 8) * 100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/my-listings"
              className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-sodium uppercase transition-colors hover:text-paper"
            >
              Manage listings
              <ArrowRightIcon className="size-3" />
            </Link>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/my-listings",
            title: "Tune a listing",
            body: "Update photos, rates and amenities.",
            icon: EyeIcon,
          },
          {
            href: "/my-bookings",
            title: "Check the calendar",
            body: "See every reservation and cancel pending ones.",
            icon: CalendarDaysIcon,
          },
          {
            href: "/studios",
            title: "Find another room",
            body: "Browse the full index for your next shoot.",
            icon: StarIcon,
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 rounded-[18px] border border-ink/12 bg-card-cream p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/10 bg-paper transition-colors group-hover:border-sodium group-hover:bg-sodium">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold">
                  {action.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-ink">
                  {action.body}
                </span>
              </span>
              <ArrowUpRightIcon className="ml-auto size-3.5 shrink-0 text-ink/30 transition-colors group-hover:text-clay" />
            </Link>
          );
        })}
      </section>

      <p className="mt-6 flex items-center gap-1.5 text-[10px] tracking-[0.1em] text-muted-ink uppercase">
        <Building2Icon className="size-3" />
        Live data from MongoDB
      </p>
    </div>
  );
}
