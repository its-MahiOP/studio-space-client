"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  Loader2Icon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { createBooking } from "@/lib/api";
import type { Studio } from "@/types/studio";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

const hourOptions = [2, 3, 4, 6, 8];
const timeOptions = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export function BookingModal({
  studio,
  open,
  onOpenChange,
}: {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [hours, setHours] = useState(4);
  const [guests, setGuests] = useState(Math.min(4, studio.maxCapacity || 4));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = studio.hourlyRate * hours;
  const total = subtotal + studio.securityDeposit;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Sign in to reserve this workspace.");
      return;
    }
    if (!date) {
      setError("Choose a date for your session.");
      return;
    }

    const startsAt = new Date(`${date}T${time}`);
    if (Number.isNaN(startsAt.getTime())) {
      setError("That date and time doesn't look right.");
      return;
    }
    if (startsAt.getTime() < Date.now()) {
      setError("Pick a start time in the future.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        studioId: studio._id,
        studioTitle: studio.title,
        imageUrl: studio.imageUrl,
        userEmail: user.email,
        userName: user.name,
        hostEmail: studio.ownerEmail,
        bookingDate: `${date}T${time}`,
        totalPrice: total,
      });
      toast.add({
        type: "success",
        title: "Booking requested",
        description: `${studio.title} is holding your slot. The host has 24 hours to confirm.`,
      });
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The booking could not be saved. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-ink/10 bg-card-cream px-5 py-4">
          <p className="eyebrow text-clay">Reserve the room</p>
          <DialogTitle className="font-display text-[26px] leading-none tracking-[-0.02em]">
            {studio.title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-[11px] text-muted-ink">
            {studio.location || "Location shared after confirmation"} · hosted by{" "}
            {studio.ownerName}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="p-5">
            <div className="rounded-xl border border-ink/12 bg-paper-deep/50 p-5 text-center">
              <LockIcon className="mx-auto size-5 text-clay" />
              <p className="mt-3 font-display text-xl">Sign in to book.</p>
              <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-muted-ink">
                Your name and email are attached to the reservation so the host
                knows who&apos;s coming.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[11px] font-semibold text-paper"
              >
                Go to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="eyebrow block text-ink/60"
                  >
                    Date
                  </label>
                  <div className="relative mt-2">
                    <CalendarDaysIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-ink" />
                    <input
                      id="booking-date"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-3 pl-9 text-[12px] focus:border-ink/40 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="booking-time"
                    className="eyebrow block text-ink/60"
                  >
                    Start time
                  </label>
                  <div className="relative mt-2">
                    <ClockIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-ink" />
                    <select
                      id="booking-time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-ink/15 bg-card-cream pr-3 pl-9 text-[12px] focus:border-ink/40 focus:outline-none"
                    >
                      {timeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p className="eyebrow text-ink/60">Session length</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hourOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setHours(option)}
                      aria-pressed={hours === option}
                      className={
                        hours === option
                          ? "h-9 rounded-full border border-ink bg-ink px-3.5 text-[11px] font-semibold text-paper"
                          : "h-9 rounded-full border border-ink/15 px-3.5 text-[11px] font-medium text-ink/60 transition-colors hover:border-ink/35 hover:text-ink"
                      }
                    >
                      {option} hours
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-ink/12 px-3 py-2.5">
                <span className="text-[12px] text-ink/70">People on set</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGuests((value) => Math.max(1, value - 1))}
                    aria-label="Fewer people"
                    disabled={guests <= 1}
                    className="grid size-7 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink/5 disabled:opacity-40"
                  >
                    <MinusIcon className="size-3" />
                  </button>
                  <span className="w-7 text-center text-[12px] font-semibold tabular-nums">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuests((value) =>
                        Math.min(studio.maxCapacity || 1, value + 1),
                      )
                    }
                    aria-label="More people"
                    disabled={guests >= (studio.maxCapacity || 1)}
                    className="grid size-7 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink/5 disabled:opacity-40"
                  >
                    <PlusIcon className="size-3" />
                  </button>
                </div>
              </div>

              <dl className="space-y-2 border-t border-ink/10 pt-3 text-[12px]">
                <div className="flex items-center justify-between text-ink/70">
                  <dt>
                    {formatCurrency(studio.hourlyRate)} × {hours} hours
                  </dt>
                  <dd className="tabular-nums text-ink">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-ink/70">
                  <dt>Refundable deposit</dt>
                  <dd className="tabular-nums text-ink">
                    {formatCurrency(studio.securityDeposit)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-ink/10 pt-2.5 text-[14px] font-semibold">
                  <dt>Total due</dt>
                  <dd className="tabular-nums">{formatCurrency(total)}</dd>
                </div>
              </dl>

              <p className="flex items-start gap-2 rounded-lg bg-sage/10 px-3 py-2 text-[10px] leading-5 text-sage-ink">
                <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  No card is charged in this demo. The reservation is saved with
                  a <strong className="font-semibold">Pending</strong> status
                  until the host confirms.
                </span>
              </p>

              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-clay/35 bg-clay/8 px-3 py-2 text-[11px] leading-5 text-clay"
                >
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 border-t border-ink/10 bg-card-cream p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-5 text-muted-ink">
                Requesting as{" "}
                <span className="font-semibold text-ink">{user.name}</span>
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <CheckIcon className="size-4" />
                )}
                {submitting ? "Sending request…" : "Confirm booking request"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
