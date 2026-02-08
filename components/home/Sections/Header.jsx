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
import {
  categoriesEn,
  categoriesAr,
  subcategoriesEn,
  subcategoriesAr,
} from "@/data";
import { LuMessageSquare } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import useTranslate from "@/Contexts/useTranslation";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";
import useClickOutside from "@/Contexts/useClickOutside";
import { getAllSubCats } from "@/services/subCategories/subCats.service";
import { ImPower } from "react-icons/im";

function Header() {
  const t = useTranslate();
  const pathname = usePathname();
  const { screenSize, theme, toggleTheme, locale, toggleLocale } =
    useContext(settings);

  // useEffect(() => {
  //   setActiveMenu(null);
  // }, [pathname]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [dawaarlySubCat, setDawaarlySubCat] = useState([]);
  useEffect(() => {
    setDawaarlySubCat(locale == "en" ? subcategoriesEn : subcategoriesAr);

    const fetchCategories = async () => {
      // try {
      //   const { data } = await getService.getDynamicFilters(6);
      //   setDynamicFilters(
      //     data || locale == "en" ? propertiesFiltersEn : propertiesFiltersAr
      //   );
      // } catch (err) {
      //   console.error("Failed to fetch governorates:", err);
      //   setDynamicFilters(locale == "en" ? propertiesFiltersEn : propertiesFiltersAr);
      // }
      setCategories(locale == "en" ? categoriesEn : categoriesAr);

      getAllSubCats(locale)
        .then((res) => setSubcategories(res.data.data))
        .catch(console.error);
    };
    fetchCategories();
  }, [locale]);

  console.log(dawaarlySubCat);

  const [isLogin, setIsLogin] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSmallMenu, setActiveSmallMenu] = useState(false);
  const [activeSubCat, setActiveSubCat] = useState(0);
  const menuRef = useRef(null);
  const menuRef2 = useRef(null);
  useClickOutside(menuRef, () => setActiveMenu(false));
  useClickOutside(menuRef2, () => setActiveSmallMenu(false));

  const searchInputRef = useRef(null);

  // let firstCategories = [];
  // let secondCategories = [];

  // if (screenSize === "large") {
  //   firstCategories = categories.slice(0, 4);
  //   secondCategories = categories.slice(4, 12);
  // } else if (screenSize === "med") {
  //   firstCategories = categories.slice(0, 2);
  //   secondCategories = categories.slice(2, 12);
  // } else {
  //   // small
  //   firstCategories = categories;
  //   secondCategories = [];
  // }

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
              {isLogin ? (
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
                      <Image src={`/user-logo.jpg`} fill alt="user-image" />
                      {screenSize == "large" ? (
                        <>
                          <h4 className="ellipsis">mahmoud elshazly</h4>{" "}
                          <FaAngleDown />
                        </>
                      ) : (
                        <FaAngleDown className="small-drop-down" />
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
                            <Link href={`/account`} className="btn">
                              <FaRegUser />
                              {t.actions.accountSettings}
                            </Link>
                          </li>
                          <li>
                            <Link href={`/createAd`} className="btn">
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
                              onClick={() => setIsLogin(false)}
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
                  <Link
                    className="main-button login-in"
                    href={`/register`}
                    onClick={() => setIsLogin(true)}
                  >
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
                <div
                  className="cat-item"
                  onMouseEnter={
                    !screenSize.includes("small")
                      ? () => openMenu("dawaarly-exclusive")
                      : undefined
                  }
                  onMouseLeave={
                    !screenSize.includes("small") ? closeMenu : undefined
                  }
                >
                  <Link
                    href={""}
                    onClick={(e) => {
                      if (screenSize !== "large") {
                        e.preventDefault();
                        toggleMenu("dawaarly-exclusive");
                      }
                    }}
                  >
                    <ImPower />
                    {"dawaarly-exclusive"}
                    <FaAngleDown />
                  </Link>

                  {activeSubCat === `dawaarly-exclusive` && (
                    <div
                      className="menu active"
                      onMouseEnter={
                        !screenSize.includes("small")
                          ? () => openMenu(`dawaarly-exclusive`)
                          : undefined
                      }
                      onMouseLeave={
                        !screenSize.includes("small") ? closeMenu : undefined
                      }
                    >
                      <div className="sub-cats">
                        {/* ترتيب يدوي حسب المطلوب */}
                        {dawaarlySubCat?.map((x) => (
                          <Link key={x.id} href={`/market?subcat=${x.id}`}>
                            {x.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {categories?.slice(2, 4)?.map((cat) => {
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
                        {cat?.name}
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
                            {subcategories
                              .filter((x) => x.categoryName == cat?.id)
                              .map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/market?subcat=${sub.id}`}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* {!screenSize.includes("small") && (
                  <div
                    key={50}
                    className="cat-item"
                    onMouseEnter={
                      !screenSize.includes("small")
                        ? () => openMenu("other")
                        : undefined
                    }
                    onMouseLeave={
                      !screenSize.includes("small") ? closeMenu : undefined
                    }
                  >
                    <Link
                      href={`/`}
                      onClick={(e) => {
                        if (screenSize !== "large") {
                          e.preventDefault();
                          toggleMenu("other");
                        }
                      }}
                    >
                      {t.header.other}
                      <FaAngleDown />
                    </Link>

                    {activeMenu === "sub-cats" && activeSubCat === "other" && (
                      <div
                        className="menu active"
                        onMouseEnter={
                          !screenSize.includes("small")
                            ? () => openMenu("other")
                            : undefined
                        }
                        onMouseLeave={
                          !screenSize.includes("small") ? closeMenu : undefined
                        }
                      >
                        <div className="sub-cats">
                          {secondCategories.map((otherCat) => (
                            <Link
                              key={otherCat?.id}
                              href={`/market${
                                !screenSize.includes("small")
                                  ? `?cat=${otherCat?.id}`
                                  : ""
                              }`}
                              onClick={() => {
                                if (screenSize !== "large") closeMenu();
                              }}
                            >
                              {otherCat?.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )} */}
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
