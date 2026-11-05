"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "cn";
import {
  ArrowUpRightIcon,
  BarChart3Icon,
  EyeIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";

import { dashboardListings, type DashboardListing } from "@/data/dashboard";
import { formatCurrency, formatRating } from "@/lib/format";

const statusStyles = {
  live: "border-sage/40 bg-sage/12 text-sage-ink",
  draft: "border-ink/15 bg-ink/5 text-ink/55",
  paused: "border-clay/35 bg-clay/10 text-clay",
} as const;

export function ListingsManager() {
  const [listings, setListings] = useState<DashboardListing[]>(dashboardListings);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function toggleStatus(id: string) {
    setListings((current) =>
      current.map((listing) => {
        if (listing.id !== id || listing.status === "draft") return listing;
        return {
          ...listing,
          status: listing.status === "live" ? "paused" : "live",
          updated: "Just now",
        };
      }),
    );
  }

  function remove(id: string) {
    setListings((current) => current.filter((listing) => listing.id !== id));
    setConfirmId(null);
  }

  const live = listings.filter((listing) => listing.status === "live").length;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            My studio listings / {live} live
          </p>
          <h1 className="display-lg mt-4">
            Your rooms,
            <br />
            <span className="italic text-clay">on your terms.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
            Pause a room when you need it back, update the rate when the season
            shifts, and keep the photos honest.
          </p>
        </div>
        <Link
          href="/dashboard/add-studio"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
        >
          <PlusIcon className="size-4" />
          Add a studio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-[20px] border border-dashed border-ink/20 bg-card-cream p-10 text-center">
          <p className="font-display text-3xl">No listings yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-muted-ink">
            Add your first room and we&apos;ll walk you through photos, pricing
            and availability.
          </p>
          <Link
            href="/dashboard/add-studio"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-semibold text-paper"
          >
            <PlusIcon className="size-4" />
            Create a listing
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="rounded-[18px] border border-ink/12 bg-card-cream p-3 sm:p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-paper-deep sm:size-24 sm:aspect-auto">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 640px) 96px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[13px] font-semibold">{listing.title}</h2>
                    <span
                      className={cn(
                        "inline-flex h-5 items-center rounded-full border px-2 text-[9px] font-semibold tracking-[0.08em] uppercase",
                        statusStyles[listing.status],
                      )}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-ink">
                    <span className="font-semibold text-ink">
                      {formatCurrency(listing.rate)}
                      <span className="font-normal text-muted-ink"> / hr</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <EyeIcon className="size-3" />
                      {listing.views.toLocaleString()} views
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BarChart3Icon className="size-3" />
                      {listing.bookings} bookings
                    </span>
                    {listing.rating > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <StarIcon className="size-3 fill-sodium stroke-sodium" />
                        {formatRating(listing.rating)}
                      </span>
                    ) : (
                      <span>Not rated yet</span>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-ink/35">
                    Updated {listing.updated.toLowerCase()}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-ink/8 pt-3 sm:border-t-0 sm:pt-0">
                  <Link
                    href={`/studios/${listing.studioSlug}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                  >
                    View
                    <ArrowUpRightIcon className="size-3" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                  >
                    <PencilIcon className="size-3" />
                    Edit
                  </button>
                  {listing.status !== "draft" ? (
                    <button
                      type="button"
                      onClick={() => toggleStatus(listing.id)}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[10px] font-medium transition-colors",
                        listing.status === "live"
                          ? "border-clay/25 text-clay hover:bg-clay/8"
                          : "border-sage/40 text-sage-ink hover:bg-sage/10",
                      )}
                    >
                      {listing.status === "live" ? (
                        <>
                          <PauseIcon className="size-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="size-3" />
                          Resume
                        </>
                      )}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmId((current) =>
                        current === listing.id ? null : listing.id,
                      )
                    }
                    aria-label={`Remove ${listing.title}`}
                    className="grid size-8 place-items-center rounded-full border border-ink/12 text-ink/40 transition-colors hover:border-clay/30 hover:bg-clay/8 hover:text-clay"
                  >
                    <Trash2Icon className="size-3.5" />
                  </button>
                </div>
              </div>

              {confirmId === listing.id ? (
                <div className="mt-3 flex flex-col gap-2 rounded-lg border border-clay/25 bg-clay/6 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-clay">
                    Remove this demo listing? This can&apos;t be undone in the
                    session.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="h-7 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      Keep it
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(listing.id)}
                      className="h-7 rounded-full bg-clay px-3 text-[10px] font-semibold text-paper transition-colors hover:bg-clay/85"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-[18px] border border-ink/12 bg-paper-deep/45 p-4">
        <p className="text-[11px] leading-5 text-muted-ink">
          <span className="font-semibold text-ink">Host tip:</span> listings with
          a written load-in note and a photo of the power supply get accepted
          faster. Both live under “Edit listing → Good to know”.
        </p>
      </div>
    </div>
  );
}
