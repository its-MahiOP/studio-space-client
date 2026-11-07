"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon, Loader2Icon } from "lucide-react";

import { getStudio } from "@/lib/api";
import type { Studio } from "@/types/studio";
import { StudioCard } from "@/components/studios/studio-card";
import {
  EmptyState,
  StudioGridSkeleton,
} from "@/components/shared/data-states";
import { useWishlistStore } from "@/components/providers/wishlist-provider";

/**
 * Saved Studios (Optional requirement) — resolves the saved ids held by the
 * WishlistProvider into full listings. Studios that were deleted by their host
 * are dropped silently instead of failing the whole page.
 */
export function SavedStudios() {
  const { savedIds, ready } = useWishlistStore();
  const [studios, setStudios] = useState<Studio[]>([]);
  /** idKey whose resolution has settled; null while the first load is pending. */
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const idKey = [...savedIds].sort().join(",");

  useEffect(() => {
    if (!ready || !idKey) return;

    const controller = new AbortController();

    Promise.allSettled(
      idKey.split(",").map((id) => getStudio(id, controller.signal)),
    ).then((results) => {
      if (controller.signal.aborted) return;
      // Deleted listings are dropped silently rather than failing the page.
      const found = results
        .filter(
          (result): result is PromiseFulfilledResult<Studio> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);
      setStudios(found);
      setLoadedKey(idKey);
    });

    return () => controller.abort();
  }, [idKey, ready]);

  const loading = !ready || (idKey !== "" && loadedKey !== idKey);

  if (!ready || loading) {
    return (
      <div className="mt-8">
        <p className="eyebrow mb-5 flex items-center gap-2 text-muted-ink">
          <Loader2Icon className="size-3.5 animate-spin" />
          Reading your saved studios
        </p>
        <StudioGridSkeleton count={Math.max(3, Math.min(6, savedIds.length))} />
      </div>
    );
  }

  if (savedIds.length === 0) {
    return (
      <EmptyState
        className="mt-8"
        icon={<HeartIcon className="size-5" />}
        eyebrow="Nothing saved yet"
        title="Your shortlist is empty."
        description="Tap the heart on any studio card to keep it here. Saved studios sync to your account, so the list follows you across devices."
        action={
          <Link
            href="/studios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            Browse the index
          </Link>
        }
      />
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="eyebrow text-muted-ink">
          {studios.length} saved {studios.length === 1 ? "studio" : "studios"}
        </p>
        <Link
          href="/studios"
          className="text-[11px] font-medium text-muted-ink transition-colors hover:text-ink"
        >
          Find more rooms
        </Link>
      </div>

      {studios.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="size-5" />}
          eyebrow="No longer available"
          title="Those studios are gone."
          description="Every space you saved has been removed by its host. Browse the index to build a new shortlist."
          action={
            <Link
              href="/studios"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
            >
              Browse the index
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {studios.map((studio, index) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              priority={index < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
