"use client";
import "@/styles/client/header.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMessage, FaAngleDown } from "react-icons/fa6";
import { settings } from "@/Contexts/settings";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaSearch, FaRegHeart, FaMoon, FaHeart } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import governorates from "@/data/governorates.json";
import { usePathname } from "next/navigation";

import { categories, subcategories } from "@/data";
import { LuMessageSquare } from "react-icons/lu";

import useTranslate from "@/Contexts/useTranslation";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";
function Header() {
  const t = useTranslate();
  const pathname = usePathname();
  const { screenSize, theme, toggleTheme, locale, toggleLocale } =
    useContext(settings);

  // useEffect(() => {
  //   setActiveMenu(null);
  // }, [pathname]);

  const [activeMenu, setActiveMenu] = useState("");
  const [isLoactionsActive, setIsLoactionsActive] = useState(false);
  const [activeSubCat, setActiveSubCat] = useState();

  const searchInputRef = useRef(null);
  return (
    <header>
      <div className="container">
        <div className="top">
          <Link href="/" className="logo">
            <Image src={`/logo3.png`} fill alt="Dawarly" />
            {t.header.awarly}
          </Link>
          <div className="search">
            <div
              className="search-holder"
              onClick={() => searchInputRef.current?.focus()}
            >
              <FaSearch />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.placeholders.search}
              />
              <Link href={`/`}>{t.actions.search}</Link>
            </div>
            <div className={`menu ${activeMenu == "search" ? "active" : ""}`}>
              <div className="result">result</div>
            </div>
          </div>
          <div className="account">
            {true ? (
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

                <div className="user">
                  <div className="holder">
                    <Image src={`/user-logo.jpg`} fill alt="user-image" />
                    <h4 className="ellipsis">mahmoud elshazly</h4>
                    <FaAngleDown />
                  </div>
                  <div
                    className={`menu ${activeMenu == "user" ? "active" : ""}`}
                  >
                    <div className="user-nav"></div>user Nav
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link className="main-button login-in" href={`/auth`}>
                  login in
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bottom">
          <div className="nav">
            <SelectLocation locale={locale} />
            <div className="cats-nav">
              {categories.map((cat) => {
                const isActive = activeSubCat == cat.id;
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="cat-item"
                    onMouseEnter={() => {
                      setActiveMenu("sub-cats");
                      setActiveSubCat(cat.id);
                    }}
                    onMouseLeave={() => {
                      setActiveMenu(null);
                      setActiveSubCat(null);
                    }}
                  >
                    <Link href={`/${screenSize == "large" ? cat.id : ""}`}>
                      <Icon />
                      {locale === "en" ? cat.name.en : cat.name.ar}
                    </Link>

                    {isActive && activeMenu === "sub-cats" && (
                      <div
                        className="menu active"
                        onMouseEnter={() => {
                          setActiveMenu("sub-cats");
                          setActiveSubCat(cat.id);
                        }}
                        onMouseLeave={() => {
                          setActiveMenu(null);
                          setActiveSubCat(null);
                        }}
                      >
                        <div className="sub-cats">
                          {subcategories
                            .filter((x) => x.categoryId === cat.id)
                            .map((sub) => (
                              <Link
                                key={sub.id}
                                href={`${screenSize == "large" ? sub.id : ""}`}
                              >
                                {locale === "en" ? sub.name.en : sub.name.ar}
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
          <div className="actions">
            <button className="theme" onClick={toggleTheme}>
              {theme === "light" ? (
                <>
                  <FaMoon />
                  {t.actions.darkMode}
                </>
              ) : (
                <>
                  <FiSun />
                  {t.actions.lightMode}
                </>
              )}
            </button>
            <button className="lang" onClick={toggleLocale}>
              <GrLanguage />
              {t.actions.lang}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
