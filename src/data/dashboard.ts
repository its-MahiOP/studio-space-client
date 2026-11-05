export interface DashboardBooking {
  id: string;
  studioSlug: string;
  studioTitle: string;
  host: string;
  image: string;
  date: string;
  time: string;
  hours: number;
  total: number;
  status: "confirmed" | "pending" | "completed";
  role: "guest" | "host";
}

export const dashboardBookings: DashboardBooking[] = [
  {
    id: "BK-2041",
    studioSlug: "the-cyclorama-house",
    studioTitle: "The Cyclorama House",
    host: "Maya Chen",
    image: "/images/studios/cyc-wall.jpg",
    date: "2026-11-08",
    time: "10:00",
    hours: 4,
    total: 360,
    status: "confirmed",
    role: "guest",
  },
  {
    id: "BK-2038",
    studioSlug: "quiet-hours-podcast-room",
    studioTitle: "Quiet Hours Podcast Room",
    host: "Noor Haddad",
    image: "/images/studios/quiet-hours.jpg",
    date: "2026-11-12",
    time: "14:00",
    hours: 3,
    total: 143,
    status: "pending",
    role: "guest",
  },
  {
    id: "BK-2029",
    studioSlug: "daylight-content-studio",
    studioTitle: "Daylight Content Studio",
    host: "Maya Chen",
    image: "/images/studios/daylight-content.jpg",
    date: "2026-10-24",
    time: "09:00",
    hours: 6,
    total: 445,
    status: "completed",
    role: "guest",
  },
  {
    id: "BK-2011",
    studioSlug: "softbox-loft",
    studioTitle: "Softbox Loft",
    host: "Ava Chen",
    image: "/images/studios/softbox-loft.jpg",
    date: "2026-10-11",
    time: "12:00",
    hours: 5,
    total: 344,
    status: "completed",
    role: "host",
  },
];

export interface DashboardListing {
  id: string;
  studioSlug: string;
  title: string;
  image: string;
  status: "live" | "draft" | "paused";
  rate: number;
  views: number;
  bookings: number;
  rating: number;
  updated: string;
}

export const dashboardListings: DashboardListing[] = [
  {
    id: "LS-101",
    studioSlug: "softbox-loft",
    title: "Softbox Loft",
    image: "/images/studios/softbox-loft.jpg",
    status: "live",
    rate: 65,
    views: 1284,
    bookings: 14,
    rating: 4.6,
    updated: "2 days ago",
  },
  {
    id: "LS-102",
    studioSlug: "daylight-content-studio",
    title: "Daylight Content Studio",
    image: "/images/studios/daylight-content.jpg",
    status: "live",
    rate: 70,
    views: 968,
    bookings: 11,
    rating: 4.9,
    updated: "5 days ago",
  },
  {
    id: "LS-103",
    studioSlug: "paper-and-pigment",
    title: "Paper & Pigment",
    image: "/images/studios/paper-pigment.jpg",
    status: "draft",
    rate: 48,
    views: 0,
    bookings: 0,
    rating: 0,
    updated: "Draft",
  },
];

export const dashboardStats = [
  { label: "Net earnings", value: "$2,840", note: "+18% vs last month" },
  { label: "Upcoming bookings", value: "02", note: "Next on 8 Nov" },
  { label: "Live listings", value: "02", note: "1 draft in progress" },
  { label: "Profile views", value: "2,252", note: "Last 30 days" },
] as const;

export const activityFeed = [
  {
    title: "New booking request",
    detail: "Quiet Hours Podcast Room · 3 hours on 12 Nov",
    time: "12 min ago",
    tone: "amber" as const,
  },
  {
    title: "Payout sent",
    detail: "$344.00 to •••• 4021 for BK-2011",
    time: "Yesterday",
    tone: "sage" as const,
  },
  {
    title: "Review received",
    detail: "5.0 · “The light was exactly as pictured.”",
    time: "2 days ago",
    tone: "clay" as const,
  },
  {
    title: "Listing view milestone",
    detail: "Softbox Loft passed 1,200 views",
    time: "4 days ago",
    tone: "ink" as const,
  },
];
