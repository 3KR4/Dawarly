"use client";

import { useState, useContext } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { settings } from "@/Contexts/settings";
import { ar, enUS } from "date-fns/locale";
export default function BookingRange({ disabledDates = [] }) {
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
  const isSameDay = (d1, d2) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const ALLOWED_RANGE = {
    start: new Date(2026, 0, 30), // فبراير = 1
    end: new Date(2026, 1, 26),
  };
  return (
    <div className="booking-range">
      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={ALLOWED_RANGE.start}
        maxDate={ALLOWED_RANGE.end}
        disabledDates={disabledDates}
        rangeColors={["#7c5cff"]}
        locale={localesMap[locale]}
        showSelectionPreview
        showPreview
      />

      <button className="main-button" disabled={!range[0].startDate}>
        {!range[0].startDate ? (
          locale === "ar" ? (
            "اختر تاريخ الحجز"
          ) : (
            "Select booking date"
          )
        ) : isSameDay(range[0].startDate, range[0].endDate) ? (
          <>
            {locale === "ar" ? "حجز يوم" : "Book for"}{" "}
            {formatShortDate(range[0].startDate)}
          </>
        ) : (
          <>
            {locale === "ar" ? "حجز من" : "Book from"}{" "}
            {formatShortDate(range[0].startDate)}{" "}
            {locale === "ar" ? "إلى" : "to"} {formatShortDate(range[0].endDate)}
          </>
        )}
      </button>
    </div>
  );
}
