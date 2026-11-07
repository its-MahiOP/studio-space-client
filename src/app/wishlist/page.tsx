import type { Metadata } from "next";

import { RequireAuth } from "@/components/shared/require-auth";
import { SavedStudios } from "@/components/studios/saved-studios";

export const metadata: Metadata = {
  title: "Saved studios",
  description:
    "Your shortlist of photo studios, sound stages, podcast rooms, music suites and art workshops.",
};

export default function WishlistPage() {
  return (
    <RequireAuth>
      <div className="shell py-8 lg:py-10">
        <p className="eyebrow flex items-center gap-3 text-muted-ink">
          <span className="inline-block size-1.5 bg-clay" />
          Your shortlist / Saved to your account
        </p>
        <div className="mt-5 flex flex-col gap-5 border-b border-ink/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="display-lg max-w-xl">
            Rooms you&apos;ve{" "}
            <span className="italic text-clay">marked to remember.</span>
          </h1>
          <p className="max-w-sm text-[13px] leading-6 text-muted-ink sm:pb-2">
            Saved studios stay tied to your account, so your shortlist is waiting
            whenever you come back.
          </p>
        </div>
        <SavedStudios />
      </div>
    </RequireAuth>
  );
}
