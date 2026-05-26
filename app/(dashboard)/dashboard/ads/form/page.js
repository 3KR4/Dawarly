"use client";
import AdForm from "@/components/Tools/AdForm";
import { useSearchParams } from "next/navigation";

export default function CreateAd() {
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
