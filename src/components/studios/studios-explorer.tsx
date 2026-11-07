"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { cn } from "cn";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";

import { categories, getCategory } from "@/data/categories";
import { filterStudios, type StudioSort } from "@/lib/studios";
import { useStudios } from "@/hooks/use-api-data";
import { StudioCard } from "@/components/studios/studio-card";
import { DataError, EmptyState, StudioGridSkeleton } from "@/components/shared/data-states";

const sortOptions: { value: StudioSort; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const allCategories = { slug: "", label: "All spaces", shortLabel: "All" };

export function StudiosExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const category = searchParams.get("category") ?? "";
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as StudioSort) || "recommended";

  const [searchValue, setSearchValue] = useState(query);
  const [syncedQuery, setSyncedQuery] = useState(query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Keep the input in step with the URL when it changes underneath us
  // (browser back/forward, or a link that carries ?q=).
  if (syncedQuery !== query) {
    setSyncedQuery(query);
    setSearchValue(query);
  }

  const { data: studios, loading, error, reload } = useStudios();

  const results = useMemo(
    () => filterStudios(studios, { category, query, sort }),
    [studios, category, query, sort],
  );

  const activeCategory = getCategory(category);

  function updateParams(
    updates: Record<string, string | null>,
    options?: { resetScroll?: boolean },
  ) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    const next = params.toString();
    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: options?.resetScroll ?? false,
      });
    });
  }

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams({ q: searchValue.trim() || null });
  }

  const hasFilters = Boolean(
    category || query || (sort && sort !== "recommended"),
  );

  return (
    <div className="shell pb-24">
      <div className="sticky top-[70px] z-30 -mx-5 border-y border-ink/10 bg-paper/92 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={onSearchSubmit}
            role="search"
            className="flex h-11 w-full items-center gap-2 rounded-full border border-ink/15 bg-card-cream pr-1.5 pl-4 transition-colors focus-within:border-ink/35 lg:max-w-md"
          >
            <SearchIcon className="size-4 shrink-0 text-muted-ink" />
            <label htmlFor="studio-search" className="sr-only">
              Search studios by name, city or amenity
            </label>
            <input
              id="studio-search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search studio, city or amenity"
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] placeholder:text-muted-ink/70 focus:outline-none"
            />
            {searchValue ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchValue("");
                  updateParams({ q: null });
                }}
                className="grid size-7 shrink-0 place-items-center rounded-full text-muted-ink transition-colors hover:bg-ink/6 hover:text-ink"
              >
                <XIcon className="size-3.5" />
              </button>
            ) : null}
            <button
              type="submit"
              className="h-8 shrink-0 rounded-full bg-ink px-4 text-[11px] font-semibold tracking-[0.06em] text-paper uppercase transition-colors hover:bg-ink/85"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[12px] font-medium transition-colors hover:bg-ink/5 lg:hidden"
            >
              <SlidersHorizontalIcon className="size-4" />
              Filters
              {hasFilters ? <span className="size-1.5 rounded-full bg-clay" /> : null}
            </button>

            <div className="hidden items-center gap-2 overflow-x-auto lg:flex">
              {[allCategories, ...categories].map((item) => {
                const active = category === item.slug;
                return (
                  <button
                    key={item.slug || "all"}
                    type="button"
                    onClick={() => updateParams({ category: item.slug || null })}
                    className={cn(
                      "h-9 shrink-0 rounded-full border px-3.5 text-[12px] font-medium transition-colors",
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 text-ink/65 hover:border-ink/35 hover:text-ink",
                    )}
                    aria-pressed={active}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="relative shrink-0">
              <label htmlFor="studio-sort" className="sr-only">
                Sort studios
              </label>
              <select
                id="studio-sort"
                value={sort}
                onChange={(event) =>
                  updateParams({
                    sort:
                      event.target.value === "recommended"
                        ? null
                        : event.target.value,
                  })
                }
                className="h-10 appearance-none rounded-full border border-ink/15 bg-card-cream pr-9 pl-4 text-[12px] font-medium text-ink transition-colors hover:border-ink/30 focus:outline-none focus-visible:border-ink/40"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-ink/50" />
            </div>
          </div>
        </div>

        {mobileFiltersOpen ? (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-ink/10 pt-3 lg:hidden">
            {[allCategories, ...categories].map((item) => {
              const active = category === item.slug;
              return (
                <button
                  key={item.slug || "all"}
                  type="button"
                  onClick={() => updateParams({ category: item.slug || null })}
                  className={cn(
                    "h-9 shrink-0 rounded-full border px-3.5 text-[12px] font-medium transition-colors",
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink/65 hover:border-ink/35 hover:text-ink",
                  )}
                  aria-pressed={active}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-muted-ink">
            {activeCategory ? activeCategory.label : "Every space"}
          </p>
          <h1 className="display-md mt-3">
            {activeCategory
              ? activeCategory.label
              : query
                ? `Results for “${query}”`
                : "The studio index"}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-muted-ink">
            {activeCategory
              ? activeCategory.description
              : "Every room on StudioSpace, straight from the live database. Filter by craft, or search for a city you're shooting in."}
          </p>
        </div>
        <p className="text-[11px] tracking-[0.14em] text-muted-ink uppercase">
          {loading && studios.length === 0
            ? "Loading spaces…"
            : `${results.length} ${results.length === 1 ? "space" : "spaces"}`}
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                updateParams({ category: null, q: null, sort: null });
              }}
              className="ml-4 inline-flex items-center gap-1 text-clay transition-colors hover:text-ink"
            >
              Clear filters <XIcon className="size-3" />
            </button>
          ) : null}
        </p>
      </div>

      {error ? (
        <DataError message={error} onRetry={reload} className="mt-8" />
      ) : loading && studios.length === 0 ? (
        <div className="mt-8">
          <StudioGridSkeleton />
        </div>
      ) : results.length > 0 ? (
        <div
          aria-busy={pending || loading}
          className={cn(
            "mt-8 grid gap-5 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6",
            (pending || loading) && "pointer-events-none opacity-50",
          )}
        >
          {results.map((studio, index) => (
            <StudioCard key={studio._id} studio={studio} priority={index < 3} />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          className="mt-8"
          eyebrow="The index is empty"
          title="The first room is yours to list."
          description="There are no studios in the database yet. Add one from the host form and it will appear here instantly, with its own detail page."
          action={
            <Link
              href="/add-studio"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              <PlusIcon className="size-4" />
              Add a studio
            </Link>
          }
        />
      ) : (
        <EmptyState
          className="mt-8"
          eyebrow="No rooms found"
          title="Nothing matches that search yet."
          description="Try a broader city, a different craft, or clear the filters and browse the full index."
          icon={<SearchIcon className="size-5" />}
          action={
            <Link
              href="/studios"
              onClick={() => setSearchValue("")}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Reset the index
              <ArrowUpRightIcon className="size-4" />
            </Link>
          }
        />
      )}
    </div>
  );
}

export function StudiosSkeleton() {
  return (
    <div className="shell pb-24">
      <div className="mt-8 h-24 animate-pulse rounded-2xl bg-paper-deep/70" />
      <div className="mt-8">
        <StudioGridSkeleton />
      </div>
    </div>
  );
}
