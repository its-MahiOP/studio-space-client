import { ArrowUpRightIcon } from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";

export function HostCTA() {
  return (
    <section className="relative overflow-hidden bg-sodium text-ink">
      <div className="pointer-events-none absolute -right-20 -bottom-40 size-[520px] rounded-full border border-ink/12" />
      <div className="pointer-events-none absolute -right-8 -bottom-24 size-[340px] rounded-full border border-ink/12" />
      <div className="shell relative z-10 grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
        <div>
          <p className="eyebrow flex items-center gap-3 text-ink/60">
            <span className="inline-block size-1.5 bg-ink" />
            05 / For hosts
          </p>
          <h2 className="display-lg mt-5 max-w-3xl">
            Your spare room is somebody&apos;s
            <br />
            <span className="italic">next scene.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-7 text-ink/66">
            List a studio, a stage or a quiet corner. Set your own hours, keep
            control of your calendar and get paid for the space you already
            have.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <ButtonLink href="/dashboard/add-studio" variant="primary" size="lg">
            List your space
            <ArrowUpRightIcon />
          </ButtonLink>
          <ButtonLink href="/how-it-works" variant="outline" size="lg">
            Read the host guide
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
