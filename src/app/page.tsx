import { HeroSlider } from "@/components/home/hero-slider";
import { StatsStrip } from "@/components/home/stats-strip";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { CategoryGrid } from "@/components/home/category-grid";
import { BookingSteps } from "@/components/home/booking-steps";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HostCTA } from "@/components/home/host-cta";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <StatsStrip />
      <FeaturedStudios />
      <CategoryGrid />
      <BookingSteps />
      <HostGuarantee />
      <HostCTA />
    </>
  );
}
