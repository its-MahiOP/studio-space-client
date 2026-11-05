import type { CategorySlug } from "@/data/categories";

export interface Host {
  name: string;
  avatar: string;
  since: number;
  responseTime: string;
  verified: boolean;
  bio: string;
}

export interface Studio {
  slug: string;
  title: string;
  category: CategorySlug;
  location: {
    city: string;
    neighborhood: string;
  };
  hourlyRate: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  capacity: number;
  sizeSqft: number;
  amenities: string[];
  host: Host;
  description: string;
  instantBook: boolean;
  featured: boolean;
}

const maya: Host = {
  name: "Maya Chen",
  avatar: "/images/avatars/ava.jpg",
  since: 2021,
  responseTime: "under 1 hour",
  verified: true,
  bio: "Photographer and set designer. I keep the lights warm, the coffee strong, and the cyc wall spotless.",
};

const marcus: Host = {
  name: "Marcus Reed",
  avatar: "/images/avatars/marcus.jpg",
  since: 2019,
  responseTime: "under 2 hours",
  verified: true,
  bio: "Former gaffer turned stage manager. I host crews who care about the room as much as the shot.",
};

const noor: Host = {
  name: "Noor Haddad",
  avatar: "/images/avatars/noor.jpg",
  since: 2022,
  responseTime: "under 3 hours",
  verified: true,
  bio: "Podcast producer and sound designer. Every room I list is tuned before it goes live.",
};

