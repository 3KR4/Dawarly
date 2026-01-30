"use client";
import "@/styles/dashboard/side-nav.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslate from "@/Contexts/useTranslation";
import { AiFillProduct } from "react-icons/ai";
import { LuCalendarClock } from "react-icons/lu";
import { LuCalendarCheck } from "react-icons/lu";
import { LuGrid2X2Check } from "react-icons/lu";
import { settings } from "@/Contexts/settings";

import {
  FaUsers,
  FaHeadset,
  FaMoon,
  FaUser,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { FaChartSimple, FaFileContract } from "react-icons/fa6";
import { PiCardsFill } from "react-icons/pi";
import { IoMenu, IoLanguage } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { FiSun } from "react-icons/fi";

function SideNav() {
  const {
    theme,
    toggleTheme,
    locale,
    screenSize,
    toggleLocale,
    isNavOpen,
    setIsNavOpen,
    isMounted,
    setIsMounted,
  } = useContext(settings);
  const t = useTranslate();

  const pathname = usePathname();
  const isActive = (path) => {
    return (
      pathname === path || (path !== "/dashboard" && pathname.startsWith(path))
    );
  };

  const isAccordionActive = (accordionPath) => {
    return pathname.startsWith(accordionPath);
  };

  const [openAccordion, setOpenAccordion] = useState(null);
  const accordionRefs = useRef({});

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (!isMounted) return;

    if (pathname.startsWith("/dashboard/ads")) {
      setOpenAccordion("ads");
    } else if (pathname.startsWith("/dashboard/bookings")) {
      setOpenAccordion("bookings");
    } else {
      setOpenAccordion(null);
    }
  }, [pathname, isMounted]);

  if (isNavOpen === null || !isMounted) return null;

  return (
    <div className={`side-nav ${isNavOpen ? "active" : ""}`}>
      <ul>
        {/* Toggle */}
        <li
          className="actions-btns"
          onClick={() => {
            setIsNavOpen((prev) => (screenSize !== "large" ? false : !prev));
          }}
        >
          <h4>{t.sideNav.menuRoutes}</h4>
          {screenSize !== "large" ? (
            locale === "en" ? (
              <FaAngleLeft />
            ) : (
              <FaAngleRight />
            )
          ) : isNavOpen ? (
            locale === "en" ? (
              <FaAngleLeft />
            ) : (
              <FaAngleRight />
            )
          ) : (
            <IoMenu style={{ fontSize: "25px" }} />
          )}
        </li>

        {/* Overview */}
        <Link
          href="/dashboard"
          className={isActive("/dashboard") ? "active a" : "a"}
        >
          <div className="hold">
            <h4>{t.sideNav.overview}</h4>
            <FaChartSimple />
          </div>
        </Link>

        {/* Slides */}
        <Link
          href="/dashboard/slieds"
          className={isActive("/dashboard/slieds") ? "active a" : "a"}
        >
          <div className="hold">
            <h4>{t.sideNav.slides}</h4>
            <PiCardsFill />
          </div>
        </Link>

        {/* Users */}
        <Link
          href="/dashboard/users"
          className={isActive("/dashboard/users") ? "active a" : "a"}
        >
          <div className="hold">
            <h4>{t.sideNav.users}</h4>
            <FaUsers />
          </div>
        </Link>

        {/* Ads */}
        <div
          className={`a ${
            isAccordionActive("/dashboard/ads") ? "active" : ""
          } ${openAccordion === "ads" ? "active" : ""}`}
          onClick={() => toggleAccordion("ads")}
        >
          <div className="hold">
            <h4>{t.sideNav.ads}</h4>
            <AiFillProduct />
          </div>

          <div
            ref={(el) => (accordionRefs.current.ads = el)}
            className="according"
            style={{
              height:
                openAccordion === "ads"
                  ? `${accordionRefs.current.ads?.scrollHeight || 100}px`
                  : "0px",
            }}
          >
            <Link
              href="/dashboard/ads/active"
              className={isActive("/dashboard/ads/active") ? "active a" : "a"}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hold">
                <h4>{t.sideNav.activeAds}</h4>
                <LuGrid2X2Check />
              </div>
            </Link>
            <Link
              href="/dashboard/ads/pending"
              className={isActive("/dashboard/ads/pending") ? "active a" : "a"}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hold">
                <h4>{t.sideNav.pendingAds}</h4>
                <LuCalendarClock />
              </div>
            </Link>
          </div>
        </div>

        {/* Bookings */}
        <div
          className={`a ${
            isAccordionActive("/dashboard/bookings") ? "active" : ""
          } ${openAccordion === "bookings" ? "active" : ""}`}
          onClick={() => toggleAccordion("bookings")}
        >
          <div className="hold">
            <h4>{t.sideNav.bookings}</h4>
            <FaFileContract />
          </div>

          <div
            ref={(el) => (accordionRefs.current.bookings = el)}
            className="according"
            style={{
              height:
                openAccordion === "bookings"
                  ? `${accordionRefs.current.bookings?.scrollHeight || 100}px`
                  : "0px",
            }}
          >
            <Link
              href="/dashboard/bookings/active"
              className={
                isActive("/dashboard/bookings/active") ? "active a" : "a"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hold">
                <h4>{t.sideNav.activeBookings}</h4>
                <LuCalendarCheck />
              </div>
            </Link>

            <Link
              href="/dashboard/bookings/pending"
              className={
                isActive("/dashboard/bookings/pending") ? "active a" : "a"
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hold">
                <h4>{t.sideNav.pendingBookings}</h4>
                <LuCalendarClock />
              </div>
            </Link>
          </div>
        </div>

        {/* Support */}
        <Link
          href="/dashboard/support"
          className={isActive("/dashboard/support") ? "active a" : "a"}
        >
          <div className="hold">
            <h4>{t.sideNav.support}</h4>
            <FaHeadset />
          </div>
        </Link>
      </ul>

      {/* Bottom actions */}
      <ul>
        <div className="a a-user">
          <div className="hold">
            <h4>Mahmoud Elshazly</h4>
            <FaUser />
          </div>
        </div>

        <div className="a" onClick={toggleTheme}>
          <div className="hold">
            <h4>
              {theme === "light" ? t.actions.darkMode : t.actions.lightMode}
            </h4>
            {theme === "light" ? <FaMoon /> : <FiSun />}
          </div>
        </div>

        <div className="a" onClick={toggleLocale}>
          <div className="hold">
            <h4>{t.actions.lang}</h4>
            <IoLanguage />
          </div>
        </div>

        <div className="a danger">
          <div className="hold">
            <h4>{t.sideNav.logout}</h4>
            <MdLogout />
          </div>
        </div>
      </ul>
    </div>
  );
}

export default SideNav;
