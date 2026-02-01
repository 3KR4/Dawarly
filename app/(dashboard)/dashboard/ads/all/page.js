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
import { IoSearchSharp } from "react-icons/io5";

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
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { LuSettings2 } from "react-icons/lu";

export default function ActiveAds() {
  const { screenSize, locale } = useContext(settings);
  const [allAds, setAllAds] = useState([]);

  const t = useTranslate();
  const [adsState, setAdsState] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      setAllAds(ads);
      setAdsState(ads);
    };
    fetchAds();
  }, []);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    { id: "active", name: t.ad.status.active },
    { id: "sold", name: t.ad.status.sold },
    { id: "paused", name: t.ad.status.paused },
  ];

  // تغيير الفلتر
  const handleStatusChange = (selected) => {
    setSelectedStatus(selected);

    if (!selected) {
      setAdsState(allAds);
      return;
    }

    const filteredAds = allAds.filter((ad) => ad.status === selected.id);

    setAdsState(filteredAds);
  };

  return (
    <div className="dash-holder">
      <div className="top">
        <div className="filters-header">
          {t.actions.filterations}
          <span className="filters-count" style={{ display: "flex" }}>
            <LuSettings2 />
          </span>
        </div>
        <SelectOptions
          size="small"
          placeholder={t.ad.status.label}
          options={statusOptions}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={handleStatusChange}
        />
        <div className="filters-header">
          <input type="text" placeholder={t.placeholders.search} />
          <span className="filters-count" style={{ display: "flex" }}>
            <IoSearchSharp />
          </span>
        </div>
      </div>
      <AdsTable ads={adsState} limit={10} />
    </div>
  );
}
