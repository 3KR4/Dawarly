import Link from "next/link";
import React from "react";
import useTranslate from "@/Contexts/useTranslation";

function CatCard({ data, type, position, activeClass, onSelect }) {
  const t = useTranslate();

  const link =
    type === "cat" ? `/market?cat=${data?.id}` : `/market?subcat=${data?.id}`;

  const Icon = data?.icon;

  const Content = (
    <>
      {Icon && <Icon className="cat-icon" />}
      <h4 className="cat-name">{data?.name}</h4>
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
