"use client";
import Rating from "@mui/material/Rating";
import Pagination from "@/components/Tools/Pagination";
import useTranslate from "@/Contexts/useTranslation";
import { formatCurrency } from "@/utils/formatCurrency";

import Image from "next/image";
import "@/styles/dashboard/tables.css";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import Link from "next/link";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { getAllAds } from "@/services/ads/ads.service";

import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";
import { LuSettings2 } from "react-icons/lu";

export default function ActiveAds() {
  const { screenSize, locale } = useContext(settings);
  const t = useTranslate();

  const [allAds, setAllAds] = useState([]);
  const [adsState, setAdsState] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState("");

  // ✅ fetch بدون أي فلتر دلوقتي
  const fetchAds = async () => {
    try {
      const res = await getAllAds({
        page: 1,
        limit: 10,
        search: null,
        status: null,
        category: null,
        subCategory: null,
        country_id: null,
        governorate_id: null,
        city_id: null,
        area_id: null,
        compound_id: null,
        min_rent_amount: null,
        max_rent_amount: null,
        rent_currency: null,
        rent_frequency: null,
        min_deposit_amount: null,
        max_deposit_amount: null,
        min_rent_period: null,
        max_rent_period: null,
        min_bedrooms: null,
        max_bedrooms: null,
        min_bathrooms: null,
        max_bathrooms: null,
        min_level: null,
        max_level: null,
        min_adult_no_max: null,
        max_adult_no_max: null,
        min_child_no_max: null,
        max_child_no_max: null,
        am_pool: null,
        am_balcony: null,
        am_private_garden: null,
        am_kitchen: null,
        am_ac: null,
        am_heating: null,
        am_elevator: null,
        am_gym: null,
        min_available_from: null,
        max_available_to: null,
      });

      setAllAds(res.data.data);
      setAdsState(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const statusOptions = [
    { id: "ACTIVE", name: t.ad.status.ACTIVE },
    { id: "SOLD", name: t.ad.status.SOLD },
    { id: "PAUSED", name: t.ad.status.PAUSED },
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

  // تغيير البحث
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value) {
      setAdsState(allAds);
      return;
    }

    const filteredAds = allAds.filter(
      (ad) =>
        ad.title.toLowerCase().includes(value.toLowerCase()) ||
        ad.description.toLowerCase().includes(value.toLowerCase())
    );

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
          <input
            type="text"
            placeholder={t.placeholders.search}
            value={searchText}
            onChange={handleSearchChange}
          />
          <span className="filters-count" style={{ display: "flex" }}>
            <IoSearchSharp />
          </span>
        </div>
      </div>

      <AdsTable ads={adsState} limit={10} />
    </div>
  );
}