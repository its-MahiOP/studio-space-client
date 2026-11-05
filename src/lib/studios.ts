import { studios, featuredStudioSlugs, type Studio } from "@/data/studios";
import type { CategorySlug } from "@/data/categories";

/**
 * Dummy data access layer.
 * Replace the bodies of these helpers with MongoDB / API calls later.
 * The home page intentionally asks for a limited set, mirroring `.limit(6)`.
 */
export function getFeaturedStudios(limit = 6): Studio[] {
  return featuredStudioSlugs
    .map((slug) => studios.find((studio) => studio.slug === slug))
    .filter((studio): studio is Studio => Boolean(studio))
    .slice(0, limit);
}

export type StudioSort = "recommended" | "price-asc" | "price-desc" | "rating";

export interface StudioFilters {
  category?: string;
  query?: string;
  sort?: string;
}

export function getStudios({ category, query, sort }: StudioFilters = {}) {
  let result = [...studios];

  if (category) {
    result = result.filter((studio) => studio.category === category);
  }

  if (query) {
    const needle = query.trim().toLowerCase();
    result = result.filter((studio) =>
      [studio.title, studio.location.city, studio.location.neighborhood, studio.category]
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
    default:
      result.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating ||
          a.title.localeCompare(b.title),
      );
  }

  return result;
}

export function getStudioBySlug(slug: string) {
  return studios.find((studio) => studio.slug === slug);
}

export function getRelatedStudios(studio: Studio, limit = 3) {
  return studios
    .filter((item) => item.slug !== studio.slug && item.category === studio.category)
    .slice(0, limit);
}

export function countByCategory(category: CategorySlug) {
  return studios.filter((studio) => studio.category === category).length;
}
