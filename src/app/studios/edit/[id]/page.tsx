import type { Metadata } from "next";

import { RequireAuth } from "@/components/shared/require-auth";
import { EditStudio } from "@/components/studios/edit-studio";

export const metadata: Metadata = {
  title: "Edit studio",
  description: "Update the details of a studio you host on StudioSpace.",
};

export default function EditStudioPage() {
  return (
    <RequireAuth>
      <div className="shell py-8 lg:py-10">
        <EditStudio />
      </div>
    </RequireAuth>
  );
}
