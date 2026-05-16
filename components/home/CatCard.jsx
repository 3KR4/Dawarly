"use client";

import { settings } from "@/Contexts/settings";
import Link from "next/link";
import { useContext } from "react";
import { MdOutlineModeEdit } from "react-icons/md";

function CatCard({
  data,
  type,
  position,
  activeClass,
  dashboard = false,
  onSelect,
  target,
  setTarget,
}) {
  const { locale, setMenuType } = useContext(settings);

  const link =
    type === "categories"
      ? `/market?cat=${data?.id}`
      : `/market?subcat=${data?.id}`;

  const Icon = data?.icon;
  const count = data?.childsCount ?? data?.areasCount;

  const allowedWithoutTarget = ["countries", "categories"];

  const showEditButton =
    dashboard && (target || (!target && allowedWithoutTarget.includes(type)));

  const Content = (
    <>
      {Icon && <Icon className="cat-icon" />}
      <h4 className="cat-name ellipsis">{data?.[`name_${locale}`]}</h4>
      {showEditButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTarget(data);
            setMenuType("form");
          }}
        >
          <MdOutlineModeEdit />
        </button>
      )}

      {count > 0 && <span className="count">{count}</span>}
    </>
  );

  if (position === "when-create-ad") {
    return (
      <div
        className={`cat-card ${activeClass ? "active" : ""}`}
        onClick={() => {
          if (["compounds", "subcategories"].includes(type)) {
            setTarget(data);
            setMenuType("form");
          } else {
            onSelect?.(data);
          }
        }}
      >
        {Content}
      </div>
    );
  }

  return (
    <Link href={link} className={`cat-card ${activeClass ? "active" : ""}`}>
      {Content}
    </Link>
  );
}

export default CatCard;
