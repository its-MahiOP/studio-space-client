"use client";

import { useEffect, useState } from "react";
import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import { cn } from "cn";

import { formatCurrency, formatRating } from "@/lib/format";

export function MobileBookingBar({
  rate,
  rating,
  onBook,
}: {
  rate: number;
  rating: number;
  onBook: () => void;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ink/12 bg-paper/95 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden",
        hidden && "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.01em]">
            {formatCurrency(rate)}
            <span className="text-[11px] font-normal text-muted-ink">
              {" "}
              / hour
            </span>
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-ink">
            <StarIcon
              className={
                rating > 0
                  ? "size-3 fill-sodium stroke-sodium"
                  : "size-3 stroke-muted-ink"
              }
            />
            {rating > 0 ? formatRating(rating) : "New listing"}
          </p>
        </div>
        <button
          type="button"
          onClick={onBook}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/88"
        >
          Book now
          <ArrowUpRightIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
