"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "cn";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  PlusIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

import { getStudioBySlug } from "@/lib/studios";
import { dashboardBookings } from "@/data/dashboard";
import { formatCurrency } from "@/lib/format";

type Tab = "upcoming" | "past" | "hosting";

const tabs: { id: Tab; label: string; count: number }[] = [
  {
    id: "upcoming",
    label: "Upcoming",
    count: dashboardBookings.filter(
      (booking) => booking.role === "guest" && booking.status !== "completed",
    ).length,
  },
  {
    id: "past",
    label: "Past",
    count: dashboardBookings.filter(
      (booking) => booking.role === "guest" && booking.status === "completed",
    ).length,
  },
  {
    id: "hosting",
    label: "Hosting",
    count: dashboardBookings.filter((booking) => booking.role === "host").length,
  },
];

const statusStyles = {
  confirmed: "border-sage/40 bg-sage/12 text-sage-ink",
  pending: "border-clay/35 bg-clay/10 text-clay",
  completed: "border-ink/15 bg-ink/5 text-ink/55",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function endTime(start: string, hours: number) {
  const [hour, minute] = start.split(":").map(Number);
  const end = (hour + hours) % 24;
  const suffix = end >= 12 ? "pm" : "am";
  const display = end > 12 ? end - 12 : end === 0 ? 12 : end;
  return `${display}:${String(minute).padStart(2, "0")}${suffix}`;
}

function startTime(start: string) {
  const [hour, minute] = start.split(":").map(Number);
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:${String(minute).padStart(2, "0")}${suffix}`;
}

export function BookingsView() {
  const [tab, setTab] = useState<Tab>("upcoming");

  const bookings = dashboardBookings.filter((booking) => {
    if (tab === "hosting") return booking.role === "host";
    if (tab === "past")
      return booking.role === "guest" && booking.status === "completed";
    return booking.role === "guest" && booking.status !== "completed";
  });

  const spend = dashboardBookings
    .filter((booking) => booking.role === "guest")
    .reduce((total, booking) => total + booking.total, 0);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            My bookings / All sessions
          </p>
          <h1 className="display-lg mt-4">
            The calendar,
            <br />
            <span className="italic text-clay">both sides of it.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
            Every session you&apos;ve booked and every crew you&apos;re hosting.
            Invoices live with each booking.
          </p>
        </div>
        <Link
          href="/studios"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
        >
          <PlusIcon className="size-4" />
          Book another room
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Booked this month", value: "02", note: "Nov 2026" },
          {
            label: "Guest spend (demo)",
            value: formatCurrency(spend),
            note: "Across all sessions",
          },
          { label: "Host payouts", value: "$344", note: "Last paid yesterday" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[16px] border border-ink/12 bg-card-cream px-4 py-3.5"
          >
            <p className="text-[10px] tracking-[0.1em] text-muted-ink uppercase">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl leading-none tracking-[-0.02em]">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] text-ink/35">{stat.note}</p>
          </div>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="Booking views"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-ink/12 pb-px"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-[12px] font-medium transition-colors",
              tab === item.id
                ? "border-clay text-ink"
                : "border-transparent text-ink/50 hover:text-ink",
            )}
          >
            {item.label}
            <span
              className={cn(
                "grid size-4.5 place-items-center rounded-full text-[9px] tabular-nums",
                tab === item.id ? "bg-clay text-paper" : "bg-ink/8 text-ink/50",
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {bookings.map((booking) => {
          const studio = getStudioBySlug(booking.studioSlug);
          return (
            <article
              key={booking.id}
              className="overflow-hidden rounded-[18px] border border-ink/12 bg-card-cream"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-paper-deep sm:aspect-auto sm:w-40">
                  <Image
                    src={booking.image}
                    alt={booking.studioTitle}
                    fill
                    sizes="(min-width: 640px) 160px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[14px] font-semibold">
                          {booking.studioTitle}
                        </h2>
                        <span
                          className={cn(
                            "inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-semibold tracking-[0.08em] uppercase",
                            statusStyles[booking.status],
                          )}
                        >
                          {booking.status}
                        </span>
                        <span className="font-mono text-[9px] text-ink/30">
                          {booking.id}
                        </span>
                      </div>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-ink">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDaysIcon className="size-3" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {startTime(booking.time)} –{" "}
                          {endTime(booking.time, booking.hours)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <UsersIcon className="size-3" />
                          {booking.role === "host" ? "You host" : booking.host}
                        </span>
                        {studio ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="size-3" />
                            {studio.location.neighborhood}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block text-[14px] font-semibold tabular-nums">
                        {formatCurrency(booking.total)}
                      </span>
                      <span className="block text-[9px] tracking-[0.1em] text-muted-ink uppercase">
                        {booking.role === "host" ? "Payout" : "Total"}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-ink/8 pt-3">
                    <Link
                      href={`/studios/${booking.studioSlug}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      View room
                      <ArrowUpRightIcon className="size-3" />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      <MessageSquareIcon className="size-3" />
                      Message {booking.role === "host" ? "guest" : "host"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      <ReceiptIcon className="size-3" />
                      Invoice
                    </button>
                    <span className="ml-auto text-[10px] text-muted-ink">
                      {booking.hours} hours · {formatCurrency(studio?.hourlyRate ?? 0)}/hr
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {bookings.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-ink/20 bg-card-cream p-10 text-center">
            <CalendarDaysIcon className="mx-auto size-6 text-ink/25" />
            <p className="mt-3 font-display text-2xl">Nothing here yet.</p>
            <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-6 text-muted-ink">
              {tab === "hosting"
                ? "When a creator books one of your rooms, it will appear here."
                : "Book a room from the index and it will show up on this tab."}
            </p>
            <Link
              href="/studios"
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[11px] font-semibold text-paper"
            >
              Browse studios
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
