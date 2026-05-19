"use client";

import AdForm from "@/components/Tools/AdForm";
import { useParams, useSearchParams } from "next/navigation";

export default function CreateAd() {
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
