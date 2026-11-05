import { StarIcon } from "lucide-react";
import { cn } from "cn";
import { formatRating } from "@/lib/format";

export function RatingBadge({
  rating,
  reviews,
  tone = "paper",
  className,
}: {
  rating: number;
  reviews?: number;
  tone?: "paper" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold backdrop-blur-sm",
        tone === "paper"
          ? "bg-paper/92 text-ink shadow-sm"
          : "bg-ink/72 text-paper",
        className,
      )}
    >
      <StarIcon className="size-3 fill-sodium stroke-sodium" />
      {formatRating(rating)}
      {typeof reviews === "number" ? (
        <span
          className={cn(
            "font-normal",
            tone === "paper" ? "text-ink/55" : "text-paper/60",
          )}
        >
          ({reviews})
        </span>
      ) : null}
    </span>
  );
}
