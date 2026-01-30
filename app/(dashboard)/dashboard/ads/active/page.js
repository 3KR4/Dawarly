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

import {
  ads,
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { settings } from "@/Contexts/settings";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import AdsTable from "@/components/dashboard/AdsTable";

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
      <AdsTable ads={adsState} />
    </div>
  );
}
