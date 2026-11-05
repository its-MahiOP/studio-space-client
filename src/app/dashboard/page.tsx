import type { Metadata } from "next";

import { DashboardOverview } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your StudioSpace bookings, listings and payouts.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
