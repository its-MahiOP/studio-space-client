"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ApertureIcon,
  ArrowUpRightIcon,
  ClapperboardIcon,
  MicIcon,
  MusicIcon,
  PaletteIcon,
} from "lucide-react";

import { categories, type CategoryIcon } from "@/data/categories";
import { countByCategory } from "@/lib/studios";
import { useStudios } from "@/hooks/use-api-data";
import { SectionHeading } from "@/components/shared/section-heading";

const iconMap: Record<CategoryIcon, typeof ApertureIcon> = {
  aperture: ApertureIcon,
  clapperboard: ClapperboardIcon,
  mic: MicIcon,
  music: MusicIcon,
  palette: PaletteIcon,
};

export function CategoryGrid() {
  const { data: studios } = useStudios();

  return (
    <section className="border-y border-ink/10 bg-paper-deep/45 py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Browse by category"
          title={
            <>
              Find the room
              <br />
              <span className="italic text-clay">for the work.</span>
            </>
          }
          description="Five kinds of space, one standard. Pick a craft and we'll take you straight to the rooms that fit it."
        />

        <div className="mt-11 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon];
            const count = countByCategory(studios, category.slug);
            return (
              <Link
                key={category.slug}
                href={`/studios?category=${category.slug}`}
                className="group relative isolate flex aspect-[3/4] flex-col overflow-hidden rounded-[20px] bg-ink text-paper focus-visible:ring-3 focus-visible:ring-sodium/60"
              >
                <Image
                  src={category.image}
                  alt={`${category.label} available on StudioSpace`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover opacity-80 saturate-[0.85] transition-all duration-700 group-hover:scale-105 group-hover:opacity-95 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/28 to-ink/15" />

                <div className="relative z-10 flex items-start justify-between p-4">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-paper/60">
                    0{index + 1}
                  </span>
                  <span className="rounded-full border border-paper/22 bg-ink/20 px-2 py-1 text-[9px] tracking-[0.1em] text-paper/70 uppercase backdrop-blur-sm">
                    {count} {count === 1 ? "space" : "spaces"}
                  </span>
                </div>

                <div className="relative z-10 mt-auto p-4">
                  <span className="mb-5 grid size-9 place-items-center rounded-full border border-paper/25 bg-paper/8 backdrop-blur-sm transition-colors group-hover:border-sodium/50 group-hover:bg-sodium group-hover:text-ink">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="font-display text-[clamp(1.35rem,2vw,1.8rem)] leading-[1.02] tracking-[-0.02em]">
                    {category.label}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-[1.55] text-paper/55">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.14em] text-sodium uppercase">
                    Explore
                    <ArrowUpRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
