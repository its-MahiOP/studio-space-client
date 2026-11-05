import type { ReactNode } from "react";
import { cn } from "cn";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col gap-7 border-t pt-6 md:flex-row md:items-end md:justify-between md:gap-12",
        dark ? "border-paper/20 text-paper" : "border-ink/15 text-ink",
        className,
      )}
    >
      <div className="max-w-3xl">
        <p
          className={cn(
            "eyebrow flex items-center gap-3",
            dark ? "text-paper/55" : "text-muted-ink",
          )}
        >
          <span className="inline-block size-1.5 bg-sodium" />
          {index} / {eyebrow}
        </p>
        <h2 className="display-lg mt-5">{title}</h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-[58ch] text-[15px] leading-7",
              dark ? "text-paper/62" : "text-muted-ink",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
