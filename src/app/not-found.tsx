import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";

export default function NotFound() {
  return (
    <section className="grain grain-dark relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -top-32 right-0 size-[520px] rounded-full bg-sodium/8 blur-3xl" />
      <div className="shell relative z-10 flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow flex items-center gap-3 text-paper/50">
          <span className="inline-block size-1.5 bg-sodium" />
          Error 404 / Room not found
        </p>
        <p className="mt-8 font-display text-[clamp(6rem,18vw,14rem)] leading-[0.8] tracking-[-0.05em] text-paper/12">
          404
        </p>
        <h1 className="display-lg -mt-4 max-w-2xl">
          This door doesn&apos;t
          <br />
          <span className="italic text-sodium">open onto a studio.</span>
        </h1>
        <p className="mt-5 max-w-md text-[14px] leading-7 text-paper/55">
          The page may have moved, the listing may have closed, or the link was
          mistyped. The good rooms are still where you left them.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/studios" variant="accent" size="lg">
            <SearchIcon />
            Browse the studios
          </ButtonLink>
          <ButtonLink href="/" variant="outline-light" size="lg">
            <ArrowLeftIcon />
            Back to home
          </ButtonLink>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-paper/14 pt-5 text-[11px] tracking-[0.12em] text-paper/38 uppercase">
          <Link href="/how-it-works" className="transition-colors hover:text-paper">
            How it works
          </Link>
          <Link href="/about" className="transition-colors hover:text-paper">
            About us
          </Link>
          <Link href="/terms" className="transition-colors hover:text-paper">
            Terms &amp; privacy
          </Link>
        </div>
      </div>
    </section>
  );
}
