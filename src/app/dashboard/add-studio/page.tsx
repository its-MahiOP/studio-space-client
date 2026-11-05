import type { Metadata } from "next";

import { AddStudioForm } from "@/components/dashboard/add-studio-form";

export const metadata: Metadata = {
  title: "Add a studio",
  description: "List a new studio, stage, podcast room or workshop on StudioSpace.",
};

export default function AddStudioPage() {
  return <AddStudioForm />;
}
