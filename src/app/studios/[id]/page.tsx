"use client";

import { Suspense } from "react";

import { StudioDetail } from "@/components/studios/studio-detail";

export default function StudioDetailPage() {
  return (
    <Suspense fallback={<div className="shell py-8">Loading studio...</div>}>
      <StudioDetail />
    </Suspense>
  );
}
