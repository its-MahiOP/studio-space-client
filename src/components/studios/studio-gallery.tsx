"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "cn";
import { ExpandIcon } from "lucide-react";

export function StudioGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-2.5 sm:grid-cols-[1fr_150px] lg:gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-paper-deep sm:aspect-[16/11]">
        <Image
          src={images[active] ?? images[0]}
          alt={`${title} — view ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover"
        />
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-[10px] font-medium tracking-[0.12em] text-paper uppercase backdrop-blur-sm">
          <ExpandIcon className="size-3" />
          {active + 1} / {images.length}
        </span>
      </div>

      <div className="no-scrollbar flex gap-2.5 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            aria-pressed={active === index}
            className={cn(
              "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:w-full",
              active === index
                ? "border-ink opacity-100"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
