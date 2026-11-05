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
  slug: CategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  image: string;
  icon: CategoryIcon;
  count: number;
}

export const categories: StudioCategory[] = [
  {
    slug: "photo-studios",
    label: "Photo Studios",
    shortLabel: "Photo",
    description: "Cyc walls, daylight rooms and fully rigged sets.",
    image: "/images/categories/photo.jpg",
    icon: "aperture",
    count: 142,
  },
  {
    slug: "sound-stages",
    label: "Sound Stages",
    shortLabel: "Stage",
    description: "Acoustically treated floors built for motion.",
    image: "/images/categories/sound.jpg",
    icon: "clapperboard",
    count: 68,
  },
  {
    slug: "podcast-rooms",
    label: "Podcast Rooms",
    shortLabel: "Podcast",
    description: "Quiet, warm rooms with broadcast-ready mics.",
    image: "/images/categories/podcast.jpg",
    icon: "mic",
    count: 96,
  },
  {
    slug: "music-suites",
    label: "Music Suites",
    shortLabel: "Music",
    description: "Writing rooms, live rooms and analog consoles.",
    image: "/images/categories/music.jpg",
    icon: "music",
    count: 74,
  },
  {
    slug: "art-workshops",
    label: "Art Workshops",
    shortLabel: "Workshop",
    description: "Mess-friendly spaces made for making by hand.",
    image: "/images/categories/art.jpg",
    icon: "palette",
    count: 53,
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
