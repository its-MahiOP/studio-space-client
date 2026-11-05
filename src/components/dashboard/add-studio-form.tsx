"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CameraIcon,
  CheckIcon,
  ImagePlusIcon,
  InfoIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";

import { categories } from "@/data/categories";

const amenityOptions = [
  "Cyc wall",
  "Blackout curtains",
  "Strobe lighting",
  "Acoustic treatment",
  "Green room",
  "Load-in dock",
  "Hair & makeup",
  "Wi-Fi",
  "Sound system",
  "Natural light",
  "Freight elevator",
  "Kitchenette",
];

const steps = [
  { number: "01", label: "The basics" },
  { number: "02", label: "Location & size" },
  { number: "03", label: "Rate & rules" },
  { number: "04", label: "Kit & photos" },
];

export function AddStudioForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0].slug);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [capacity, setCapacity] = useState("6");
  const [size, setSize] = useState("");
  const [rate, setRate] = useState("75");
  const [instantBook, setInstantBook] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([
    "Cyc wall",
    "Blackout curtains",
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryLabel =
    categories.find((item) => item.slug === category)?.label ?? "Studio";

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3) {
      setError("Give the studio a name of at least three characters.");
      return;
    }
    if (!city.trim() || !neighborhood.trim()) {
      setError("Add a city and neighbourhood so creators can find you.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[22px] border border-sage/35 bg-card-cream p-8 sm:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-sage/15 text-sage-ink">
          <CheckIcon className="size-6" />
        </span>
        <p className="eyebrow mt-6 text-sage-ink">Draft created</p>
        <h1 className="display-lg mt-3">
          {title.trim() || "Your studio"} is
          <br />
          <span className="italic text-clay">on the board.</span>
        </h1>
        <p className="mt-4 max-w-lg text-[13px] leading-7 text-muted-ink">
          This is a demo — nothing was saved to a server. In the real flow the
          listing would land in your dashboard as a draft, ready for photos and
          a final review.
        </p>

        <dl className="mt-7 grid gap-4 border-y border-ink/12 py-5 sm:grid-cols-2">
          {[
            ["Category", categoryLabel],
            ["Location", `${neighborhood}, ${city}`],
            ["Rate", `$${rate || "0"} / hour`],
            ["Booking", instantBook ? "Instant book" : "On request"],
            ["Capacity", `${capacity || "0"} people`],
            ["Size", size ? `${size} sq ft` : "Not set"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] tracking-[0.12em] text-muted-ink uppercase">
                {label}
              </dt>
              <dd className="mt-1 text-[13px] font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/listings"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            Go to my listings
            <ArrowRightIcon className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-5 text-[12px] font-medium transition-colors hover:bg-ink/5"
          >
            Edit this draft
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pb-4">
      <div className="border-b border-ink/12 pb-7">
        <p className="eyebrow flex items-center gap-3 text-muted-ink">
          <span className="inline-block size-1.5 bg-clay" />
          Add a studio / Step 1 of 1
        </p>
        <h1 className="display-lg mt-4">
          Tell us about
          <br />
          <span className="italic text-clay">the room.</span>
        </h1>
        <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
          Enough detail to make a creator feel like they&apos;ve already stood in
          it. You can save a draft and come back at any time.
        </p>

        <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex items-center gap-2 rounded-lg border border-ink/10 bg-card-cream px-3 py-2"
            >
              <span className="font-mono text-[9px] text-ink/35">
                {step.number}
              </span>
              <span className="text-[10px] font-medium text-ink/65">
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <section className="mt-8">
        <p className="eyebrow text-muted-ink">01 / The basics</p>
        <div className="mt-4 space-y-5">
          <div>
            <label htmlFor="studio-title" className="eyebrow block text-ink/60">
              Studio name
            </label>
            <input
              id="studio-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The North Window"
              className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-card-cream px-4 text-[13px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
          </div>

          <div>
            <span className="eyebrow block text-ink/60">Category</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setCategory(item.slug)}
                  aria-pressed={category === item.slug}
                  className={cn(
                    "h-9 rounded-full border px-3.5 text-[11px] font-medium transition-colors",
                    category === item.slug
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink/60 hover:border-ink/35 hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="studio-description"
              className="eyebrow block text-ink/60"
            >
              Description
            </label>
            <textarea
              id="studio-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="What does the light do at 3pm? What's the load-in like? What kind of work does this room suit?"
              className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-card-cream px-4 py-3 text-[13px] leading-6 placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
            <p className="mt-1.5 text-[10px] text-muted-ink">
              {description.length} characters · aim for 200–500
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">02 / Location &amp; size</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="studio-city" className="eyebrow block text-ink/60">
              City
            </label>
            <div className="relative mt-2">
              <MapPinIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
              <input
                id="studio-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Brooklyn, NY"
                className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[13px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="studio-neighborhood"
              className="eyebrow block text-ink/60"
            >
              Neighbourhood
            </label>
            <input
              id="studio-neighborhood"
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              placeholder="East Williamsburg"
              className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-card-cream px-4 text-[13px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
          </div>
          <div>
            <label
              htmlFor="studio-capacity"
              className="eyebrow block text-ink/60"
            >
              Capacity
            </label>
            <input
              id="studio-capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-card-cream px-4 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
          </div>
          <div>
            <label htmlFor="studio-size" className="eyebrow block text-ink/60">
              Size (sq ft)
            </label>
            <input
              id="studio-size"
              type="number"
              min={0}
              value={size}
              onChange={(event) => setSize(event.target.value)}
              placeholder="1200"
              className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-card-cream px-4 text-[13px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-muted-ink">
          <InfoIcon className="mt-0.5 size-3 shrink-0" />
          The exact address is only shared with confirmed guests. City and
          neighbourhood are public.
        </p>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">03 / Rate &amp; rules</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="studio-rate" className="eyebrow block text-ink/60">
              Hourly rate (USD)
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-muted-ink">
                $
              </span>
              <input
                id="studio-rate"
                type="number"
                min={1}
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-8 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-ink">
              Similar {categoryLabel.toLowerCase()} average $68–120 / hour.
            </p>
          </div>

          <div>
            <span className="eyebrow block text-ink/60">Booking style</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInstantBook(true)}
                aria-pressed={instantBook}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  instantBook
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 hover:border-ink/30",
                )}
              >
                <BadgeCheckIcon
                  className={cn(
                    "size-4",
                    instantBook ? "text-sodium" : "text-sage",
                  )}
                />
                <span className="mt-2 block text-[11px] font-semibold">
                  Instant book
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[9px] leading-4",
                    instantBook ? "text-paper/55" : "text-muted-ink",
                  )}
                >
                  Fewer steps, faster fills
                </span>
              </button>
              <button
                type="button"
                onClick={() => setInstantBook(false)}
                aria-pressed={!instantBook}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  !instantBook
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 hover:border-ink/30",
                )}
              >
                <SparklesIcon
                  className={cn(
                    "size-4",
                    !instantBook ? "text-sodium" : "text-clay",
                  )}
                />
                <span className="mt-2 block text-[11px] font-semibold">
                  On request
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[9px] leading-4",
                    !instantBook ? "text-paper/55" : "text-muted-ink",
                  )}
                >
                  Approve every session
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">04 / Kit &amp; photos</p>
        <div className="mt-4">
          <span className="eyebrow block text-ink/60">
            Amenities ({amenities.length} selected)
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => {
              const active = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[11px] font-medium transition-colors",
                    active
                      ? "border-sage/50 bg-sage/12 text-sage-ink"
                      : "border-ink/15 text-ink/60 hover:border-ink/35 hover:text-ink",
                  )}
                >
                  {active ? <CheckIcon className="size-3" /> : null}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <span className="eyebrow block text-ink/60">Photos</span>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-5">
            <button
              type="button"
              className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-card-cream text-muted-ink transition-colors hover:border-ink/45 hover:text-ink sm:col-span-2 sm:aspect-auto sm:min-h-[140px]"
            >
              <ImagePlusIcon className="size-5" />
              <span className="text-[11px] font-medium">
                Add photos (demo)
              </span>
              <span className="text-[9px]">JPG or PNG · up to 10</span>
            </button>
            {["Cover", "Set", "Detail"].map((label) => (
              <div
                key={label}
                className="relative flex aspect-[4/3] items-center justify-center rounded-xl border border-ink/10 bg-paper-deep/60 text-ink/25 sm:aspect-auto sm:min-h-[140px]"
              >
                <CameraIcon className="size-5" />
                <span className="absolute bottom-2 left-2 text-[9px] tracking-[0.1em] uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] leading-5 text-muted-ink">
            Listings with six or more photos get roughly 2.4× more booking
            requests. Natural light, the load-in and the kit are the shots
            people look for.
          </p>
        </div>
      </section>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-clay/35 bg-clay/8 px-4 py-2.5 text-[11px] text-clay"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 border-t border-ink/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-5 text-muted-ink">
          By saving you agree to the{" "}
          <Link
            href="/terms"
            className="text-ink underline decoration-sodium decoration-2 underline-offset-2"
          >
            host terms
          </Link>
          . Nothing is published until you review it.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-5 text-[12px] font-medium transition-colors hover:bg-ink/5"
          >
            Save draft
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:ring-3 focus-visible:ring-sodium/40"
          >
            Create listing
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
