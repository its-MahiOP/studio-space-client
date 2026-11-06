import { ApertureMark } from "@/components/layout/logo";

const SPINNER_SIZES = {
  sm: { ring: "size-10", inner: "size-9", mark: "size-5" },
  md: { ring: "size-16", inner: "size-14", mark: "size-8" },
} as const;

/**
 * Branded spinner: the StudioSpace aperture mark inside a pulsing ring.
 * Used for async waits (session checks, route transitions).
 */
export function BrandSpinner({
  size = "md",
  className,
}: {
  size?: keyof typeof SPINNER_SIZES;
  className?: string;
}) {
  const sizes = SPINNER_SIZES[size];

  return (
    <span
      className={`relative grid place-items-center ${sizes.ring} ${className ?? ""}`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-sodium/30" />
      <span
        className={`relative grid place-items-center rounded-full border border-ink/12 bg-card-cream shadow-[0_10px_30px_-22px_rgba(23,21,15,0.6)] ${sizes.inner}`}
      >
        <ApertureMark className={`${sizes.mark} text-ink`} />
      </span>
    </span>
  );
}

/**
 * Branded route-transition loader: spinner over a light skeleton preview.
 * Rendered by the `loading.tsx` files of each route segment.
 */
export function RouteLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"
    >
      <BrandSpinner />

      <p className="mt-6 text-[11px] font-semibold tracking-[0.16em] text-muted-ink uppercase">
        {label}…
      </p>

      <div className="mt-10 w-full max-w-xl space-y-3" aria-hidden="true">
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-paper-deep" />
        <div className="h-3 w-3/5 animate-pulse rounded-full bg-paper-deep/70" />
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-paper-deep/55"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
