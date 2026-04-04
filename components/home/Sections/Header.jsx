"use client";
import "@/styles/client/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMessage, FaAngleDown } from "react-icons/fa6";
import { settings } from "@/Contexts/settings";
import {
  FaSearch,
  FaRegHeart,
  FaMoon,
  FaHeart,
  FaRegMoon,
  FaRegUser,
  FaListUl,
  FaUser,
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { usePathname } from "next/navigation";
import { LuMessageSquare } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import useTranslate from "@/Contexts/useTranslation";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";
import useClickOutside from "@/Contexts/useClickOutside";
import { ImPower } from "react-icons/im";
import { useAuth } from "@/Contexts/AuthContext";
import { useAppData } from "@/Contexts/DataContext";

function Header() {
  const t = useTranslate();
  const pathname = usePathname();
  const { screenSize, theme, toggleTheme, locale, toggleLocale } =
    useContext(settings);
  const { categories, subCategories } = useAppData();

  const { user, isAuthenticated, loading, logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState("");
  const [activeSmallMenu, setActiveSmallMenu] = useState(false);
  const [activeSubCat, setActiveSubCat] = useState(0);
  const menuRef = useRef(null);
  const menuRef2 = useRef(null);
  useClickOutside(menuRef, () => setActiveMenu(false));
  useClickOutside(menuRef2, () => setActiveSmallMenu(false));

  const searchInputRef = useRef(null);

  const openMenu = (id) => {
    setActiveMenu("sub-cats");
    setActiveSubCat(id);
  };

  const closeMenu = () => {
    setActiveMenu(null);
    setActiveSubCat(null);
  };

  const toggleMenu = (id) => {
    if (activeSubCat === id) {
      closeMenu();
    } else {
      openMenu(id);
    }
  };
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`${scrolled ? "border" : ""}`}>
        <div className="container">
          <div className="top">
            <Link href="/" className="logo">
              <Image src={`/logo3.png`} fill alt="Dawaarly" />
              {t.header.awaarly}
            </Link>
            <div className="search">
              <div
                className="search-holder"
                onClick={() => searchInputRef.current?.focus()}
              >
                {!screenSize.includes("small") && <FaSearch />}

                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t.placeholders.search}
                />
                <Link href={`/`}>
                  {!screenSize.includes("small") ? (
                    t.actions.search
                  ) : (
                    <FaSearch />
                  )}
                </Link>
              </div>
              <div className={`menu ${activeMenu == "search" ? "active" : ""}`}>
                <div className="result">result</div>
              </div>
            </div>
            <div className="account">
              {isAuthenticated ? (
                <>
                  {!screenSize.includes("small") && (
                    <>
                      <div className="icon-holder fav">
                        <FaRegHeart className="main" />
                        <FaHeart className="hover" />
                        <span>3</span>
                      </div>
                      <div className="icon-holder msg">
                        <LuMessageSquare className="main" />
                        <FaMessage className="hover" />
                        <span>6</span>
                      </div>
                      <hr />
                    </>
                  )}

                  <div className="user" ref={menuRef}>
                    <div
                      className="holder"
                      onClick={() =>
                        setActiveMenu((prev) => (prev == "user" ? "" : "user"))
                      }
                    >
                      {/* <Image src={`/user-logo.jpg`} fill alt="user-image" /> */}

                      {screenSize == "large" ? (
                        <>
                          <h4 className="ellipsis">
                            {loading
                              ? "Loading..."
                              : user?.full_name || "Guest"}
                          </h4>
                          <FaAngleDown />
                        </>
                      ) : (
                        <>
                          <div className="name-letters">
                            {user?.full_name
                              ?.split(" ")
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")}
                          </div>
                          <FaAngleDown className="small-drop-down" />
                        </>
                      )}
                    </div>
                    {activeMenu == "user" && (
                      <div
                        className={`menu ${
                          activeMenu == "user" ? "active" : ""
                        }`}
                      >
                        <ul className="user-menu">
                          <li>
                            <Link href={`/account/${user?.id}`} className="btn">
                              <FaRegUser />
                              {t.actions.accountSettings}
                            </Link>
                          </li>
                          <li>
                            <Link href={`/mylisting/createAd`} className="btn">
                              <MdPostAdd style={{ fontSize: "17px" }} />
                              {t.actions.postAd}
                            </Link>
                          </li>
                          <li>
                            <Link href={`/mylisting`} className="btn">
                              <FaListUl />
                              {t.actions.viewAdsListing}
                            </Link>
                          </li>

                          {screenSize.includes("small") && (
                            <>
                              <li>
                                <Link href={`/`} className="btn">
                                  <FaRegHeart />
                                  {t.actions.favorietList}
                                </Link>
                              </li>
                              <li>
                                <Link href={`/`} className="btn">
                                  <LuMessageSquare />
                                  {t.actions.adsChat}
                                </Link>
                              </li>
                              <li className="theme" onClick={toggleTheme}>
                                {theme === "light" ? (
                                  <Link href={`/`} className="btn">
                                    <FaRegMoon />
                                    {t.actions.darkMode}
                                  </Link>
                                ) : (
                                  <Link href={`/`} className="btn">
                                    <FiSun />
                                    {t.actions.lightMode}
                                  </Link>
                                )}
                              </li>
                              <li className="lang" onClick={toggleLocale}>
                                <Link href={`/`} className="btn">
                                  <GrLanguage />
                                  {t.actions.lang}
                                </Link>
                              </li>
                            </>
                          )}
                          <li>
                            <button
                              className="btn logout"
                              onClick={() => logout()}
                            >
                              <MdLogout />
                              {t.actions.logout}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link className="main-button login-in" href={`/register`}>
                    {!screenSize.includes("small") ? t.auth.login : <FaUser />}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <header>
        <div className="container">
          <div className="bottom">
            <div className="nav">
              {screenSize.includes("small") && (
                <h4 onClick={() => setActiveSmallMenu((prev) => !prev)}>
                  {t.header.filterByCategories} <FaAngleDown />
                </h4>
              )}
              <SelectLocation locale={locale} />

              <div
                className={`cats-nav ${activeSmallMenu ? "active" : ""}`}
                ref={menuRef2}
              >
                {categories?.map((cat) => {
                  const isActive = activeSubCat === cat?.id;
                  const Icon = cat?.icon;

                  return (
                    <div
                      key={cat?.id}
                      className="cat-item"
                      onMouseEnter={
                        !screenSize.includes("small")
                          ? () => openMenu(cat?.id)
                          : undefined
                      }
                      onMouseLeave={
                        !screenSize.includes("small") ? closeMenu : undefined
                      }
                    >
                      <Link
                        href={`/market${
                          !screenSize.includes("small") ? `?cat=${cat?.id}` : ""
                        }`}
                        onClick={(e) => {
                          if (screenSize !== "large") {
                            e.preventDefault();
                            toggleMenu(cat?.id);
                          }
                        }}
                      >
                        {Icon ? <Icon /> : null}
                        {cat?.[`name_${locale}`]}
                        <FaAngleDown />
                      </Link>

                      {isActive && (
                        <div
                          className="menu active"
                          onMouseEnter={
                            !screenSize.includes("small")
                              ? () => openMenu(cat?.id)
                              : undefined
                          }
                          onMouseLeave={
                            !screenSize.includes("small")
                              ? closeMenu
                              : undefined
                          }
                        >
                          <div className="sub-cats">
                            {subCategories
                              .filter((x) => x.category_id == cat?.id)
                              .map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/market?subcat=${sub.id}`}
                                >
                                  {sub?.[`name_${locale}`]}
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {!screenSize.includes("small") && (
              <div className="actions">
                <button className="theme" onClick={toggleTheme}>
                  {theme === "light" ? (
                    <>
                      <FaMoon />
                      <span>{t.actions.darkMode}</span>
                    </>
                  ) : (
                    <>
                      <FiSun />
                      <span>{t.actions.lightMode}</span>
                    </>
                  )}
                </button>
                <button className="lang" onClick={toggleLocale}>
                  <GrLanguage />
                  <span>{t.actions.lang}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
