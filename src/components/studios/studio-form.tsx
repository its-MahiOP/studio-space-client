"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  PlusIcon,
  TagIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { AMENITY_OPTIONS, CATEGORY_OPTIONS } from "@/data/amenities";
import { createStudio, updateStudio } from "@/lib/api";
import type { Studio, StudioInput } from "@/types/studio";
import { useAuth } from "@/components/providers/auth-provider";
import { GalleryManager } from "@/components/studios/gallery-manager";
import { ImageUploader } from "@/components/studios/image-uploader";
import { toast } from "@/components/ui/toast";

const steps = [
  { number: "01", label: "The basics" },
  { number: "02", label: "Location & size" },
  { number: "03", label: "Rate & deposit" },
  { number: "04", label: "Kit & photos" },
];

function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function StudioForm({
  mode,
  studio,
}: {
  mode: "create" | "edit";
  studio?: Studio;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const editing = mode === "edit" && Boolean(studio);

  const [title, setTitle] = useState(studio?.title ?? "");
  const [category, setCategory] = useState(
    studio?.category ?? CATEGORY_OPTIONS[0],
  );
  const [hourlyRate, setHourlyRate] = useState(
    studio ? String(studio.hourlyRate) : "85",
  );
  const [securityDeposit, setSecurityDeposit] = useState(
    studio ? String(studio.securityDeposit) : "0",
  );
  const [maxCapacity, setMaxCapacity] = useState(
    studio ? String(studio.maxCapacity) : "8",
  );
  const [location, setLocation] = useState(studio?.location ?? "");
  const [imageUrl, setImageUrl] = useState(studio?.imageUrl ?? "");
  const [images, setImages] = useState<string[]>(studio?.images ?? []);
  const [overview, setOverview] = useState(studio?.overview ?? "");
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = Array.from(
    new Set([...CATEGORY_OPTIONS, studio?.category].filter(Boolean) as string[]),
  );
  const amenityOptions = Array.from(
    new Set([...AMENITY_OPTIONS, ...amenities]),
  );

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  }

  function addCustomAmenity() {
    const value = customAmenity.trim();
    if (!value) return;
    setAmenities((current) =>
      current.some((item) => item.toLowerCase() === value.toLowerCase())
        ? current
        : [...current, value],
    );
    setCustomAmenity("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Your session has expired. Sign in again to save this studio.");
      return;
    }

    const rate = Number(hourlyRate);
    const deposit = Number(securityDeposit || 0);
    const capacity = Number(maxCapacity);
    const normalizedImage = normalizeImageUrl(imageUrl);

    if (title.trim().length < 3) {
      setError("Give the studio a name of at least three characters.");
      return;
    }
    if (!category) {
      setError("Pick a category for the space.");
      return;
    }
    if (!Number.isFinite(rate) || rate <= 0) {
      setError("Add an hourly rate greater than zero.");
      return;
    }
    if (!Number.isFinite(deposit) || deposit < 0) {
      setError("The security deposit must be zero or more.");
      return;
    }
    if (!Number.isFinite(capacity) || capacity < 1) {
      setError("Max capacity needs to be at least one person.");
      return;
    }
    if (location.trim().length < 3) {
      setError("Add a city and neighbourhood so creators can find you.");
      return;
    }
    if (!normalizedImage) {
      setError("Upload a cover image or paste an image URL.");
      return;
    }
    if (overview.trim().length < 20) {
      setError("Write at least a sentence or two for the overview.");
      return;
    }

    const payload: StudioInput = {
      title: title.trim(),
      category,
      hourlyRate: rate,
      securityDeposit: deposit,
      maxCapacity: Math.round(capacity),
      location: location.trim(),
      imageUrl: normalizedImage,
      images: images.map((image) => image.trim()).filter(Boolean),
      amenities,
      overview: overview.trim(),
      ownerEmail: editing && studio ? studio.ownerEmail : user.email,
      ownerName: editing && studio ? studio.ownerName : user.name,
    };

    setSubmitting(true);
    try {
      if (editing && studio) {
        await updateStudio(studio._id, payload);
        toast.add({
          type: "success",
          title: "Studio updated",
          description: `${payload.title} is live with the new details.`,
        });
      } else {
        await createStudio(payload);
        toast.add({
          type: "success",
          title: "Studio published",
          description: `${payload.title} is now in your listings.`,
        });
      }
      router.push("/my-listings");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "The studio could not be saved.";
      setError(message);
      toast.add({
        type: "error",
        title: "Could not save studio",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="pb-4">
      <div className="border-b border-ink/12 pb-7">
        <p className="eyebrow flex items-center gap-3 text-muted-ink">
          <span className="inline-block size-1.5 bg-clay" />
          {editing ? "Edit studio / Update the room" : "Add a studio / New listing"}
        </p>
        <h1 className="display-lg mt-4">
          {editing ? (
            <>
              Refine the room,
              <br />
              <span className="italic text-clay">keep it honest.</span>
            </>
          ) : (
            <>
              Tell us about
              <br />
              <span className="italic text-clay">the room.</span>
            </>
          )}
        </h1>
        <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-ink">
          Enough detail to make a creator feel like they&apos;ve already stood in
          it. Everything here is saved straight to your MongoDB listings.
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
        <p className="eyebrow text-muted-ink">00 / Host</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-ink/12 bg-card-cream px-4 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-ink/45">
              <UserIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] tracking-[0.12em] text-muted-ink uppercase">
                Host name
              </p>
              <p className="truncate text-[12px] font-semibold">
                {user?.name ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-ink/12 bg-card-cream px-4 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-ink/45">
              <MailIcon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] tracking-[0.12em] text-muted-ink uppercase">
                Account email
              </p>
              <p className="truncate text-[12px] font-semibold">
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-ink">
          <InfoIcon className="size-3" />
          Host details are read-only and come from your signed-in account.
        </p>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
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
            <label
              htmlFor="studio-category"
              className="eyebrow block text-ink/60"
            >
              Category
            </label>
            <div className="relative mt-2">
              <select
                id="studio-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-ink/15 bg-card-cream pr-10 pl-4 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink/45" />
            </div>
          </div>

          <div>
            <label
              htmlFor="studio-overview"
              className="eyebrow block text-ink/60"
            >
              Detailed overview
            </label>
            <textarea
              id="studio-overview"
              value={overview}
              onChange={(event) => setOverview(event.target.value)}
              rows={5}
              placeholder="What does the light do at 3pm? What's the load-in like? What kind of work does this room suit?"
              className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-card-cream px-4 py-3 text-[13px] leading-6 placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
            <p className="mt-1.5 text-[10px] text-muted-ink">
              {overview.length} characters · aim for 200–500
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">02 / Location &amp; size</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="studio-location" className="eyebrow block text-ink/60">
              Location / address
            </label>
            <div className="relative mt-2">
              <MapPinIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
              <input
                id="studio-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="East Williamsburg, Brooklyn, NY"
                className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[13px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="studio-capacity"
              className="eyebrow block text-ink/60"
            >
              Max capacity
            </label>
            <input
              id="studio-capacity"
              type="number"
              min={1}
              value={maxCapacity}
              onChange={(event) => setMaxCapacity(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-ink/15 bg-card-cream px-4 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
            />
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-muted-ink">
          <InfoIcon className="mt-0.5 size-3 shrink-0" />
          Your full address is shown on the listing. You can keep it to a
          neighbourhood until a booking is confirmed.
        </p>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">03 / Rate &amp; deposit</p>
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
                value={hourlyRate}
                onChange={(event) => setHourlyRate(event.target.value)}
                className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-8 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="studio-deposit"
              className="eyebrow block text-ink/60"
            >
              Security deposit (USD)
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[13px] text-muted-ink">
                $
              </span>
              <input
                id="studio-deposit"
                type="number"
                min={0}
                value={securityDeposit}
                onChange={(event) => setSecurityDeposit(event.target.value)}
                className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-8 text-[13px] focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
              />
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-ink">
              <BadgeCheckIcon className="size-3 text-sage" />
              Refundable, held until the room is returned in order.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-ink/12 pt-7">
        <p className="eyebrow text-muted-ink">04 / Kit &amp; photos</p>

        <div className="mt-4">
          <p className="eyebrow block text-ink/60">
            Amenities ({amenities.length} selected)
          </p>
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

          <div className="mt-3 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <TagIcon className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-ink" />
              <input
                value={customAmenity}
                onChange={(event) => setCustomAmenity(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomAmenity();
                  }
                }}
                placeholder="Add another amenity (e.g. rooftop access)"
                aria-label="Add a custom amenity"
                className="h-10 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[12px] placeholder:text-muted-ink/55 focus:border-ink/40 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addCustomAmenity}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-ink/15 px-4 text-[11px] font-semibold transition-colors hover:bg-ink/5"
            >
              <PlusIcon className="size-3.5" />
              Add
            </button>
          </div>

          {amenities.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-ink/6 pr-1 pl-3 text-[10px] font-medium text-ink/70"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    aria-label={`Remove ${amenity}`}
                    className="grid size-5 place-items-center rounded-full text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="eyebrow block text-ink/60">Cover image</p>
          <div className="mt-2">
            <ImageUploader value={imageUrl} onChange={setImageUrl} />
          </div>
        </div>

        <div className="mt-4">
          <GalleryManager images={images} onChange={setImages} />
        </div>
      </section>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-clay/35 bg-clay/8 px-4 py-2.5 text-[11px] leading-5 text-clay"
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
          . Your listing is published immediately.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/my-listings"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-5 text-[12px] font-medium transition-colors hover:bg-ink/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[12px] font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:ring-3 focus-visible:ring-sodium/40 disabled:opacity-60"
          >
            {submitting
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Publish studio"}
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
