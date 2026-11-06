"use client";

import { useRef, useState } from "react";
import { CheckIcon, ImagePlusIcon, LinkIcon, Loader2Icon, UploadIcon } from "lucide-react";

import { uploadImageToImgbb } from "@/lib/api";
import { StudioImage } from "@/components/shared/studio-image";
import { toast } from "@/components/ui/toast";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const hostedUrl = await uploadImageToImgbb(file);
      onChange(hostedUrl);
      setUrlDraft(hostedUrl);
      toast.add({
        type: "success",
        title: "Image uploaded",
        description: "Your photo is hosted and attached to the listing.",
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "The upload failed. Try again.";
      setError(message);
      toast.add({
        type: "error",
        title: "Upload failed",
        description: message,
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function applyUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      setError("Paste an image URL first.");
      return;
    }
    setError(null);
    onChange(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  }

  return (
    <div className="rounded-xl border border-ink/12 bg-card-cream p-3">
      <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
        <StudioImage
          src={value}
          alt="Studio cover preview"
          className="aspect-[4/3] w-full rounded-lg border border-ink/8"
        />

        <div className="flex flex-col justify-center gap-2.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink/15 px-4 text-[12px] font-medium transition-colors hover:bg-ink/5 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <UploadIcon className="size-4" />
            )}
            {uploading ? "Uploading to ImgBB…" : "Upload image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <LinkIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-ink" />
              <input
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                placeholder="https://i.ibb.co/…"
                aria-label="Image URL"
                className="h-10 w-full rounded-lg border border-ink/15 bg-paper/70 pr-3 pl-9 text-[11px] placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={applyUrl}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
            >
              <CheckIcon className="size-3.5" />
              Use URL
            </button>
          </div>

          <p className="flex items-start gap-1.5 text-[10px] leading-5 text-muted-ink">
            <ImagePlusIcon className="mt-0.5 size-3 shrink-0" />
            Uploads go to ImgBB. Add{" "}
            <code className="rounded bg-ink/6 px-1 font-mono text-[9px]">
              NEXT_PUBLIC_IMGBB_API_KEY
            </code>{" "}
            to your env, or paste a hosted image URL.
          </p>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-clay/30 bg-clay/8 px-3 py-2 text-[11px] leading-5 text-clay"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
