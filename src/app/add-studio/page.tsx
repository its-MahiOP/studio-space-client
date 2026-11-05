import type { Metadata } from "next";

import { RequireAuth } from "@/components/shared/require-auth";
import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "Add a studio",
  description:
    "List a new studio, stage, podcast lounge, music suite or workshop on StudioSpace.",
};

export default function AddStudioPage() {
  return (
    <RequireAuth>
      <div className="shell py-8 lg:py-10">
        <StudioForm mode="create" />
      </div>
    </RequireAuth>
  );
}
