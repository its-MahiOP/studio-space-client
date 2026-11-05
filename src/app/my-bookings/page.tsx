import type { Metadata } from "next";

import { RequireAuth } from "@/components/shared/require-auth";
import { MyBookings } from "@/components/studios/my-bookings";

export const metadata: Metadata = {
  title: "My bookings",
  description:
    "See every workspace you've requested, with live status and cancellation controls.",
};

export default function MyBookingsPage() {
  return (
    <RequireAuth>
      <div className="shell py-8 lg:py-10">
        <MyBookings />
      </div>
    </RequireAuth>
  );
}
