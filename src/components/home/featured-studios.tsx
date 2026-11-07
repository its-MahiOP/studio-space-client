"use client";

import Link from "next/link";
import { ArrowUpRightIcon, PlusIcon } from "lucide-react";

import { filterStudios } from "@/lib/studios";
import { useStudios } from "@/hooks/use-api-data";
import { ButtonLink } from "@/components/shared/button-link";
import { SectionHeading } from "@/components/shared/section-heading";
import { DataError, StudioGridSkeleton } from "@/components/shared/data-states";
import { StudioCard } from "@/components/studios/studio-card";

export function FeaturedStudios() {
  // Top-rated / newest six, limited server-side with .limit(6).
  const { data: studios, loading, error, reload } = useStudios({
    limit: 6,
    sort: "recommended",
  });
  const featured = filterStudios(studios, { sort: "recommended" }).slice(0, 6);

  return (
    <section id="featured" className="py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Featured spaces"
          title={
            <>
              Rooms with
              <br />
              <span className="italic text-clay">a point of view.</span>
            </>
          }
          description="Live listings from hosts who care about the details: the light, the quiet, the load-in, the coffee. Every studio you see here is pulled straight from our database."
          action={
            <ButtonLink href="/studios" variant="outline" size="md">
              Browse all studios
              <ArrowUpRightIcon />
            </ButtonLink>
          }
        />

        {error ? (
          <DataError className="mt-11" message={error} onRetry={reload} />
        ) : loading && studios.length === 0 ? (
          <div className="mt-11">
            <StudioGridSkeleton count={6} />
          </div>
        ) : featured.length > 0 ? (
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featured.map((studio, index) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-11 flex flex-col items-start gap-5 rounded-[22px] border border-dashed border-ink/20 bg-card-cream p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <p className="eyebrow text-clay">No studios yet</p>
              <h3 className="display-md mt-3">
                The first room is yours to list.
              </h3>
              <p className="mt-3 max-w-md text-[13px] leading-6 text-muted-ink">
                The database is empty right now. Publish a studio and it will
                appear here the moment it&apos;s saved.
              </p>
            </div>
            <Link
              href="/add-studio"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              <PlusIcon className="size-4" />
              Add a studio
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 border-t border-ink/10 pt-5 text-[11px] tracking-[0.12em] text-muted-ink uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>Sorted by creator rating &amp; recency</p>
          <p>
            <span className="text-ink">{studios.length}</span>{" "}
            {studios.length === 1 ? "space" : "spaces"} listed right now
          </p>
        </div>
      </div>
    </section>
  );
}
