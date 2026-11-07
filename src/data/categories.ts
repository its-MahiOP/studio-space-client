export type CategorySlug =
  | "photo-studios"
  | "sound-stages"
  | "podcast-rooms"
  | "music-suites"
  | "art-workshops";

export type CategoryIcon =
  | "aperture"
  | "clapperboard"
  | "mic"
  | "music"
  | "palette";

export interface StudioCategory {
  /** URL-friendly identifier used by /studios?category=… */
  slug: CategorySlug;
  /** Exact value stored in the MongoDB `category` field. */
  value: string;
  label: string;
  shortLabel: string;
  description: string;
  image: string;
  icon: CategoryIcon;
}

export const categories: StudioCategory[] = [
  {
    slug: "photo-studios",
    value: "Photo Studio",
    label: "Photo Studios",
    shortLabel: "Photo",
    description: "Cyc walls, daylight rooms and fully rigged sets.",
    image: "/images/categories/photo.jpg",
    icon: "aperture",
  },
  {
    slug: "sound-stages",
    value: "Sound Stage",
    label: "Sound Stages",
    shortLabel: "Stage",
    description: "Acoustically treated floors built for motion.",
    image: "/images/categories/sound.jpg",
    icon: "clapperboard",
  },
  {
    slug: "podcast-rooms",
    value: "Podcast Room",
    label: "Podcast Rooms",
    shortLabel: "Podcast",
    description: "Quiet, warm rooms with broadcast-ready mics.",
    image: "/images/categories/podcast.jpg",
    icon: "mic",
  },
  {
    slug: "music-suites",
    value: "Music Suite",
    label: "Music Suites",
    shortLabel: "Music",
    description: "Writing rooms, live rooms and analog consoles.",
    image: "/images/categories/music.jpg",
    icon: "music",
  },
  {
    slug: "art-workshops",
    value: "Art Workshop",
    label: "Art Workshops",
    shortLabel: "Art",
    description: "Mess-friendly spaces made for making by hand.",
    image: "/images/categories/art.jpg",
    icon: "palette",
  },
];

export const categoryValues = categories.map((category) => category.value);

/** Matches a category by slug, stored value, or label. */
export function getCategory(identifier: string | undefined) {
  if (!identifier) return undefined;
  const needle = identifier.trim().toLowerCase();

  return categories.find(
    (category) =>
      category.slug.toLowerCase() === needle ||
      category.value.toLowerCase() === needle ||
      category.label.toLowerCase() === needle,
  );
}

/** Category metadata for a studio document, with a safe fallback. */
export function getCategoryForValue(value: string | undefined) {
  return getCategory(value);
}
