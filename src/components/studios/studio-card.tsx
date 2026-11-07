import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { cn } from "cn";

import { getCategoryForValue } from "@/data/categories";
import type { Studio } from "@/types/studio";
import { formatCurrency } from "@/lib/format";
import { RatingBadge } from "@/components/shared/rating-badge";
import { StudioImage } from "@/components/shared/studio-image";

export function StudioCard({
  studio,
  priority = false,
  className,
}: {
  studio: Studio;
  priority?: boolean;
  className?: string;
}) {
  const category = getCategoryForValue(studio.category);
  const href = `/studios/${studio._id}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-card-cream transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        <StudioImage
          src={studio.imageUrl}
          alt={`${studio.title} — ${category?.label ?? studio.category} in ${studio.location}`}
          priority={priority}
          className="size-full"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80" />
        <span className="absolute top-4 left-4 inline-flex h-7 items-center rounded-full bg-paper/92 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm">
          {category?.value ?? studio.category ?? "Studio"}
        </span>
        <RatingBadge rating={studio.rating} className="absolute top-4 right-4" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="display-md min-h-[2.15em] pr-1">
            <Link href={href} className="transition-colors hover:text-clay">
              {studio.title}
            </Link>
          </h3>
          <p className="shrink-0 pt-1 text-right">
            <span className="text-xl font-semibold tracking-[-0.03em]">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="ml-1 text-[10px] tracking-[0.12em] text-muted-ink uppercase">
              / hr
            </span>
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-ink">
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 shrink-0 text-clay" />
            <span className="line-clamp-1">{studio.location || "Location on request"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="size-3.5" />
            Up to {studio.maxCapacity}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <span className="text-[11px] tracking-[0.12em] text-muted-ink uppercase">
            {studio.securityDeposit > 0
              ? `${formatCurrency(studio.securityDeposit)} deposit`
              : "No deposit"}
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.02em] text-ink transition-colors hover:text-clay"
          >
            View details
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
