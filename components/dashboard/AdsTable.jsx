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
import { useNotification } from "@/Contexts/NotificationContext";
import { deleteAd } from "@/services/ads/ads.service";
import { TbListSearch } from "react-icons/tb";
import { AdStatuses, RentFrequencies } from "@/data/enums";

export default function AdsTable({
  ads,
  loadingContent,
  activeAds,
  removeAd,
  changeStatus,
  page = "dashboard",
}) {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();
  const { addNotification } = useNotification();

  return (
    <div className={`body ${page == "user" ? "fluid-container for-user" : ""}`}>
      <div
        className={`table-container products ${!activeAds ? "pending-ads" : ""}`}
      >
        <div className="table-header">
          {!screenSize.includes("small") && (
            <>
              <div className="header-item details">
                {t.dashboard.tables.ad_details}
              </div>
              <div className="header-item">{t.ad.rentPrice}</div>
              {!activeAds && (
                <div className="header-item">{t.ad.deposit_amount}</div>
              )}

              <div className="header-item">{t.home.categories}</div>
              <div className="header-item">
                {activeAds
                  ? t.dashboard.tables.created_at
                  : t.dashboard.tables.published_at}
              </div>
              <div className="header-item">{t.dashboard.tables.status}</div>

              {activeAds && (
                <>
                  <div className="header-item">{t.dashboard.tables.reach}</div>
                </>
              )}

              <div className="header-item">{t.dashboard.tables.actions}</div>
            </>
          )}
        </div>

        <div
          className="table-items"
          style={{
            position: "relative",
            opacity: loadingContent ? "0.6" : "1",
          }}
        >
          {loadingContent && (
            <div className="loading-content">
              <span
                className="loader"
                style={{ opacity: loadingContent ? "1" : "0" }}
              ></span>
            </div>
          )}
          {!ads.length && !loadingContent ? (
            <div className="no-data-found">
              <TbListSearch />
              <p>{activeAds ? "no data found" : "no more pending ads"} </p>
            </div>
          ) : (
            ads?.map((item) => (
              <div key={item?.id} className={`table-item ${item?.status}`}>
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

                    <div className="item-price" style={{ lineHeight: `1.3` }}>
                      {formatCurrency(
                        item?.rent_amount,
                        item?.rent_currency,
                        locale,
                      )}
                    </div>
                    {!activeAds && (
                      <div className="item-price" style={{ lineHeight: `1.3` }}>
                        {formatCurrency(
                          item?.deposit_amount,
                          item?.rent_currency,
                          locale,
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="item-price" style={{ lineHeight: `1.3` }}>
                      {formatCurrency(
                        item?.rent_amount,
                        item?.rent_currency,
                        locale,
                      )}{" "}
                      {
                        RentFrequencies?.find(
                          (x) => x.id == item?.rent_frequency,
                        )?.[`name_${locale}`]
                      }
                    </div>
                    {!activeAds && (
                      <div className="item-price" style={{ lineHeight: `1.3` }}>
                        {formatCurrency(
                          item?.deposit_amount,
                          item?.rent_currency,
                          locale,
                        )}
                      </div>
                    )}

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
                {activeAds && (
                  <div className="item-overview onlyOne">
                    <h4
                      style={{
                        background: AdStatuses.find((x) => x.id == item?.status)
                          ?.bg,
                        color: AdStatuses.find((x) => x.id == item?.status)?.tx,
                      }}
                    >
                      {item?.status}
                    </h4>
                  </div>
                )}
                {page === "user" || !activeAds ? (
                  <div className="item-status">
                    <SelectOptions
                      size="ultra-small"
                      options={[
                        {
                          id: "ACTIVE",
                          name_en: "Active",
                          name_ar: "نشط",
                          bg: "#E6F9F0",
                          tx: "#0F9D58",
                        },
                        {
                          id: "REJECTED",
                          name_en: "Rejected",
                          name_ar: "مرفوض",
                          bg: "#FDECEA",
                          tx: "#D93025",
                        },
                      ]}
                      value={
                        AdStatuses.find((s) => s.id === item?.status)?.[
                          `name_${locale}`
                        ] || {
                          id: "PENDING",
                          name_en: "Pending",
                          name_ar: "قيد المراجعة",
                          bg: "#FFF4E5",
                          tx: "#F59E0B",
                        }
                      }
                      locale={locale}
                      onChange={(selected) => changeStatus(item.id, selected)}
                    />
                  </div>
                ) : (
                  activeAds && (
                    <div className="item-overview">
                      <h4>
                        {151} <FaEye />
                      </h4>
                      <h4 className="green">
                        {50505} <BiSolidPurchaseTagAlt />
                      </h4>
                    </div>
                  )
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
                  <FaTrashAlt
                    className="delete"
                    onClick={() => removeAd(item?.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
