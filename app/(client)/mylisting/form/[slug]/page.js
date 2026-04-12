"use client";

import AdForm from "@/components/Tools/AdForm";
import { useParams } from "next/navigation";

export default function CreateAd() {
  const { slug } = useParams();
  const adId = slug;
  return (
    <div className="dashboard container">
      <AdForm type="client" adId={adId} />
    </div>
  );
}
