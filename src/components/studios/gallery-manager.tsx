"use client";

import { useRef, useState } from "react";
import {
  ImagesIcon,
  LinkIcon,
  Loader2Icon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { uploadImageToImgbb } from "@/lib/api";
import { StudioImage } from "@/components/shared/studio-image";
import { toast } from "@/components/ui/toast";

/**
 * Additional gallery photos for a listing. The cover image lives in its own
 * field; these power the carousel on the studio detail page (up to 12).
 */
export function GalleryManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addUrl(raw: string) {
    const url = raw.trim();
    if (!url) {
      setError("Paste an image URL first.");
      return;
    }
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    if (images.includes(normalized)) {
      setError("That photo is already in the gallery.");
      return;
    }
    setError(null);
    onChange([...images, normalized].slice(0, 12));
    setDraft("");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, position) => position !== index));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG, PNG, WebP or GIF).");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      setError("ImgBB accepts files up to 32 MB. Try a smaller image.");
      return;
    }

    setUploading(true);
    try {
      const hosted = await uploadImageToImgbb(file);
      if (images.length >= 12) {
        throw new Error("The gallery holds up to 12 photos.");
      }
      if (!images.includes(hosted)) {
        onChange([...images, hosted]);
      }
      toast.add({
        type: "success",
        title: "Photo added",
        description: "It's now part of the listing gallery.",
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "The upload failed. Try again.";
      setError(message);
      toast.add({ type: "error", title: "Upload failed", description: message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-ink/12 bg-card-cream p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="eyebrow flex items-center gap-1.5 text-ink/60">
          <ImagesIcon className="size-3" />
          Gallery photos ({images.length}/12)
        </p>
        <p className="text-[10px] text-muted-ink">
          Shown as a carousel on the detail page.
        </p>
      </div>

      {images.length > 0 ? (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {images.map((image, index) => (
            <li key={`${image}-${index}`} className="group relative">
              <StudioImage
                src={image}
                alt={`Gallery photo ${index + 1}`}
                className="aspect-[4/3] w-full rounded-lg border border-ink/8"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove gallery photo ${index + 1}`}
                className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-ink/75 text-paper transition-colors hover:bg-ink"
              >
                <XIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-ink/15 px-4 text-[11px] font-medium transition-colors hover:bg-ink/5 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <UploadIcon className="size-3.5" />
          )}
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <div className="flex min-w-0 flex-1 gap-2">
          <div className="relative min-w-0 flex-1">
            <LinkIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-ink" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addUrl(draft);
                }
              }}
              placeholder="…or paste an image URL"
              aria-label="Gallery image URL"
              className="h-9 w-full rounded-lg border border-ink/15 bg-paper/70 pr-3 pl-9 text-[11px] placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => addUrl(draft)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
          >
            <PlusIcon className="size-3.5" />
            Add
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 rounded-lg border border-clay/30 bg-clay/8 px-3 py-1.5 text-[10px] leading-5 text-clay"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
