import Link from "next/link";
import { cn } from "cn";

import { site } from "@/data/site";

function ApertureMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn("size-8", className)}
      fill="none"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="11.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 2.5v6" />
        <path d="M20 37.5v-6" />
        <path d="M2.5 20h6" />
        <path d="M37.5 20h-6" />
        <path d="M7.6 7.6l4.3 4.3" />
        <path d="M32.4 32.4l-4.3-4.3" />
        <path d="M32.4 7.6l-4.3 4.3" />
        <path d="M7.6 32.4l4.3-4.3" />
      </g>
      <circle cx="20" cy="20" r="4.6" fill="var(--sodium)" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "ink",
  markOnly = false,
}: {
  className?: string;
  tone?: "ink" | "paper";
  markOnly?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-80",
        tone === "paper" ? "text-paper" : "text-ink",
        className,
      )}
    >
      <span className="relative grid size-9 shrink-0 place-items-center">
        <ApertureMark className="size-9 transition-transform duration-700 group-hover:rotate-45" />
      </span>
      {!markOnly && (
        <span className="text-[20px] leading-none font-semibold tracking-[-0.04em]">
          Studio
          <span className="font-display text-[22px] font-normal italic tracking-[-0.02em]">
            Space
          </span>
        </span>
      )}
    </Link>
  );
}

export { ApertureMark };
