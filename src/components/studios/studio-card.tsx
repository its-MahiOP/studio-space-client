import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { cn } from "cn";

import { getCategory } from "@/data/categories";
import type { Studio } from "@/data/studios";
import { formatCurrency } from "@/lib/format";
import { RatingBadge } from "@/components/shared/rating-badge";

export function StudioCard({
  studio,
  priority = false,
  className,
}: {
  studio: Studio;
  priority?: boolean;
  className?: string;
}) {
  const category = getCategory(studio.category);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-card-cream transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <Link
        href={`/studios/${studio.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-paper-deep"
      >
        <Image
          src={studio.image}
          alt={`${studio.title} — ${category?.label ?? "studio"} in ${studio.location.city}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80" />
        <span className="absolute top-4 left-4 inline-flex h-7 items-center rounded-full bg-paper/92 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm">
          {category?.label ?? "Studio"}
        </span>
        <RatingBadge
          rating={studio.rating}
          reviews={studio.reviews}
          className="absolute top-4 right-4"
        />
        {studio.instantBook ? (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-paper uppercase">
            <span className="size-1.5 rounded-full bg-sodium" />
            Instant book
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="display-md min-h-[2.15em] pr-1">
            <Link
              href={`/studios/${studio.slug}`}
              className="transition-colors hover:text-clay"
            >
              {studio.title}
            </Link>
          </h3>
          <p className="shrink-0 pt-1 text-right">
            <span className="text-xl font-semibold tracking-[-0.03em]">
              {formatCurrency(studio.hourlyRate)}
            </span>
            <span className="block text-[10px] tracking-[0.12em] text-muted-ink uppercase">
              per hour
            </span>
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-ink">
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 text-clay" />
            {studio.location.neighborhood}, {studio.location.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="size-3.5" />
            Up to {studio.capacity}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4 mt-5">
          <span className="text-[11px] tracking-[0.14em] text-muted-ink uppercase">
            {studio.sizeSqft.toLocaleString()} sq ft
          </span>
          <Link
            href={`/studios/${studio.slug}`}
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
