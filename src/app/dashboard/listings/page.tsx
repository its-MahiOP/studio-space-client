import type { Metadata } from "next";

import { ListingsManager } from "@/components/dashboard/listings-manager";

export const metadata: Metadata = {
  title: "My studio listings",
  description: "Manage the studios you host on StudioSpace.",
};

export default function ListingsPage() {
  return <ListingsManager />;
}
