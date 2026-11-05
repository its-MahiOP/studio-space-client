"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRightIcon,
  Building2Icon,
  CalendarDaysIcon,
  Loader2Icon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";

import { getCategoryForValue } from "@/data/categories";
import { deleteStudio } from "@/lib/api";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import { useStudios } from "@/hooks/use-api-data";
import { StudioImage } from "@/components/shared/studio-image";
import { DataError, EmptyState, StudioCardSkeleton } from "@/components/shared/data-states";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export function MyListings() {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const { data: studios, loading, error, reload } = useStudios({
    ownerEmail: email,
  });

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const target = studios.find((studio) => studio._id === pendingDelete) ?? null;

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await deleteStudio(target._id);
      toast.add({
        type: "success",
        title: "Listing deleted",
        description: `${target.title} was removed from the database.`,
      });
      setPendingDelete(null);
      reload();
    } catch (cause) {
      toast.add({
        type: "error",
        title: "Could not delete listing",
        description:
          cause instanceof Error ? cause.message : "Try again in a moment.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            My studio listings / {studios.length} owned
          </p>
          <h1 className="display-lg mt-4">
            Your rooms,
            <br />
            <span className="italic text-clay">on your terms.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
            These are the spaces saved under{" "}
            <span className="font-medium text-ink">{email || "your account"}</span>.
            Update the rate, swap the cover, or remove a room entirely.
          </p>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
        >
          <PlusIcon className="size-4" />
          Add a studio
        </Link>
      </div>

      {error ? (
        <DataError message={error} onRetry={reload} className="mt-8" />
      ) : loading && studios.length === 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StudioCardSkeleton />
          <StudioCardSkeleton />
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          className="mt-8"
          eyebrow="No listings yet"
          title="Your first room is one form away."
          description="Publish a studio and it will show up here with edit and delete controls, plus its own public detail page."
          action={
            <Link
              href="/add-studio"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              <PlusIcon className="size-4" />
              Create a listing
            </Link>
          }
        />
      ) : (
        <div className="mt-6 space-y-3">
          {studios.map((studio) => {
            const category = getCategoryForValue(studio.category);
            return (
              <article
                key={studio._id}
                className="rounded-[18px] border border-ink/12 bg-card-cream p-3 sm:p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <StudioImage
                    src={studio.imageUrl}
                    alt={studio.title}
                    className="aspect-[16/10] w-full shrink-0 rounded-xl sm:size-24 sm:aspect-auto"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[13px] font-semibold">{studio.title}</h2>
                      <span className="inline-flex h-5 items-center rounded-full border border-sage/40 bg-sage/12 px-2 text-[9px] font-semibold tracking-[0.08em] text-sage-ink uppercase">
                        Live
                      </span>
                      <span className="inline-flex h-5 items-center rounded-full bg-ink/6 px-2 text-[9px] font-medium tracking-[0.08em] text-ink/55 uppercase">
                        {category?.label ?? studio.category}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-ink">
                      <span className="font-semibold text-ink">
                        {formatCurrency(studio.hourlyRate)}
                        <span className="font-normal text-muted-ink"> / hr</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPinIcon className="size-3 text-clay" />
                        {studio.location || "No location"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <UsersIcon className="size-3" />
                        {studio.maxCapacity} people
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2Icon className="size-3" />
                        {studio.securityDeposit > 0
                          ? `${formatCurrency(studio.securityDeposit)} deposit`
                          : "No deposit"}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-ink/35">
                      Added {formatShortDate(studio.createdAt)}
                      {studio.updatedAt
                        ? ` · updated ${formatShortDate(studio.updatedAt)}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-ink/8 pt-3 sm:border-t-0 sm:pt-0">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      View
                      <ArrowUpRightIcon className="size-3" />
                    </Link>
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      <PencilIcon className="size-3" />
                      Update
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(studio._id)}
                      aria-label={`Delete ${studio.title}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/12 px-3 text-[10px] font-medium text-ink/55 transition-colors hover:border-clay/30 hover:bg-clay/8 hover:text-clay"
                    >
                      <Trash2Icon className="size-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 rounded-[18px] border border-ink/12 bg-paper-deep/45 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-5 text-muted-ink">
          <span className="font-semibold text-ink">Host tip:</span> listings with
          a real cover photo and a written load-in note get accepted faster.
        </p>
        <Link
          href="/my-bookings"
          className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-ink uppercase transition-colors hover:text-clay"
        >
          <CalendarDaysIcon className="size-3.5" />
          My bookings
          <ArrowUpRightIcon className="size-3" />
        </Link>
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <p className="eyebrow text-clay">Confirm delete</p>
            <DialogTitle className="font-display text-2xl tracking-[-0.02em]">
              Remove {target?.title ?? "this listing"}?
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-6 text-muted-ink">
              This deletes the studio document from MongoDB. Existing bookings
              keep their snapshot, but the public listing and its detail page
              will disappear immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="h-10 rounded-full border border-ink/15 px-4 text-[12px] font-medium transition-colors hover:bg-ink/5"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-clay px-4 text-[12px] font-semibold text-paper transition-colors hover:bg-clay/85 disabled:opacity-60"
            >
              {deleting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <Trash2Icon className="size-3.5" />
              )}
              {deleting ? "Deleting…" : "Delete listing"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
