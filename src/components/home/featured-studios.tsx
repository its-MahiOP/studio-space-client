import { ArrowUpRightIcon } from "lucide-react";

import { getFeaturedStudios } from "@/lib/studios";
import { ButtonLink } from "@/components/shared/button-link";
import { SectionHeading } from "@/components/shared/section-heading";
import { StudioCard } from "@/components/studios/studio-card";

export function FeaturedStudios() {
  const studios = getFeaturedStudios(6);

  return (
    <section id="featured" className="py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Featured spaces"
          title={
            <>
              Six rooms with
              <br />
              <span className="italic text-clay">a point of view.</span>
            </>
          }
          description="Handpicked studios from hosts who care about the details: the light, the quiet, the load-in, the coffee. Every listing is inspected before it goes live."
          action={
            <ButtonLink href="/studios" variant="outline" size="md">
              Browse all studios
              <ArrowUpRightIcon />
            </ButtonLink>
          }
        />

        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {studios.map((studio, index) => (
            <StudioCard
              key={studio.slug}
              studio={studio}
              priority={index < 3}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-ink/10 pt-5 text-[11px] tracking-[0.12em] text-muted-ink uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>Sorted by creator rating &amp; recent activity</p>
          <p>
            <span className="text-ink">1,200+ spaces</span> across 48 cities
          </p>
        </div>
      </div>
    </section>
  );
}
