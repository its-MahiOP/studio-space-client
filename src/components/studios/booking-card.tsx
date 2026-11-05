"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  MessageSquareIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";

import type { Studio } from "@/data/studios";
import { formatCurrency, formatRating } from "@/lib/format";

const durations = [2, 3, 4, 6, 8];

interface BookingDay {
  key: string;
  weekday: string;
  day: number;
  month: string;
  label: string;
}

function buildDays(): BookingDay[] {
  const base = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return {
      key: date.toISOString().slice(0, 10),
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        date,
      ),
      day: date.getDate(),
      month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(date),
    };
  });
}

export function BookingCard({ studio }: { studio: Studio }) {
  const [days, setDays] = useState<BookingDay[]>([]);
  const [dayIndex, setDayIndex] = useState(1);
  const [start, setStart] = useState(10);
  const [duration, setDuration] = useState(4);
  const [guests, setGuests] = useState(4);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Dates are derived on the client so the static shell stays prerenderable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(buildDays());
  }, []);

  const subtotal = studio.hourlyRate * duration;
  const serviceFee = Math.round(subtotal * 0.06);
  const total = subtotal + serviceFee;
  const selectedDay = days[dayIndex];

  return (
    <aside className="lg:sticky lg:top-[94px]">
      <div className="overflow-hidden rounded-[22px] border border-ink/12 bg-card-cream shadow-[var(--shadow-soft)]">
        <div className="flex items-end justify-between gap-4 border-b border-ink/10 p-5">
          <div>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-[34px] leading-none tracking-[-0.03em]">
                {formatCurrency(studio.hourlyRate)}
              </span>
              <span className="text-[12px] text-muted-ink">/ hour</span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-ink">
              <StarIcon className="size-3 fill-sodium stroke-sodium" />
              <span className="font-semibold text-ink">
                {formatRating(studio.rating)}
              </span>
              · {studio.reviews} reviews
            </p>
          </div>
          <span
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold tracking-[0.08em] uppercase",
              studio.instantBook
                ? "bg-sage/18 text-sage-ink"
                : "bg-sodium-soft/50 text-clay",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                studio.instantBook ? "bg-sage" : "bg-clay",
              )}
            />
            {studio.instantBook ? "Instant book" : "On request"}
          </span>
        </div>

        <div className="p-5">
          <p className="eyebrow text-muted-ink">Choose a day</p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {days.length === 0
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    aria-hidden="true"
                    className="h-[58px] animate-pulse rounded-xl bg-paper-deep/70"
                  />
                ))
              : days.map((day, index) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => {
                      setDayIndex(index);
                      setConfirmed(false);
                    }}
                    aria-pressed={dayIndex === index}
                    className={cn(
                      "flex flex-col items-center rounded-xl border px-1 py-2.5 transition-colors",
                      dayIndex === index
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/12 text-ink/70 hover:border-ink/30",
                    )}
                  >
                    <span className="text-[9px] tracking-[0.1em] uppercase opacity-70">
                      {day.weekday}
                    </span>
                    <span className="mt-1 font-display text-lg leading-none">
                      {day.day}
                    </span>
                  </button>
                ))}
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 px-1 text-[10px] leading-tight text-muted-ink/70"
            >
              <CalendarDaysIcon className="mb-1 size-3.5" />
              More
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="booking-start"
                className="eyebrow block text-muted-ink"
              >
                Start
              </label>
              <div className="relative mt-2">
                <ClockIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-ink" />
                <select
                  id="booking-start"
                  value={start}
                  onChange={(event) => {
                    setStart(Number(event.target.value));
                    setConfirmed(false);
                  }}
                  className="h-10 w-full appearance-none rounded-lg border border-ink/15 bg-paper/60 pr-3 pl-8 text-[12px] focus:outline-none focus-visible:border-ink/40"
                >
                  {Array.from({ length: 11 }).map((_, index) => {
                    const hour = 8 + index;
                    return (
                      <option key={hour} value={hour}>
                        {hour > 12 ? hour - 12 : hour}
                        {hour >= 12 ? "pm" : "am"}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="booking-duration"
                className="eyebrow block text-muted-ink"
              >
                Hours
              </label>
              <select
                id="booking-duration"
                value={duration}
                onChange={(event) => {
                  setDuration(Number(event.target.value));
                  setConfirmed(false);
                }}
                className="mt-2 h-10 w-full appearance-none rounded-lg border border-ink/15 bg-paper/60 px-3 text-[12px] focus:outline-none focus-visible:border-ink/40"
              >
                {durations.map((value) => (
                  <option key={value} value={value}>
                    {value} hours
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-ink/12 px-3 py-2.5">
            <span className="text-[12px] text-ink/70">People on set</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGuests((value) => Math.max(1, value - 1))}
                aria-label="Fewer people"
                className="grid size-7 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink/5 disabled:opacity-40"
                disabled={guests <= 1}
              >
                <MinusIcon className="size-3" />
              </button>
              <span className="w-7 text-center text-[12px] font-semibold tabular-nums">
                {guests}
              </span>
              <button
                type="button"
                onClick={() =>
                  setGuests((value) => Math.min(studio.capacity, value + 1))
                }
                aria-label="More people"
                className="grid size-7 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink/5 disabled:opacity-40"
                disabled={guests >= studio.capacity}
              >
                <PlusIcon className="size-3" />
              </button>
            </div>
          </div>

          <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-4 text-[12px]">
            <div className="flex items-center justify-between text-ink/70">
              <dt>
                {formatCurrency(studio.hourlyRate)} × {duration} hours
              </dt>
              <dd className="tabular-nums text-ink">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-ink/70">
              <dt className="inline-flex items-center gap-1.5">
                Service fee
                <SparklesIcon className="size-3 text-clay" />
              </dt>
              <dd className="tabular-nums text-ink">
                {formatCurrency(serviceFee)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-[13px] font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => setConfirmed(true)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-paper transition-colors hover:bg-ink/88 focus-visible:ring-3 focus-visible:ring-sodium/50"
          >
            {confirmed ? (
              <>
                Request sent <CheckIcon className="size-4 text-sodium" />
              </>
            ) : studio.instantBook ? (
              <>
                Book this room <CalendarDaysIcon className="size-4" />
              </>
            ) : (
              <>
                Request to book <MessageSquareIcon className="size-4" />
              </>
            )}
          </button>

          <p
            role="status"
            className="mt-3 text-center text-[11px] leading-5 text-muted-ink"
          >
            {confirmed
              ? `Demo hold placed for ${selectedDay?.label ?? "your selected day"}, ${start > 12 ? start - 12 : start}${start >= 12 ? "pm" : "am"} — nothing was charged.`
              : "You won't be charged until the host confirms your hours."}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-ink/10 pt-4 text-[10px] tracking-[0.08em] text-muted-ink uppercase">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheckIcon className="size-3 text-sage" />
              Covered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheckIcon className="size-3 text-sage" />
              Verified host
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-3 text-sage" />
              Free changes
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
