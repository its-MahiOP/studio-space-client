"use client";

import { HeartIcon, Loader2Icon } from "lucide-react";
import { cn } from "cn";

import { useWishlistStore } from "@/components/providers/wishlist-provider";

/**
 * Save-to-wishlist heart (Optional requirement). Optimistic toggle lives in
 * the WishlistProvider so every card, the detail page and the /wishlist page
 * stay in sync.
 */
export function SaveButton({
  studioId,
  title,
  className,
  variant = "overlay",
}: {
  studioId: string;
  title: string;
  className?: string;
  variant?: "overlay" | "ghost";
}) {
  const { ready, isSaved, toggle } = useWishlistStore();
  const saved = isSaved(studioId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved studios` : `Save ${title}`}
      title={saved ? "Remove from saved" : "Save studio"}
      disabled={!ready}
      onClick={(event) => {
        // Cards nest the heart next to a Link — never let the click bubble.
        event.preventDefault();
        event.stopPropagation();
        void toggle(studioId, title);
      }}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300",
        "focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variant === "overlay"
          ? "bg-paper/92 text-ink hover:bg-paper"
          : "border border-ink/15 bg-card-cream text-ink hover:border-ink/30",
        !ready && "opacity-60",
        className,
      )}
    >
      {ready ? (
        <HeartIcon
          className={cn(
            "size-4 transition-all duration-300",
            saved ? "fill-clay text-clay" : "text-ink",
          )}
        />
      ) : (
        <Loader2Icon className="size-4 animate-spin text-muted-ink" />
      )}
    </button>
  );
}
