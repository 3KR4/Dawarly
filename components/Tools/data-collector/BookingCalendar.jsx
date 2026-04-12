"use client";

import { useState, useMemo, useContext } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { settings } from "@/Contexts/settings";
import { ar, enUS } from "date-fns/locale";

export default function BookingRange({ data }) {
  const { locale } = useContext(settings);

  // =========================
  // FORMAT RANGE STATE
  // =========================
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // =========================
  // ALLOWED RANGE (FROM API)
  // =========================
  const allowed_range = useMemo(() => {
    return {
      start: data?.available_from ? new Date(data.available_from) : new Date(),
      end: data?.available_to
        ? new Date(data.available_to)
        : addDays(new Date(), 30),
    };
  }, [data]);

  // =========================
  // DISABLED DATES (BOOKINGS)
  // =========================
  const disabledDates = useMemo(() => {
    if (!data?.Booking) return [];

    const dates = [];

    data.Booking.forEach((b) => {
      if (b.status === "CANCELLED") return;

      let current = new Date(b.from_date);
      const end = new Date(b.to_date);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    return dates;
  }, [data]);

  // =========================
  // LOCALES
  // =========================
  const localesMap = {
    ar: ar,
    en: enUS,
  };

  const isSameDay = (d1, d2) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const formatShortDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };
  const hasSelected = range[0].startDate !== range[0].endDate;
  return (
    <div className="booking-range">
      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={allowed_range.start}
        maxDate={allowed_range.end}
        disabledDates={disabledDates}
        rangeColors={["#7c5cff"]}
        locale={localesMap[locale]}
        showSelectionPreview={false}
        moveRangeOnFirstSelection={false}
      />

      <button className="main-button" disabled={!hasSelected}>
        {!hasSelected ? (
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
