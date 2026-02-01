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

import { sliedsAr, slidesEn, slidesAr } from "@/data";
import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";

export default function Slieds() {
  const { screenSize, locale } = useContext(settings);

  const t = useTranslate();
  const [slieds, setSlieds] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      // try {
      //   const { data } = await getService.getSlieds(6);
      //   setSlieds(
      //     data || locale == "en" ? sliedsEn : sliedsAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setSlieds(locale == "en" ? sliedsEn : sliedsAr);
      // }
      setSlieds(locale == "en" ? slidesEn : slidesAr);
    };
    fetchSlides();
  }, [locale]);

  return (
    <div className="dash-holder">
      <div className="body">
        <div className="table-container slieds-tasble">
          <div className="table-header">
            {!screenSize.includes("small") && (
              <>
                <div className="header-item details">
                  {t.dashboard.tables.slide_details}
                </div>
                <div className="header-item">{t.dashboard.tables.link}</div>
                <div className="header-item">
                  {t.dashboard.tables.created_at}
                </div>
                <div className="header-item">{t.dashboard.tables.actions}</div>
              </>
            )}
          </div>

          <div className="table-items">
            {slieds.slice(0, 11).map((item) => {
              return (
                <div key={item?.id} className="table-item">
                  <div className="holder">
                    <Link href={`/`} className="item-image">
                      <Image
                        src={item?.image}
                        alt={item?.title}
                        fill
                        className="product-image"
                      />
                    </Link>
                    <div className="item-details">
                      <h4 className="item-name">{item?.title}</h4>
                      <p>{item?.description}</p>
                    </div>
                  </div>
                  <Link href={item?.link} className="item-link">
                    {item?.link}
                  </Link>{" "}
                  <p className="date">
                    {formatRelativeDate(
                      item?.creation_date,
                      locale,
                      "detailed",
                    )}
                  </p>
                  <div className="actions">
                    <Link href={`/dashboard/ads/form?id=${item?.id}`}>
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
    </div>
  );
}
