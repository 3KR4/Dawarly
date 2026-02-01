"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { formatEGP } from "@/utils/formatCurrency";

import Image from "next/image";
import "@/styles/dashboard/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";
import { FaRegWindowClose } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

import {
  ads,
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

export default function ActiveAds() {
  const { screenSize, locale } = useContext(settings);

  const t = useTranslate();
  const [adsState, setActiveAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      // try {
      //   const { data } = await getService.getActiveAds(6);
      //   setActiveAds(
      //     data || locale == "en" ? productsEn : productsAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setActiveAds(locale == "en" ? productsEn : productsAr);
      // }
      setActiveAds(ads);
    };
    fetchAds();
  }, []);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container pending-ads-tasble">
          <div className="table-header">
            {!screenSize.includes("small") && (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.ad_details}
                </div>
                <div className="header-item">{t.dashboard.forms.price}</div>
                <div className="header-item">{t.home.categories}</div>{" "}
                <div className="header-item">
                  {t.dashboard.tables.created_at}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            )}
          </div>

          <div className="table-items">
            {adsState.slice(0, 11).map((item) => {
              const adCat =
                locale == "en"
                  ? categoriesEn?.find((x) => x.id == item?.category)
                  : categoriesAr?.find((x) => x.id == item?.category);
              const adSubCat =
                locale == "en"
                  ? subcategoriesEn?.find((x) => x.id == item?.sub_category)
                  : subcategoriesAr?.find((x) => x.id == item?.sub_category);

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
                  </div>{" "}
                  <p className="date">
                    {formatRelativeDate(
                      item?.creation_date,
                      locale,
                      "detailed",
                    )}
                  </p>
                  <div className="actions">
                    <Link href={`/market/${item?.id}`}>
                      <FaEye className="view" />
                    </Link>
                    <hr />
                    <Link href={`/dashboard/ads/form?id=${item?.id}`}>
                      <MdEdit className="edit" />
                    </Link>
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
    </div>
  );
}
