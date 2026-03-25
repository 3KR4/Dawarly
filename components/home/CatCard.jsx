"use client";

import { settings } from "@/Contexts/settings";
import Link from "next/link";
import { useContext } from "react";

function CatCard({ data, type, position, activeClass, onSelect }) {
  const { locale } = useContext(settings);

  // نختار الاسم حسب اللغة
  const name = locale === "ar" ? data?.name_ar : data?.name_en;

  const link =
    type === "cat" ? `/market?cat=${data?.id}` : `/market?subcat=${data?.id}`;

  const Icon = data?.icon; // لو فيه icon

  const Content = (
    <>
      {Icon && <Icon className="cat-icon" />}
      <h4 className="cat-name">{name}</h4>
    </>
  );

  if (position === "when-create-ad") {
    return (
      <div
        className={`cat-card ${activeClass ? "active" : ""}`}
        onClick={() => onSelect?.(data)}
      >
        {Content}
      </div>
    );
  }

  return (
    <Link href={link} className="cat-card">
      {Content}
    </Link>
  );
}

export default CatCard;
