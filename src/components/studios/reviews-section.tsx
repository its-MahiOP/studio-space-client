"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2Icon,
  PenLineIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

import { createReview } from "@/lib/api";
import type { Review, Studio } from "@/types/studio";
import { formatRating } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import { useReviews } from "@/hooks/use-api-data";
import { toast } from "@/components/ui/toast";

function Stars({
  value,
  className = "size-3.5",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={
            index < Math.round(value)
              ? `${className} fill-sodium stroke-sodium`
              : `${className} stroke-ink/20`
          }
        />
      ))}
    </span>
  );
}

/**
 * "04 / Reviews" block on the studio detail page: aggregate rating, the
 * written reviews from MongoDB, and a form for signed-in creators to leave
 * (or update) their own.
 */
export function ReviewsSection({
  studio,
  onRatingChange,
}: {
  studio: Studio;
  onRatingChange?: () => void;
}) {
  const { user } = useAuth();
  const { data: reviews, loading, reload } = useReviews(studio._id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [syncedReview, setSyncedReview] = useState<string | null>(null);

  const existing = user
    ? reviews.find((review) => review.userEmail === user.email)
    : undefined;

  // Prefill the form with the caller's own review once it arrives.
  if (existing && syncedReview !== existing._id) {
    setSyncedReview(existing._id);
    setRating(existing.rating);
    setComment(existing.comment);
  }

  const count = reviews.length;
  const average =
    count > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / count
      : studio.rating;
  const filledStars = Math.round(average);
  const isOwner = Boolean(user && user.email === studio.ownerEmail);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Sign in to review this room.");
      return;
    }
    if (comment.trim().length < 10) {
      const message =
        "Tell other creators a little more — at least 10 characters.";
      setError(message);
      toast.add({ type: "warning", title: "Review too short", description: message });
      return;
    }

    setSubmitting(true);
    try {
      await createReview(studio._id, {
        rating,
        comment: comment.trim(),
      });
      toast.add({
        type: "success",
        title: existing ? "Review updated" : "Review published",
        description: `Thanks — your ${rating}-star note is live on ${studio.title}.`,
      });
      reload();
      onRatingChange?.();
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Your review could not be saved.";
      setError(message);
      toast.add({
        type: "error",
        title: "Could not save review",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-9" aria-labelledby="reviews">
      <p className="eyebrow text-muted-ink">04 / Reviews</p>
      <h2 id="reviews" className="display-md mt-3">
        What creators say
      </h2>

      <div className="mt-5 rounded-[20px] border border-ink/10 bg-card-cream p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="font-display text-4xl leading-none tracking-[-0.03em]">
              {average > 0 ? formatRating(average) : "New"}
            </p>
            <div className="mt-2">
              <Stars value={average} />
            </div>
          </div>
          <div className="max-w-md border-ink/10 sm:border-l sm:pl-6">
            <p className="text-[12px] leading-6 text-muted-ink">
              {count > 0
                ? `${count} ${count === 1 ? "review" : "reviews"} from creators who booked this room. One note per creator, updated any time.`
                : "No reviews yet. This is a new listing — book it, then be the first crew to leave a note."}
            </p>
          </div>
        </div>

        {loading && reviews.length === 0 ? (
          <div className="mt-5 space-y-3" aria-busy="true">
            <div className="h-16 animate-pulse rounded-xl bg-paper-deep/70" />
            <div className="h-16 animate-pulse rounded-xl bg-paper-deep/50" />
          </div>
        ) : count > 0 ? (
          <ul className="mt-6 space-y-4 border-t border-ink/10 pt-5">
            {reviews.map((review) => (
              <li key={review._id} className="flex gap-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-deep font-display text-[13px] text-ink/55">
                  {(review.userName || "C").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-[12px] font-semibold">
                      {review.userName || "A creator"}
                      {user && review.userEmail === user.email ? (
                        <span className="ml-2 rounded-full bg-ink/6 px-2 py-0.5 text-[9px] font-medium tracking-[0.08em] text-ink/55 uppercase">
                          You
                        </span>
                      ) : null}
                    </p>
                    <Stars value={review.rating} className="size-3" />
                    {review.createdAt ? (
                      <span className="text-[10px] text-muted-ink">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-6 whitespace-pre-line text-ink/72">
                    {review.comment}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 border-t border-ink/10 pt-5">
          {!user ? (
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-ink/20 bg-paper-deep/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold">
                  Been in this room?
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted-ink">
                  Sign in to rate it and help the next crew decide.
                </p>
              </div>
              <Link
                href={`/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-ink px-4 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
              >
                Sign in to review
              </Link>
            </div>
          ) : isOwner ? (
            <p className="rounded-xl bg-paper-deep/50 px-4 py-3 text-[11px] leading-5 text-muted-ink">
              You&apos;re the host of this listing, so you can&apos;t review
              it — feedback from your guests lands here automatically.
            </p>
          ) : (
            <form onSubmit={onSubmit}>
              <p className="eyebrow flex items-center gap-2 text-ink/60">
                <PenLineIcon className="size-3" />
                {existing ? "Update your review" : "Write a review"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-[11px] text-muted-ink">Your rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      aria-pressed={rating === value}
                      className="grid size-7 place-items-center rounded-full transition-colors hover:bg-sodium/15"
                    >
                      <StarIcon
                        className={
                          value <= rating
                            ? "size-4 fill-sodium stroke-sodium"
                            : "size-4 stroke-ink/25"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                placeholder="How was the light, the sound, the load-in?"
                aria-label="Your review"
                className="mt-3 w-full resize-y rounded-xl border border-ink/15 bg-paper px-4 py-3 text-[13px] leading-6 placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none"
              />
              {error ? (
                <p
                  role="alert"
                  className="mt-2 rounded-lg border border-clay/35 bg-clay/8 px-3 py-2 text-[11px] leading-5 text-clay"
                >
                  {error}
                </p>
              ) : null}
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-[10px] text-muted-ink">
                  <UserIcon className="size-3" />
                  Posting as {user.name}
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <PenLineIcon className="size-3.5" />
                  )}
                  {submitting
                    ? "Saving…"
                    : existing
                      ? "Update review"
                      : "Publish review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
