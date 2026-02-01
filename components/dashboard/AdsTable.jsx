"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { formatEGP } from "@/utils/formatCurrency";

import Image from "next/image";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";

import {
  ads,
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";

export default function AdsTable({ ads, page = "dashboard", limit = 11 }) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();
  const statusOptions = [
    { id: "pending", name: t.ad.status.pending },
    { id: "active", name: t.ad.status.active },
    { id: "sold", name: t.ad.status.sold },
    { id: "paused", name: t.ad.status.paused },
  ];
  return (
    <div className={`body ${page == "user" ? "fluid-container for-user" : ""}`}>
      <div className="table-container products">
        <div className="table-header">
          {!screenSize.includes("small") && (
            <>
              <div className="header-item details">
                {t.dashboard.tables.ad_details}
              </div>
              <div className="header-item">{t.dashboard.forms.price}</div>
              <div className="header-item">{t.home.categories}</div>
              <div className="header-item">
                {t.dashboard.tables.published_at}
              </div>
              <div className="header-item">{t.dashboard.tables.status}</div>
              <div className="header-item">{t.dashboard.tables.actions}</div>
            </>
          )}
        </div>

        <div className="table-items">
          {ads.slice(0, limit).map((item) => {
            const adCat =
              locale == "en"
                ? categoriesEn?.find((x) => x.id == item?.category)
                : categoriesAr?.find((x) => x.id == item?.category);
            const adSubCat =
              locale == "en"
                ? subcategoriesEn?.find((x) => x.id == item?.sub_category)
                : subcategoriesAr?.find((x) => x.id == item?.sub_category);
            const views = Math.floor(Math.random() * 5000) + 500;
            const purchases = Math.floor(views * 0.004);

            const possibleStatuses = ["pending", "active", "sold", "paused"];
            item.status =
              possibleStatuses[
                Math.floor(Math.random() * possibleStatuses.length)
              ];
            return (
              <div key={item?.id} className="table-item">
                <div className="holder">
                  <Link href={`/`} className="item-image">
                    <Image
                      src={item?.images[0]}
                      alt={item?.name}
                      fill
                      className="product-image"
                    />
                  </Link>

                  <div className="item-details">
                    <Link href={`/market/${item?.id}`} className="item-name">
                      {item?.title}
                    </Link>
                    <div className="item-location nisted">
                      <Link
                        href={`/market?gov=${item?.area?.governorate?.id}`}
                        className="link"
                      >
                        {item?.area?.governorate?.[locale]} /
                      </Link>

                      <Link
                        href={`/market?city=${item?.area?.city?.id}`}
                        className="link"
                      >
                        {item?.area?.city[locale]}
                      </Link>
                    </div>
                  </div>
                </div>

                {screenSize === "small" || screenSize === "ultra-small" ? (
                  <>
                    <div className="item-categories nisted">
                      <Link href={`/market?cat=${adCat?.id}`} className="link">
                        {adCat?.name} /
                      </Link>

                      <Link
                        href={`/market?subcat=${adSubCat?.id}`}
                        className="link"
                      >
                        {adSubCat?.name}
                      </Link>
                    </div>

                    <div className="item-price">
                      {formatEGP(item?.price, locale)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item-price">
                      {formatEGP(item?.price, locale)}
                    </div>

                    <div className="item-categories nisted">
                      <Link href={`/market?cat=${adCat?.id}`} className="link">
                        {adCat?.name} /
                      </Link>

                      <Link
                        href={`/market?subcat=${adSubCat?.id}`}
                        className="link"
                      >
                        {adSubCat?.name}
                      </Link>
                    </div>
                  </>
                )}

                <p className="date">
                  {formatRelativeDate(item?.creation_date, locale, "detailed")}
                </p>
                {page === "user" ? (
                  <div className="item-status">
                    {item.status === "pending" ? (
                      <span className="pending">{t.ad.status.pending}</span>
                    ) : (
                      <SelectOptions
                      size="ultra-small"
                        options={statusOptions.filter(
                          (s) => s.id !== "pending" // pending غير قابل للتفاعل
                        )}
                        value={
                          statusOptions.find((s) => s.id === item.status)
                            ?.name || ""
                        }
                        locale={locale}
                        t={t}
                        onChange={(selected) => {
                          // نحدث الحالة هنا
                          item.status = selected.id;
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="item-overview">
                    <h4>
                      {views} <FaEye />
                    </h4>
                    <h4 className="green">
                      {purchases} <BiSolidPurchaseTagAlt />
                    </h4>
                  </div>
                )}

                <div className="actions">
                  <Link href={`/market/${item?.id}`}>
                    <FaEye className="view" />
                  </Link>
                  <hr />
                  <Link
                    href={
                      page == "dashboard"
                        ? `/dashboard/ads/form?id=${item?.id}`
                        : `/mylisting/form/${item?.id}`
                    }
                  >
                    <MdEdit className="edit" />
                  </Link>

                  <hr />
                  <FaTrashAlt className="delete" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Pagination
        pageCount={50}
        screenSize={screenSize}
        onPageChange={() => {}}
        isDashBoard={true}
      />
    </div>
  );
}
