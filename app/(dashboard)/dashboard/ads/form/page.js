"use client";
import AdForm from "@/components/Tools/AdForm";
import { useSearchParams } from "next/navigation";

export default function CreateAd() {
  const searchParams = useSearchParams();
  const adId = searchParams.get("id");
  return <AdForm type="admin" adId={adId} />;
}
