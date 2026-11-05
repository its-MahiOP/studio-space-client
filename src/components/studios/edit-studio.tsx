"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, ShieldAlertIcon } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useStudio } from "@/hooks/use-api-data";
import { DataError } from "@/components/shared/data-states";
import { StudioForm } from "@/components/studios/studio-form";

export function EditStudio() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const { user } = useAuth();
  const { data: studio, loading, error, reload } = useStudio(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-paper-deep" />
        <div className="h-12 w-2/3 animate-pulse rounded bg-paper-deep" />
        <div className="h-80 w-full animate-pulse rounded-2xl bg-paper-deep/70" />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="mx-auto max-w-xl py-10">
        {error && !error.toLowerCase().includes("not found") ? (
          <DataError message={error} onRetry={reload} />
        ) : (
          <div className="rounded-[20px] border border-ink/12 bg-card-cream p-8 text-center">
            <p className="eyebrow text-clay">404 / Listing not found</p>
            <h1 className="mt-3 font-display text-3xl tracking-[-0.02em]">
              This listing has left the building.
            </h1>
            <p className="mt-2 text-[12px] leading-6 text-muted-ink">
              It may have been deleted, or the link is incomplete.
            </p>
            <Link
              href="/my-listings"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-semibold text-paper"
            >
              <ArrowLeftIcon className="size-3.5" />
              Back to my listings
            </Link>
          </div>
        )}
      </div>
    );
  }

  const ownsListing =
    user &&
    studio.ownerEmail.toLowerCase().trim() === user.email.toLowerCase().trim();

  if (!ownsListing) {
    return (
      <div className="mx-auto max-w-xl rounded-[20px] border border-clay/25 bg-card-cream p-8 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-clay/10 text-clay">
          <ShieldAlertIcon className="size-5" />
        </span>
        <p className="eyebrow mt-4 text-clay">Private listing</p>
        <h1 className="mt-2 font-display text-3xl tracking-[-0.02em]">
          This room belongs to another host.
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-muted-ink">
          You can only edit studios saved under your own account email
          ({user?.email}).
        </p>
        <Link
          href="/my-listings"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[12px] font-semibold text-paper"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to my listings
        </Link>
      </div>
    );
  }

  return <StudioForm mode="edit" studio={studio} />;
}
