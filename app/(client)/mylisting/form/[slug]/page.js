"use client";

import { Suspense } from "react";
import AdForm from "@/components/Tools/AdForm";
import { useParams, useSearchParams } from "next/navigation";

function MyListingAdFormContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const adId = slug;
  const tableId = searchParams.get("dep");
  return (
    <div className="dashboard container">
      <AdForm type="client" adId={adId} initialTableId={tableId} />
    </div>
  );
}

export default function CreateAd() {
  return (
    <Suspense fallback={null}>
      <MyListingAdFormContent />
    </Suspense>
  );
}
