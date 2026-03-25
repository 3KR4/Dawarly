"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { formatCurrency } from "@/utils/formatCurrency";

import Image from "next/image";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";

import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";

export default function AdsTable({ ads, page = "dashboard", limit = 11 }) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();
  const statusOptions = [
    { id: "PENDING", name: t.ad.status.PENDING },
    { id: "ACTIVE", name: t.ad.status.ACTIVE },
    { id: "SOLD", name: t.ad.status.SOLD },
    { id: "PAUSED", name: t.ad.status.PAUSED },
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
            return (
              <div key={item?.id} className="table-item">
                <div className="holder">
                  <Link href={`/`} className="item-image">
                    <Image
                      src={item?.image[0]?.secure_url}
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
                        href={`/market?gov=${item?.governorate?.id}`}
                        className="link"
                      >
                        {item?.governorate?.[`name_${locale}`]} /
                      </Link>

                      <Link
                        href={`/market?city=${item?.city?.id}`}
                        className="link"
                      >
                        {item?.city?.[`name_${locale}`]}
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
                      {formatCurrency(item?.price, "EGP", locale)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item-price">
                      {formatCurrency(
                        item?.rent_amount,
                        item?.rent_currency,
                        locale,
                      )}
                    </div>

                    <div className="item-categories nisted">
                      <Link
                        href={`/market?cat=${item?.Categories?.id}`}
                        className="link"
                      >
                        {item?.Categories?.[`name_${locale}`]} /
                      </Link>

                      <Link
                        href={`/market?subcat=${item?.SubCategories?.id}`}
                        className="link"
                      >
                        {item?.SubCategories?.[`name_${locale}`]}
                      </Link>
                    </div>
                  </>
                )}

                <p className="date">
                  {formatRelativeDate(item?.created_at, locale, "detailed")}
                </p>
                {page === "user" ? (
                  <div className="item-status">
                    {/* {item?.status === "PENDING" ? (
                      <span className="PENDING">{t.ad.status.PENDING}</span>
                    ) : (
                      <SelectOptions
                        size="ultra-small"
                        options={statusOptions.filter(
                          (s) => s.id !== "PENDING", // pending غير قابل للتفاعل
                        )}
                        value={
                          statusOptions.find((s) => s.id === item?.status)
                            ?.name || ""
                        }
                        locale={locale}
                        onChange={(selected) => {
                          // نحدث الحالة هنا
                          item?.status = selected?.id;
                        }}
                      />
                    )} */}
                  </div>
                ) : (
                  <div className="item-overview">
                    <h4>
                      {151} <FaEye />
                    </h4>
                    <h4 className="green">
                      {50505} <BiSolidPurchaseTagAlt />
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
