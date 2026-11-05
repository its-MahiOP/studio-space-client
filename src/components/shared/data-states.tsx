"use client";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "cn";

export function DataError({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[20px] border border-clay/30 bg-clay/6 p-6 sm:p-7",
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-full bg-clay/12 text-clay">
        <AlertTriangleIcon className="size-4" />
      </span>
      <p className="mt-4 font-display text-xl tracking-[-0.02em]">
        We couldn&apos;t load this.
      </p>
      <p className="mt-1.5 max-w-lg text-[12px] leading-6 text-muted-ink">
        {message}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-ink/20 px-4 text-[11px] font-semibold transition-colors hover:bg-ink/5"
        >
          <RefreshCwIcon className="size-3.5" />
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[22px] border border-ink/10 bg-card-cream"
        >
          <div className="aspect-[4/3] animate-pulse bg-paper-deep" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-paper-deep" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-paper-deep" />
            <div className="h-9 w-full animate-pulse rounded bg-paper-deep/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-card-cream">
      <div className="aspect-[4/3] animate-pulse bg-paper-deep" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-paper-deep" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-paper-deep" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-paper-deep" />
      </div>
    </div>
  );
}

export function EmptyState({
  eyebrow = "Nothing here yet",
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-5 rounded-[22px] border border-dashed border-ink/20 bg-card-cream p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12",
        className,
      )}
    >
      <div>
        <p className="eyebrow text-clay">{eyebrow}</p>
        <h2 className="display-md mt-3">{title}</h2>
        <p className="mt-3 max-w-md text-[13px] leading-6 text-muted-ink">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
