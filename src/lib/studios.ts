import { categories, getCategory } from "@/data/categories";
import type { Studio } from "@/types/studio";

export type StudioSort =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface StudioFilters {
  category?: string;
  query?: string;
  sort?: string;
}

export function studioMatchesCategory(studio: Studio, identifier: string) {
  const category = getCategory(identifier);
  const needle = (category?.value ?? identifier).trim().toLowerCase();
  return studio.category.trim().toLowerCase() === needle;
}

export function filterStudios(
  studios: Studio[],
  { category, query, sort }: StudioFilters = {},
) {
  let result = [...studios];

  if (category) {
    result = result.filter((studio) => studioMatchesCategory(studio, category));
  }

  if (query?.trim()) {
    const needle = query.trim().toLowerCase();
    result = result.filter((studio) =>
      [
        studio.title,
        studio.location,
        studio.category,
        studio.overview,
        studio.ownerName,
        ...studio.amenities,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price-desc":
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
      break;
    default:
      result.sort(
        (a, b) =>
          b.rating - a.rating ||
          new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime() ||
          a.title.localeCompare(b.title),
      );
  }

  return result;
}

export function relatedStudios(
  studio: Studio,
  studios: Studio[],
  limit = 3,
) {
  return studios
    .filter(
      (item) =>
        item._id !== studio._id &&
        item.category.trim().toLowerCase() ===
          studio.category.trim().toLowerCase(),
    )
    .slice(0, limit);
}

export function countByCategory(studios: Studio[], slug: string) {
  return studios.filter((studio) => studioMatchesCategory(studio, slug)).length;
}

export function cityFromLocation(location: string) {
  const parts = location.split(",");
  return (parts[parts.length - 1] ?? location).trim();
}

export function uniqueCities(studios: Studio[]) {
  return new Set(
    studios
      .map((studio) => cityFromLocation(studio.location))
      .filter(Boolean)
      .map((city) => city.toLowerCase()),
  ).size;
}

export function averageRating(studios: Studio[]) {
  const rated = studios.filter((studio) => studio.rating > 0);
  if (rated.length === 0) return 0;
  return rated.reduce((total, studio) => total + studio.rating, 0) / rated.length;
}

export { categories };
