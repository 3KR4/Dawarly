import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import useTranslate from "@/Contexts/useTranslation";

function CatCard({ data, type, position, onSelect }) {
  const t = useTranslate();

  const name =
    type === "cat" ? t.categories?.[data?.name] : t.subcategories?.[data?.name];

  const link =
    type === "cat" ? `/market?cat=${data?.id}` : `/market?subcat=${data?.id}`;

  const Icon = data?.icon;

  const Content = (
    <>
      {Icon && <Icon className="cat-icon" />}
      <h4 className="cat-name">{name}</h4>
      {position === "when-create-ad" && (
        <FaArrowRight className="cat-arrow-icon" />
      )}
    </>
  );
  if (position === "when-create-ad") {
    return (
      <div className="cat-card" onClick={() => onSelect?.(data)}>
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
