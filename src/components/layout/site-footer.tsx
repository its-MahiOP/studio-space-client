import Link from "next/link";

import { categories } from "@/data/categories";
import { footerNav, socials, site } from "@/data/site";
import { Logo } from "@/components/layout/logo";
import {
  InstagramLogo,
  LinkedInLogo,
  XLogo,
  YouTubeLogo,
} from "@/components/layout/x-logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const socialIcons = {
  x: XLogo,
  instagram: InstagramLogo,
  linkedin: LinkedInLogo,
  youtube: YouTubeLogo,
} as const;

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      className="grain grain-dark relative overflow-hidden bg-ink text-paper"
    >
      <div className="shell relative z-10 pt-16 pb-8 sm:pt-20">
        <div className="grid gap-12 border-b border-paper/14 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Logo tone="paper" />
            <p className="mt-6 max-w-md font-display text-[clamp(1.45rem,2.2vw,2rem)] leading-[1.15] tracking-[-0.02em] text-paper/92">
              The rooms are out there.
              <br />
              <span className="italic text-sodium">We help you find them.</span>
            </p>
            <p className="mt-5 max-w-md text-[13px] leading-6 text-paper/52">
              {site.name} is a peer-to-peer marketplace connecting creators with
              the studios, stages and workshops that make their work possible.
              Book direct. Host fair. Keep the money in the creative community.
            </p>

            <div className="mt-8 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid size-9 place-items-center rounded-full border border-paper/18 text-paper/65 transition-colors hover:border-sodium/60 hover:text-sodium"
                  >
                    <Icon className="size-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:pt-1">
            <p className="eyebrow text-paper/45">Field notes / newsletter</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none tracking-[-0.025em]">
              Good rooms, in your inbox.
            </h2>
            <p className="mt-3 mb-6 max-w-sm text-[13px] leading-6 text-paper/52">
              New spaces, host stories and the occasional production tip. Sent
              when we have something worth saying.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="eyebrow font-sans text-[10px] font-medium text-paper/40">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-paper/66 transition-colors hover:text-sodium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow font-sans text-[10px] font-medium text-paper/40">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/studios?category=${category.slug}`}
                    className="text-[13px] text-paper/66 transition-colors hover:text-sodium"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/14 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] leading-5 text-paper/38">
            © 2026 {site.name}. All rights reserved. StudioSpace is a demo
            marketplace built for creators.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-paper/45">
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms of service
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <span className="text-paper/22">/</span>
            <span>Made for the people who make things.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
