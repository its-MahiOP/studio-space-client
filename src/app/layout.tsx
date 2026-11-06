import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { ReactNode, Suspense } from "react";
import "./globals.css";

import { AuthProvider } from "@/components/providers/auth-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/toast";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiospace.demo"),
  title: {
    default: "StudioSpace — Peer-to-peer creative studios & production spaces",
    template: "%s · StudioSpace",
  },
  description:
    "Discover, inspect and book photo studios, sound stages, podcast rooms, music suites and art workshops from independent hosts. Transparent hourly pricing, real availability, no middle layer.",
  keywords: [
    "studio rental",
    "photo studio",
    "sound stage",
    "podcast studio",
    "music studio",
    "art workshop",
    "creative workspace",
    "peer-to-peer marketplace",
  ],
  applicationName: "StudioSpace",
  authors: [{ name: "StudioSpace" }],
  openGraph: {
    type: "website",
    siteName: "StudioSpace",
    title: "StudioSpace — Peer-to-peer creative studios & production spaces",
    description:
      "Book the room your next project deserves. Photo studios, sound stages, podcast rooms, music suites and art workshops from independent hosts.",
    images: [
      {
        url: "/images/hero/hero-cyc.jpg",
        width: 1920,
        height: 1280,
        alt: "A warm, softly lit photography studio with a seamless backdrop.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace — Peer-to-peer creative studios & production spaces",
    description:
      "Book the room your next project deserves. Discover creative spaces from independent hosts.",
    images: ["/images/hero/hero-cyc.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <AuthProvider>
          <Toaster>
            <a
              href="#main-content"
              className="sr-only z-100 rounded-full bg-ink px-4 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              Skip to content
            </a>
            {/* The header reads the pathname, which is only known at request
                time on dynamic routes — Suspense keeps prerendering working. */}
            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="h-[70px] border-b border-ink/10 bg-paper/88"
                />
              }
            >
              <SiteHeader />
            </Suspense>
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </Toaster>
        </AuthProvider>
      </body>
    </html>
  );
}
