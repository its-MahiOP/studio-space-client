"use client";

import { averageRating, uniqueCities } from "@/lib/studios";
import { useStudios } from "@/hooks/use-api-data";

export function StatsStrip() {
  const { data: studios, loading } = useStudios();

  const stats = [
    {
      label: "Spaces listed",
      value: loading ? "—" : String(studios.length),
    },
    {
      label: "Cities",
      value: loading ? "—" : String(uniqueCities(studios)),
    },
    {
      label: "Average rating",
      value:
        loading || averageRating(studios) === 0
          ? "—"
          : averageRating(studios).toFixed(1),
    },
    {
      label: "Categories",
      value: "5",
    },
  ];

  return (
    <section className="border-b border-ink/10 bg-paper">
      <div className="shell grid grid-cols-2 divide-x divide-ink/10 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="flex items-baseline gap-3 px-4 py-5 first:pl-0 last:pr-0 sm:px-6 md:justify-center"
          >
            <span className="font-mono text-[10px] text-ink/35">
              0{index + 1}
            </span>
            <div>
              <p className="font-display text-2xl leading-none tracking-[-0.03em] sm:text-[28px]">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10px] tracking-[0.14em] text-muted-ink uppercase">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
