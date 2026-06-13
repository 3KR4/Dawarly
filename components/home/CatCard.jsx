"use client";

import { settings } from "@/Contexts/settings";
import { useAppData } from "@/Contexts/DataContext";
import { buildMarketUrl } from "@/utils/marketSeo";
import Link from "next/link";
import { useContext } from "react";
import { MdOutlineModeEdit } from "react-icons/md";

function CatCard({
  data,
  type,
  position,
  activeClass,
  className = "",
  dashboard = false,
  onSelect,
  target,
  setTarget,
  hideCount = false,
}) {
  const { locale, setMenuType } = useContext(settings);
  const {
    countries,
    governorates,
    cities,
    areas,
    compounds,
    tables,
    categories,
    subCategories,
  } = useAppData();

  const link = (() => {
    const filters = {};

    if (type === "tables") {
      filters.dep = data?.id;
    } else if (type === "categories") {
      if (data?.table_id) filters.dep = data.table_id;
      filters.cat = data?.id;
    } else if (type === "subcategories") {
      if (data?.table_id) filters.dep = data.table_id;
      if (data?.category_id) filters.cat = data.category_id;
      filters.subcat = data?.id;
    } else if (type === "governorates") {
      filters.governorate_id = data?.id;
    } else if (type === "cities") {
      filters.city_id = data?.id;
    } else if (type === "areas") {
      filters.area_id = data?.id;
    } else if (type === "compounds") {
      filters.compound_id = data?.id;
    }

    return buildMarketUrl(
      filters,
      {
        countries,
        governorates,
        cities,
        areas,
        compounds,
        tables,
        categories,
        subCategories,
      },
      "",
    );
  })();

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

      {!hideCount && count > 0 && <span className="count">{count}</span>}
    </>
  );

  if (position === "when-create-ad") {
    return (
      <div
        className={`cat-card ${activeClass ? "active" : ""} ${className}`}
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
    <Link
      href={link}
      className={`cat-card ${activeClass ? "active" : ""} ${className}`}
    >
      {Content}
    </Link>
  );
}

export default CatCard;
