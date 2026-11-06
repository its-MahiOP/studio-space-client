"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "cn";
import {
  ArrowUpRightIcon,
  CalendarClockIcon,
  ClockIcon,
  Loader2Icon,
  MailIcon,
  PlusIcon,
  ReceiptIcon,
  XCircleIcon,
} from "lucide-react";

import type { Booking, BookingStatus } from "@/types/studio";
import { updateBookingStatus } from "@/lib/api";
import {
  formatBookingDate,
  formatBookingTime,
  formatCurrency,
} from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import { useBookings } from "@/hooks/use-api-data";
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

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-clay/35 bg-clay/10 text-clay",
  Confirmed: "border-sage/40 bg-sage/12 text-sage-ink",
  Completed: "border-ink/15 bg-ink/6 text-ink/60",
  Cancelled: "border-ink/15 bg-ink/4 text-ink/40",
};

const statusDot: Record<BookingStatus, string> = {
  Pending: "bg-clay",
  Confirmed: "bg-sage",
  Completed: "bg-ink/40",
  Cancelled: "bg-ink/25",
};

const filters: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Pending", label: "Pending" },
  { id: "Confirmed", label: "Confirmed" },
  { id: "Completed", label: "Completed" },
  { id: "Cancelled", label: "Cancelled" },
];

export function MyBookings() {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const { data, loading, error, reload } = useBookings(email);

  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const aTime = new Date(a.createdAt ?? a.bookingDate).getTime();
    const bTime = new Date(b.createdAt ?? b.bookingDate).getTime();
    return bTime - aTime;
  });

  const bookings =
    filter === "all"
      ? sorted
      : sorted.filter((booking) => booking.status === filter);

  const pending = data.filter((booking) => booking.status === "Pending").length;
  const confirmed = data.filter(
    (booking) => booking.status === "Confirmed",
  ).length;
  const spend = data
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((total, booking) => total + booking.totalPrice, 0);

  async function confirmCancel() {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      await updateBookingStatus(pendingCancel._id, "Cancelled");
      toast.add({
        type: "success",
        title: "Booking cancelled",
        description: `${pendingCancel.studioTitle} has been released back to the host.`,
      });
      setPendingCancel(null);
      reload();
    } catch (cause) {
      toast.add({
        type: "error",
        title: "Could not cancel booking",
        description:
          cause instanceof Error ? cause.message : "Try again in a moment.",
      });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            My bookings / {data.length} reservations
          </p>
          <h1 className="display-lg mt-4">
            The calendar,
            <br />
            <span className="italic text-clay">both sides of it.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
            Every slot you&apos;ve requested under{" "}
            <span className="font-medium text-ink">{email || "your account"}</span>.
            Pending requests can be cancelled without a fee.
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
          { label: "Pending requests", value: String(pending).padStart(2, "0"), note: "Awaiting host" },
          { label: "Confirmed sessions", value: String(confirmed).padStart(2, "0"), note: "On the calendar" },
          { label: "Booked value", value: formatCurrency(spend), note: "Excludes cancellations" },
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
        aria-label="Booking status"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-ink/12 pb-px"
      >
        {filters.map((item) => {
          const count =
            item.id === "all"
              ? data.length
              : data.filter((booking) => booking.status === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 border-b-2 px-3 text-[12px] font-medium transition-colors",
                filter === item.id
                  ? "border-clay text-ink"
                  : "border-transparent text-ink/50 hover:text-ink",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "grid size-4.5 place-items-center rounded-full text-[9px] tabular-nums",
                  filter === item.id
                    ? "bg-clay text-paper"
                    : "bg-ink/8 text-ink/50",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <DataError message={error} onRetry={reload} className="mt-6" />
      ) : loading && data.length === 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StudioCardSkeleton />
          <StudioCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          className="mt-6"
          eyebrow={filter === "all" ? "No reservations yet" : `No ${filter.toLowerCase()} bookings`}
          icon={<CalendarClockIcon className="size-5" />}
          title={
            data.length === 0
              ? "Your first room is waiting."
              : "Nothing in this status."
          }
          description={
            data.length === 0
              ? "Book a workspace and the reservation lands here with a Pending badge until the host confirms."
              : "Try another tab, or book a new room to fill this one."
          }
          action={
            <Link
              href="/studios"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Browse studios
              <ArrowUpRightIcon className="size-4" />
            </Link>
          }
        />
      ) : (
        <div className="mt-5 space-y-3">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-[18px] border border-ink/12 bg-card-cream"
            >
              <div className="flex flex-col sm:flex-row">
                <StudioImage
                  src={booking.imageUrl}
                  alt={booking.studioTitle}
                  className="aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:w-40"
                />

                <div className="min-w-0 flex-1 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[14px] font-semibold">
                          {booking.studioTitle}
                        </h2>
                        <span
                          className={cn(
                            "inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-[9px] font-semibold tracking-[0.08em] uppercase",
                            statusStyles[booking.status] ?? statusStyles.Pending,
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              statusDot[booking.status] ?? statusDot.Pending,
                            )}
                          />
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-ink">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClockIcon className="size-3" />
                          {formatBookingDate(booking.bookingDate)}
                        </span>
                        {formatBookingTime(booking.bookingDate) ? (
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            {formatBookingTime(booking.bookingDate)}
                          </span>
                        ) : null}
                        {booking.hostEmail ? (
                          <span className="inline-flex items-center gap-1">
                            <MailIcon className="size-3" />
                            {booking.hostEmail}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="block text-[14px] font-semibold tabular-nums">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                      <span className="block text-[9px] tracking-[0.1em] text-muted-ink uppercase">
                        Total
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-ink/8 pt-3">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 text-[10px] font-medium transition-colors hover:bg-ink/5"
                    >
                      View room
                      <ArrowUpRightIcon className="size-3" />
                    </Link>
                    {booking.status === "Pending" ? (
                      <button
                        type="button"
                        onClick={() => setPendingCancel(booking)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-clay/25 px-3 text-[10px] font-medium text-clay transition-colors hover:bg-clay/8"
                      >
                        <XCircleIcon className="size-3" />
                        Cancel booking
                      </button>
                    ) : null}
                    <span className="ml-auto font-mono text-[9px] text-ink/30">
                      #{booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-[18px] border border-ink/12 bg-paper-deep/45 p-4 text-[11px] leading-5 text-muted-ink">
        <ReceiptIcon className="mt-0.5 size-3.5 shrink-0 text-clay" />
        <p>
          Cancelling a pending request updates its status to{" "}
          <span className="font-semibold text-ink">Cancelled</span> in the
          bookings collection. Confirmed sessions are managed with the host.
        </p>
      </div>

      <Dialog
        open={Boolean(pendingCancel)}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <p className="eyebrow text-clay">Cancel reservation</p>
            <DialogTitle className="font-display text-2xl tracking-[-0.02em]">
              Release this slot?
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-6 text-muted-ink">
              {pendingCancel
                ? `${pendingCancel.studioTitle} on ${formatBookingDate(pendingCancel.bookingDate)} will be marked Cancelled. The host will see the slot open up again.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setPendingCancel(null)}
              className="h-10 rounded-full border border-ink/15 px-4 text-[12px] font-medium transition-colors hover:bg-ink/5"
            >
              Keep booking
            </button>
            <button
              type="button"
              onClick={confirmCancel}
              disabled={cancelling}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-clay px-4 text-[12px] font-semibold text-paper transition-colors hover:bg-clay/85 disabled:opacity-60"
            >
              {cancelling ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <XCircleIcon className="size-3.5" />
              )}
              {cancelling ? "Cancelling…" : "Cancel booking"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
