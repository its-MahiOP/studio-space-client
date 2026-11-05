import type { Metadata } from "next";
import { Suspense } from "react";

import {
  StudiosExplorer,
  StudiosSkeleton,
} from "@/components/studios/studios-explorer";

export const metadata: Metadata = {
  title: "Explore studios",
  description:
    "Browse photo studios, film stages, podcast lounges, music suites and workshops from independent hosts. Filter by craft, city and price.",
};

export default function StudiosPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-paper-deep/35">
        <div className="shell py-14 sm:py-16 lg:py-20">
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            The index / Live listings from the database
          </p>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="display-lg max-w-2xl">
              Every kind of room,
              <br />
              <span className="italic text-clay">one honest index.</span>
            </h1>
            <p className="max-w-sm text-[14px] leading-7 text-muted-ink lg:pb-2">
              Real listings, transparent hourly rates and hosts who answer their
              messages. Pick the craft, then pick the room.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<StudiosSkeleton />}>
        <StudiosExplorer />
      </Suspense>
    </>
  );
}
