export const site = {
  name: "StudioSpace",
  tagline: "Peer-to-peer creative workspace & production studio sharing",
  description:
    "Discover, inspect and book photography studios, sound stages, podcast rooms, music suites and art workshops from independent hosts.",
  email: "hello@studiospace.demo",
  phone: "+1 (415) 555-0138",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const;

export const footerNav = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/studios", label: "All studios" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/about", label: "About StudioSpace" },
    ],
  },
  {
    title: "For hosts",
    links: [
      { href: "/add-studio", label: "List your space" },
      { href: "/my-listings", label: "My listings" },
      { href: "/how-it-works", label: "Host guarantee" },
      { href: "/about", label: "Creator support" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Create account" },
      { href: "/my-bookings", label: "My bookings" },
      { href: "/terms", label: "Terms & privacy" },
    ],
  },
] as const;

export const socials = [
  { href: "https://x.com", label: "X (formerly Twitter)", icon: "x" },
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "linkedin" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
] as const;
