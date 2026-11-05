"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import {
  activityFeed,
  dashboardBookings,
  dashboardListings,
  dashboardStats,
} from "@/data/dashboard";
import { formatCurrency, formatRating } from "@/lib/format";

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

const statusStyles = {
  confirmed: "border-sage/40 bg-sage/12 text-sage-ink",
  pending: "border-clay/35 bg-clay/10 text-clay",
  completed: "border-ink/15 bg-ink/5 text-ink/55",
} as const;

export function DashboardOverview() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const upcoming = dashboardBookings.filter(
    (booking) => booking.status !== "completed",
  );
  const earnings = "$2,840";

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            Overview / November 2026
          </p>
          <h1 className="display-lg mt-4">
            Good morning,
            <br />
            <span className="italic text-clay">{firstName}.</span>
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-muted-ink">
            Two bookings on the calendar and one listing draft waiting for
            photos. Here&apos;s the state of your rooms.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/dashboard/add-studio"
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

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
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
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-ink transition-colors hover:text-ink"
            >
              View all
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>

          <ul className="divide-y divide-ink/8">
            {upcoming.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-paper-deep sm:size-16 sm:aspect-auto">
                  <Image
                    src={booking.image}
                    alt={booking.studioTitle}
                    fill
                    sizes="(min-width: 640px) 64px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[13px] font-semibold">
                      {booking.studioTitle}
                    </p>
                    <span
                      className={`inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-semibold tracking-[0.08em] uppercase ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-ink">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDaysIcon className="size-3" />
                      {formatBookingDate(booking.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {booking.time} · {booking.hours}h
                    </span>
                    <span>Host: {booking.host}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <p className="text-[13px] font-semibold tabular-nums">
                    {formatCurrency(booking.total)}
                  </p>
                  <Link
                    href={`/studios/${booking.studioSlug}`}
                    className="text-[10px] tracking-[0.1em] text-clay uppercase transition-colors hover:text-ink"
                  >
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-ink/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-paper-deep/55 px-4 py-3">
              <p className="min-w-0 text-[11px] leading-5 text-muted-ink">
                You&apos;ve earned{" "}
                <span className="font-semibold text-ink">{earnings}</span> net
                this month.
              </p>
              <Link
                href="/dashboard/listings"
                className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:text-clay"
              >
                Payouts
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
            <ul className="divide-y divide-ink/8">
              {activityFeed.map((item) => (
                <li key={item.title} className="flex gap-3 px-5 py-3.5">
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
          </section>

          <section className="rounded-[20px] border border-ink/12 bg-ink p-5 text-paper">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-paper/45">Listing health</p>
                <p className="mt-3 font-display text-2xl leading-none">
                  2 of 3 live
                </p>
              </div>
              <TrendingUpIcon className="size-4 text-sodium" />
            </div>
            <div className="mt-5 space-y-3">
              {dashboardListings.map((listing) => (
                <div key={listing.id}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="truncate text-paper/65">
                      {listing.title}
                    </span>
                    <span
                      className={
                        listing.status === "live"
                          ? "text-sodium"
                          : "text-paper/35"
                      }
                    >
                      {listing.status}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-paper/12">
                    <div
                      className={
                        listing.status === "live"
                          ? "h-full rounded-full bg-sodium"
                          : "h-full rounded-full bg-paper/25"
                      }
                      style={{
                        width:
                          listing.status === "live"
                            ? `${Math.min(100, listing.views / 16)}%`
                            : "12%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/listings"
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
            href: "/dashboard/listings",
            title: "Tune a listing",
            body: "Update photos, rates and availability.",
            icon: EyeIcon,
          },
          {
            href: "/dashboard/bookings",
            title: "Check the calendar",
            body: "See every guest and host booking.",
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

      <p className="mt-6 text-[10px] tracking-[0.1em] text-muted-ink uppercase">
        Demo data · ratings shown as {formatRating(4.9)} average across live
        listings
      </p>
    </div>
  );
}
