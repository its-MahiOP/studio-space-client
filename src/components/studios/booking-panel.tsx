"use client";

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import type { Studio } from "@/types/studio";
import { formatCurrency, formatRating } from "@/lib/format";

export function BookingPanel({
  studio,
  onBook,
}: {
  studio: Studio;
  onBook: () => void;
}) {
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
              <StarIcon
                className={
                  studio.rating > 0
                    ? "size-3 fill-sodium stroke-sodium"
                    : "size-3 stroke-muted-ink"
                }
              />
              {studio.rating > 0
                ? `${formatRating(studio.rating)} rating`
                : "New listing"}
            </p>
          </div>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-sage/18 px-2.5 text-[10px] font-semibold tracking-[0.08em] text-sage-ink uppercase">
            <span className="size-1.5 rounded-full bg-sage" />
            Available
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 rounded-xl border border-ink/12 bg-paper/55 px-3 py-2.5">
            <CalendarDaysIcon className="size-4 text-clay" />
            <p className="text-[11px] leading-4 text-ink/70">
              Choose your date and hours in the booking form.
            </p>
          </div>

          <dl className="mt-4 space-y-2.5 text-[12px]">
            <div className="flex items-center justify-between text-ink/70">
              <dt className="inline-flex items-center gap-1.5">
                <ShieldCheckIcon className="size-3.5 text-sage" />
                Security deposit
              </dt>
              <dd className="tabular-nums text-ink">
                {studio.securityDeposit > 0
                  ? formatCurrency(studio.securityDeposit)
                  : "None"}
              </dd>
            </div>
            <div className="flex items-center justify-between text-ink/70">
              <dt className="inline-flex items-center gap-1.5">
                <UsersIcon className="size-3.5" />
                Max capacity
              </dt>
              <dd className="tabular-nums text-ink">
                {studio.maxCapacity} people
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 text-ink/70">
              <dt className="inline-flex shrink-0 items-center gap-1.5">
                <MapPinIcon className="size-3.5 text-clay" />
                Location
              </dt>
              <dd className="text-right text-ink">
                {studio.location || "Shared on request"}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onBook}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-paper transition-colors hover:bg-ink/88 focus-visible:ring-3 focus-visible:ring-sodium/50"
          >
            Book Workspace Now
            <ArrowRightIcon className="size-4" />
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-muted-ink">
            Your reservation is saved as Pending. Nothing is charged in this
            demo.
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
              <CalendarDaysIcon className="size-3 text-sage" />
              Free changes
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
