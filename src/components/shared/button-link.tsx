import Link from "next/link";
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export const ctaVariants = cva(
  "group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-sodium/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:-translate-y-0.5 hover:bg-ink/88",
        accent: "bg-sodium text-ink hover:-translate-y-0.5 hover:bg-sodium/85",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink/45 hover:bg-ink/5",
        paper: "bg-paper text-ink hover:-translate-y-0.5 hover:bg-paper/90",
        "outline-light":
          "border border-paper/30 bg-transparent text-paper hover:border-paper/60 hover:bg-paper/10",
        ghost: "text-ink hover:bg-ink/5",
      },
      size: {
        sm: "h-9 px-4 text-[12px]",
        md: "h-11 px-5.5 text-[13px]",
        lg: "h-12 px-7 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof ctaVariants>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(ctaVariants({ variant, size }), className)}
      {...props}
    />
  );
}
