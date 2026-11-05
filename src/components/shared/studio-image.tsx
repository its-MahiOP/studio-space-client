"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { ImageOffIcon } from "lucide-react";
import { cn } from "cn";

export function StudioImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: {
  src: string | undefined;
  alt: string;
  /** Position/size classes for the wrapper. */
  className?: string;
  /** Extra classes for the <img> element. */
  imageClassName?: string;
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-deep",
        className,
      )}
    >
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-paper-deep text-muted-ink">
          <ImageOffIcon className="size-5 text-ink/25" />
          <span className="text-[9px] tracking-[0.14em] uppercase">
            No image
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSrc(src ?? null)}
          className={cn(
            "absolute inset-0 size-full object-cover",
            imageClassName,
          )}
        />
      )}
    </div>
  );
}
