"use client";
import { Suspense } from "react";
import AdForm from "@/components/Tools/AdForm";
import { useSearchParams } from "next/navigation";

function DashboardAdFormContent() {
  const searchParams = useSearchParams();
  const adId = searchParams.get("id");
  const tableId = searchParams.get("dep");
  return (
    <AdForm
      type="admin"
      adId={adId}
      initialTableId={tableId}
      reviewActions={Boolean(adId)}
    />
  );
}

export default function CreateAd() {
  return (
    <Suspense fallback={null}>
      <DashboardAdFormContent />
    </Suspense>
  );
}
