import type { ReactNode } from "react";
import { cn } from "cn";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grain grain-dark relative overflow-hidden bg-ink text-paper",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-40 -right-24 size-[520px] rounded-full bg-sodium/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -left-32 size-[420px] rounded-full border border-paper/8" />
      <div className="shell relative z-10 py-16 sm:py-20 lg:py-24">
        <p className="eyebrow flex items-center gap-3 text-paper/52">
          <span className="inline-block size-1.5 bg-sodium" />
          {eyebrow}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <h1 className="display-lg max-w-4xl">{title}</h1>
            {description ? (
              <p className="mt-5 max-w-[58ch] text-[14px] leading-7 text-paper/60 sm:text-[15px]">
                {description}
              </p>
            ) : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
