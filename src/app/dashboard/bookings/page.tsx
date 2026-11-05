import type { Metadata } from "next";

import { BookingsView } from "@/components/dashboard/bookings-view";

export const metadata: Metadata = {
  title: "My bookings",
  description: "See upcoming sessions, past shoots and the crews you're hosting.",
};

export default function DashboardBookingsPage() {
  return <BookingsView />;
}
