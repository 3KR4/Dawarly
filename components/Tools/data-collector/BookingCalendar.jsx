"use client";

import { useState, useContext } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { settings } from "@/Contexts/settings";
import { ar, enUS } from "date-fns/locale";
export default function BookingRange({ bookedDates = [] }) {
  const { locale } = useContext(settings);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  // ===== Date Formatter (Short & Clean) =====
  const formatShortDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };
const localesMap = {
  ar: ar,
  en: enUS,
};
  return (
    <div className="booking-range">
      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={new Date()}
        disabledDates={bookedDates}
        rangeColors={["#7c5cff"]} // تقدر تربطها بـ CSS variable لو حابب
        direction="horizontal"
        locale={localesMap[locale]}
      />

      <button className="main-button">
        {locale === "ar" ? "حجز من" : "book from"}{" "}
        {formatShortDate(range[0]?.startDate)} {locale === "ar" ? "إلى" : "to"}{" "}
        {formatShortDate(range[0]?.endDate)}
      </button>
    </div>
  );
}
