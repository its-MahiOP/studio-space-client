import Link from "next/link";
import { HomeIcon, SearchIcon } from "lucide-react";

import { ButtonLink } from "@/components/shared/button-link";

/**
 * Hand-drawn studio scene: a lit cyc wall, a camera on a tripod, a softbox
 * on its stand and an apple box — all in the StudioSpace palette.
 */
function StudioSceneIllustration() {
  return (
    <svg
      viewBox="0 0 520 380"
      role="img"
      aria-label="Illustration of a photo studio with a lit backdrop, a camera on a tripod and a softbox light."
      // Explicit so every `currentColor` shape flips with the theme tokens
      // even if this scene is ever rendered outside the `text-paper` band.
      className="h-auto w-full text-paper"
    >
      <defs>
        <linearGradient id="wallGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0a33b" stopOpacity="0.42" />
          <stop offset="65%" stopColor="#e0a33b" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0a33b" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="softGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0a33b" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#e0a33b" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#e0a33b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0a33b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e0a33b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="softFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2d9a8" />
          <stop offset="100%" stopColor="#e0a33b" />
        </linearGradient>
      </defs>

      {/* Ambient glow behind the softbox */}
      <circle cx="414" cy="146" r="96" fill="url(#softGlow)" />

      {/* Cyc wall backdrop with the light hitting it */}
      <rect
        x="64"
        y="32"
        width="272"
        height="248"
        rx="20"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeOpacity="0.18"
      />
      <rect
        x="88"
        y="56"
        width="224"
        height="176"
        rx="14"
        fill="url(#wallGlow)"
      />

      {/* Floor */}
      <line
        x1="24"
        y1="312"
        x2="496"
        y2="312"
        stroke="currentColor"
        strokeOpacity="0.24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="252"
        cy="330"
        rx="78"
        ry="9"
        fill="currentColor"
        fillOpacity="0.06"
      />

      {/* Apple box */}
      <rect x="92" y="268" width="68" height="44" rx="6" className="fill-clay" />
      <rect
        x="114"
        y="282"
        width="24"
        height="9"
        rx="4.5"
        className="fill-ink"
        fillOpacity="0.55"
      />

      {/* Hanging pendant lamp */}
      <line
        x1="150"
        y1="0"
        x2="150"
        y2="44"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path
        d="M130 74 L150 44 L170 74 Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeLinejoin="round"
      />
      <circle cx="150" cy="78" r="24" fill="url(#bulbGlow)" />
      <circle cx="150" cy="78" r="7" className="fill-sodium" />

      {/* Camera on a tripod */}
      <g
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M250 250 L212 316" />
        <path d="M250 250 L250 320" />
        <path d="M250 250 L288 316" />
      </g>
      <rect
        x="218"
        y="198"
        width="68"
        height="48"
        rx="9"
        fill="currentColor"
        fillOpacity="0.95"
      />
      <rect x="236" y="187" width="26" height="13" rx="4" fill="currentColor" />
      <circle cx="252" cy="222" r="18" className="fill-ink" />
      <circle
        cx="252"
        cy="222"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <circle cx="252" cy="222" r="9" className="fill-sodium" />
      <circle cx="248" cy="218" r="3" fill="currentColor" fillOpacity="0.85" />
      <circle cx="275" cy="207" r="3.5" className="fill-clay" />

      {/* Softbox on its stand */}
      <g transform="rotate(-18 414 150)">
        <rect
          x="374"
          y="116"
          width="84"
          height="64"
          rx="10"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <rect x="383" y="125" width="66" height="46" rx="6" fill="url(#softFace)" />
      </g>
      <circle cx="414" cy="180" r="6" fill="currentColor" fillOpacity="0.65" />
      <line
        x1="414"
        y1="182"
        x2="414"
        y2="306"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M414 306 L388 318" />
        <path d="M414 306 L414 322" />
        <path d="M414 306 L440 318" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="grain grain-dark relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -top-32 right-0 size-[520px] rounded-full bg-sodium/8 blur-3xl" />
      <div className="shell relative z-10 grid min-h-[70vh] items-center gap-12 py-20 lg:grid-cols-[1.05fr_auto] lg:gap-16">
        <div className="order-2 lg:order-1">
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
            <ButtonLink href="/" variant="accent" size="lg">
              <HomeIcon />
              Return to Home
            </ButtonLink>
            <ButtonLink href="/studios" variant="outline-light" size="lg">
              <SearchIcon />
              Browse the studios
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

        <div className="order-1 mx-auto w-full max-w-[440px] lg:order-2 lg:max-w-[520px]">
          <StudioSceneIllustration />
        </div>
      </div>
    </section>
  );
}