export const studios: Studio[] = [
  {
    slug: "the-cyclorama-house",
    title: "The Cyclorama House",
    category: "photo-studios",
    location: { city: "Brooklyn, NY", neighborhood: "East Williamsburg" },
    hourlyRate: 85,
    rating: 4.9,
    reviews: 128,
    image: "/images/studios/cyc-wall.jpg",
    gallery: [
      "/images/studios/cyc-wall.jpg",
      "/images/studios/softbox-loft.jpg",
      "/images/studios/daylight-content.jpg",
    ],
    capacity: 12,
    sizeSqft: 1800,
    amenities: [
      "12ft seamless cyc wall",
      "Profoto strobes",
      "Blackout curtains",
      "Hair & makeup station",
      "Freight elevator",
      "Load-in dock",
    ],
    host: maya,
    description:
      "A sunken corner studio with a 12-foot wraparound cyc wall, painted fresh every month. Built for fashion, portrait and product work that needs room to breathe. The loading dock opens directly into the set so carts, stands and set pieces never have to fight a hallway.",
    instantBook: true,
    featured: true,
  },
  {
    slug: "northlight-stage",
    title: "Northlight Stage",
    category: "sound-stages",
    location: { city: "Los Angeles, CA", neighborhood: "Frogtown" },
    hourlyRate: 175,
    rating: 4.8,
    reviews: 94,
    image: "/images/studios/northlight-stage.jpg",
    gallery: [
      "/images/studios/northlight-stage.jpg",
      "/images/studios/greenroom.jpg",
      "/images/studios/redlight-film.jpg",
    ],
    capacity: 30,
    sizeSqft: 4200,
    amenities: [
      "Sound-treated walls",
      "DMX lighting rig",
      "Green room",
      "Production office",
      "Truck parking",
      "Three-phase power",
    ],
    host: marcus,
    description:
      "A working film stage with a 30-foot grid, sound-treated walls and a lighting package that is already rigged when you arrive. Ideal for narrative shoots, music videos and branded spots that need a controlled room and a fast turnaround.",
    instantBook: false,
    featured: true,
  },
  {
    slug: "quiet-hours-podcast-room",
    title: "Quiet Hours Podcast Room",
    category: "podcast-rooms",
    location: { city: "Chicago, IL", neighborhood: "Logan Square" },
    hourlyRate: 45,
    rating: 5,
    reviews: 76,
    image: "/images/studios/quiet-hours.jpg",
    gallery: [
      "/images/studios/quiet-hours.jpg",
      "/images/studios/listening-room.jpg",
      "/images/categories/podcast.jpg",
    ],
    capacity: 4,
    sizeSqft: 320,
    amenities: [
      "Shure SM7B mics",
      "Four-headphone mix",
      "Acoustic treatment",
      "Remote guest line",
      "Engineer on request",
      "Coffee bar",
    ],
    host: noor,
    description:
      "Two chairs, four microphones and a room quiet enough to hear a page turn. The suite is tuned for two-host shows and remote interviews, with a producer available if you want another pair of ears on the session.",
    instantBook: true,
    featured: true,
  },
  {
    slug: "lacquer-room",
    title: "Lacquer Room",
    category: "music-suites",
    location: { city: "Nashville, TN", neighborhood: "Berry Hill" },
    hourlyRate: 95,
    rating: 4.9,
    reviews: 61,
    image: "/images/studios/lacquer-room.jpg",
    gallery: [
      "/images/studios/lacquer-room.jpg",
      "/images/studios/analog-basement.jpg",
      "/images/categories/music.jpg",
    ],
    capacity: 8,
    sizeSqft: 940,
    amenities: [
      "Vintage API console",
      "Two isolation booths",
      "Grand piano",
      "Backline available",
      "Pro Tools rig",
      "Lounge",
    ],
    host: marcus,
    description:
      "A writing and tracking room with a warm API console, a real piano and enough isolation to keep a full band in the same session. Booked by songwriters for demos and by producers who want to print to tape without leaving town.",
    instantBook: true,
    featured: true,
  },
  {
    slug: "the-clay-table",
    title: "The Clay Table",
    category: "art-workshops",
    location: { city: "Portland, OR", neighborhood: "Central Eastside" },
    hourlyRate: 55,
    rating: 4.7,
    reviews: 43,
    image: "/images/studios/clay-table.jpg",
    gallery: [
      "/images/studios/clay-table.jpg",
      "/images/studios/paper-pigment.jpg",
      "/images/categories/art.jpg",
    ],
    capacity: 14,
    sizeSqft: 1250,
    amenities: [
      "Six pottery wheels",
      "Slop sinks",
      "Drying racks",
      "Shared hand tools",
      "Aprons & towels",
      "Natural light",
    ],
    host: noor,
    description:
      "A mess-friendly workshop with six wheels, deep sinks and long tables that can be rearranged for clay, printmaking or large-format painting. The windows face north, so the light stays soft all afternoon.",
    instantBook: false,
    featured: true,
  },
  {
    slug: "daylight-content-studio",
    title: "Daylight Content Studio",
    category: "photo-studios",
    location: { city: "Austin, TX", neighborhood: "East Austin" },
    hourlyRate: 70,
    rating: 4.9,
    reviews: 88,
    image: "/images/studios/daylight-content.jpg",
    gallery: [
      "/images/studios/daylight-content.jpg",
      "/images/studios/cyc-wall.jpg",
      "/images/categories/photo.jpg",
    ],
    capacity: 6,
    sizeSqft: 760,
    amenities: [
      "North-facing window",
      "Aputure lighting kit",
      "Seamless backdrops",
      "Tethering station",
      "Wardrobe rack",
      "Wi-Fi 6",
    ],
    host: maya,
    description:
      "A calm, light-filled room for portraits, lookbooks and content days. The arched window gives you soft daylight from morning to late afternoon, and the rigged corner means you can go from natural light to controlled light in minutes.",
    instantBook: true,
    featured: true,
  },
  {
    slug: "greenroom-four",
    title: "Greenroom Four",
    category: "sound-stages",
    location: { city: "Atlanta, GA", neighborhood: "West Midtown" },
    hourlyRate: 210,
    rating: 4.8,
    reviews: 52,
    image: "/images/studios/greenroom.jpg",
    gallery: [
      "/images/studios/greenroom.jpg",
      "/images/studios/northlight-stage.jpg",
      "/images/studios/redlight-film.jpg",
    ],
    capacity: 24,
    sizeSqft: 3600,
    amenities: [
      "Full green screen",
      "Motion control ready",
      "Hair & makeup room",
      "Client lounge",
      "Grip truck bay",
      "24/7 access",
    ],
    host: marcus,
    description:
      "A broadcast-ready stage with a full green screen, overhead lighting grid and a separate client lounge. Popular with commercial crews who need a controlled environment and a space that can hold a full day.",
    instantBook: false,
    featured: false,
  },
  {
    slug: "softbox-loft",
    title: "Softbox Loft",
    category: "photo-studios",
    location: { city: "Queens, NY", neighborhood: "Long Island City" },
    hourlyRate: 65,
    rating: 4.6,
    reviews: 37,
    image: "/images/studios/softbox-loft.jpg",
    gallery: [
      "/images/studios/softbox-loft.jpg",
      "/images/studios/cyc-wall.jpg",
      "/images/studios/daylight-content.jpg",
    ],
    capacity: 8,
    sizeSqft: 1100,
    amenities: [
      "Moody blackout studio",
      "Two softboxes",
      "Seamless paper rolls",
      "Changing area",
      "Bluetooth speaker",
      "Street-level access",
    ],
    host: maya,
    description:
      "A low-ceiling loft with a deep brown backdrop and a moody, cinematic feel. It is the kind of room that makes a single softbox look like a full lighting plan, and it is five minutes from the 7 train.",
    instantBook: true,
    featured: false,
  },
  {
    slug: "analog-basement",
    title: "Analog Basement",
    category: "music-suites",
    location: { city: "Detroit, MI", neighborhood: "Corktown" },
    hourlyRate: 60,
    rating: 4.7,
    reviews: 45,
    image: "/images/studios/analog-basement.jpg",
    gallery: [
      "/images/studios/analog-basement.jpg",
      "/images/studios/lacquer-room.jpg",
      "/images/categories/music.jpg",
    ],
    capacity: 5,
    sizeSqft: 620,
    amenities: [
      "16-channel console",
      "Outboard gear",
      "Two vocal booths",
      "Drum kit",
      "Vinyl setup",
      "Late-night access",
    ],
    host: marcus,
    description:
      "A compact control room with a big console and a collection of outboard gear that has seen more records than most rooms in the city. Best for vocals, overdubs and late sessions that need a low-lit, focused space.",
    instantBook: true,
    featured: false,
  },
  {
    slug: "paper-and-pigment",
    title: "Paper & Pigment",
    category: "art-workshops",
    location: { city: "Santa Fe, NM", neighborhood: "Railyard District" },
    hourlyRate: 48,
    rating: 4.8,
    reviews: 29,
    image: "/images/studios/paper-pigment.jpg",
    gallery: [
      "/images/studios/paper-pigment.jpg",
      "/images/studios/clay-table.jpg",
      "/images/categories/art.jpg",
    ],
    capacity: 10,
    sizeSqft: 880,
    amenities: [
      "Adjustable easels",
      "Large work tables",
      "Print drying rack",
      "Reference library",
      "Natural light",
      "Kitchenette",
    ],
    host: noor,
    description:
      "A quiet, high-ceilinged studio for painting, drawing and print work. Easels and tables can be arranged for a class of ten or cleared for one artist who needs the whole floor.",
    instantBook: true,
    featured: false,
  },
  {
    slug: "the-listening-room",
    title: "The Listening Room",
    category: "podcast-rooms",
    location: { city: "Montreal, QC", neighborhood: "Mile End" },
    hourlyRate: 52,
    rating: 4.9,
    reviews: 58,
    image: "/images/studios/listening-room.jpg",
    gallery: [
      "/images/studios/listening-room.jpg",
      "/images/studios/quiet-hours.jpg",
      "/images/categories/podcast.jpg",
    ],
    capacity: 3,
    sizeSqft: 280,
    amenities: [
      "Broadcast mics",
      "Acoustic panels",
      "Video podcast rig",
      "Live room feed",
      "Editing bay",
      "Tea & coffee",
    ],
    host: noor,
    description:
      "A deep-blue room with two chairs, warm lamps and a microphone arm that disappears into the furniture. Built for interviews and video podcasts that want to look as considered as they sound.",
    instantBook: true,
    featured: false,
  },
  {
    slug: "redlight-film-room",
    title: "Redlight Film Room",
    category: "sound-stages",
    location: { city: "Seattle, WA", neighborhood: "Georgetown" },
    hourlyRate: 160,
    rating: 4.6,
    reviews: 34,
    image: "/images/studios/redlight-film.jpg",
    gallery: [
      "/images/studios/redlight-film.jpg",
      "/images/studios/greenroom.jpg",
      "/images/studios/northlight-stage.jpg",
    ],
    capacity: 18,
    sizeSqft: 2400,
    amenities: [
      "Red cyclorama",
      "Overhead track lighting",
      "Camera prep room",
      "Sound cart",
      "Blackout capable",
      "Load-in ramp",
    ],
    host: marcus,
    description:
      "A film room with a red cyc, a low lighting grid and a crew-friendly layout. The color is bold but controllable, and the adjoining prep room keeps camera and sound gear out of the shot.",
    instantBook: false,
    featured: false,
  },
];

export const featuredStudioSlugs = [
  "the-cyclorama-house",
  "northlight-stage",
  "quiet-hours-podcast-room",
  "lacquer-room",
  "the-clay-table",
  "daylight-content-studio",
];
