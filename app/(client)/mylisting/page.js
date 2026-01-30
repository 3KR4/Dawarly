"use client";
import useTranslate from "@/Contexts/useTranslation";
import "@/styles/dashboard/tables.css";
import "@/styles/dashboard/globals.css";
import "@/styles/client/forms.css";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";

import {
  ads,
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { settings } from "@/Contexts/settings";
import AdsTable from "@/components/dashboard/AdsTable";
import SelectOptions from "@/components/Tools/data-collector/SelectOptions";

export default function MyAdsListing() {
  const { locale } = useContext(settings);
  const t = useTranslate();

  // كل الإعلانات
  const [allAds, setAllAds] = useState([]);

  // الإعلانات المعروضة
  const [adsState, setAdsState] = useState([]);

  // الستاتس المختار
  const [selectedStatus, setSelectedStatus] = useState(null);

  // fetch ads (مؤقت من الداتا)
  useEffect(() => {
    const fetchAds = async () => {
      setAllAds(ads);
      setAdsState(ads);
    };
    fetchAds();
  }, []);

  // options بتاعة الستاتس (pending غير قابل للاختيار)
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
    <div className="dash-holder for-client">
      {/* Top filters */}
      <div className="top fluid-container">
        <SelectOptions
          placeholder={t.ad.status.label}
          options={statusOptions}
          value={selectedStatus}
          locale={locale}
          t={t}
          onChange={handleStatusChange}
        />

        <Link
          href="/createAd"
          className="main-button"
          style={{ height: "35px" }}
        >
          {t.ad.create_ad}
        </Link>
      </div>

      {/* Ads table */}
      <AdsTable ads={adsState} page="user" limit={4} />
    </div>
  );
}
