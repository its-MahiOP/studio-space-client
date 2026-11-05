import type { Metadata } from "next";

import { RequireAuth } from "@/components/shared/require-auth";
import { MyListings } from "@/components/studios/my-listings";

export const metadata: Metadata = {
  title: "My studio listings",
  description: "Manage the studios you host on StudioSpace.",
};

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <div className="shell py-8 lg:py-10">
        <MyListings />
      </div>
    </RequireAuth>
  );
}
