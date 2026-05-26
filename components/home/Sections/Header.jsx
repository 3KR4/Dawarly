"use client";
import "@/styles/client/header.css";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { LuMessageSquare } from "react-icons/lu";
import { MdPostAdd } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import useTranslate from "@/Contexts/useTranslation";
import SelectLocation from "@/components/Tools/data-collector/selectLocation";
import useClickOutside from "@/Contexts/useClickOutside";
import { useAuth } from "@/Contexts/AuthContext";
import { useAppData } from "@/Contexts/DataContext";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { buildNavigation } from "@/utils/buildNavigation";
import { getHeaderSearch } from "@/services/search/search.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { PaymentMethod, RentFrequencies } from "@/data/enums";

function Header() {
  const t = useTranslate();
  const pathname = usePathname();
  const router = useRouter();
  const { screenSize, theme, toggleTheme, locale, toggleLocale } =
    useContext(settings);
  const { tables, categories, subCategories } = useAppData();

  const { user, isAuthenticated, loading, logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState("");
  const [activeSmallMenu, setActiveSmallMenu] = useState(false);
  const [activeSubCat, setActiveSubCat] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState({ ads: [], blogs: [] });
  const [searchTotals, setSearchTotals] = useState({ ads: 0, blogs: 0 });
  const [searchLoading, setSearchLoading] = useState(false);
  const menuRef = useRef(null);
  const menuRef2 = useRef(null);
  const searchRef = useRef(null);
  useClickOutside(menuRef, () => setActiveMenu(false));
  useClickOutside(menuRef2, () => setActiveSmallMenu(false));
  useClickOutside(searchRef, () => {
    if (activeMenu === "search") setActiveMenu("");
  });

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

  const nav = useMemo(() => {
    return buildNavigation(tables, categories, subCategories);
  }, [tables, categories, subCategories]);

  const searchValue = searchText.trim();
  const searchHref = searchValue
    ? `/market?s=${encodeURIComponent(searchValue)}`
    : "/market";
  const blogsSearchHref = searchValue
    ? `/blogs?search=${encodeURIComponent(searchValue)}`
    : "/blogs";

  const normalizeSearchPayload = useCallback((payload = {}) => {
    const data = payload.data || payload;
    const adsSource = data.ads?.data || data.ads?.items || data.ads || [];
    const blogsSource =
      data.blogs?.data || data.blogs?.items || data.blogs || [];

    return {
      ads: Array.isArray(adsSource) ? adsSource.slice(0, 4) : [],
      blogs: Array.isArray(blogsSource) ? blogsSource.slice(0, 4) : [],
      totals: {
        ads:
          data.totals?.ads ||
          data.adsTotal ||
          data.ads?.total ||
          data.ads?.pagination?.total ||
          adsSource.length ||
          0,
        blogs:
          data.totals?.blogs ||
          data.blogsTotal ||
          data.blogs?.total ||
          data.blogs?.pagination?.total ||
          blogsSource.length ||
          0,
      },
    };
  }, []);

  useEffect(() => {
    if (searchValue.length <= 2) {
      setSearchResults({ ads: [], blogs: [] });
      setSearchTotals({ ads: 0, blogs: 0 });
      setSearchLoading(false);
      return;
    }

    setActiveMenu("search");
    setSearchLoading(true);

    const controller = new AbortController();
    let canceled = false;

    const timeout = setTimeout(async () => {
      try {
        const res = await getHeaderSearch(searchValue, 4, controller.signal);
        if (canceled) return;
        const { ads, blogs, totals } = normalizeSearchPayload(res.data);
        setSearchResults({ ads, blogs });
        setSearchTotals(totals);
      } catch (err) {
        if (
          !canceled &&
          err.name !== "CanceledError" &&
          err.code !== "ERR_CANCELED"
        ) {
          setSearchResults({ ads: [], blogs: [] });
          setSearchTotals({ ads: 0, blogs: 0 });
        }
      } finally {
        if (!canceled) setSearchLoading(false);
      }
    }, 250);

    return () => {
      canceled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [normalizeSearchPayload, searchValue]);

  const goToSearch = (e) => {
    e?.preventDefault();
    if (!searchValue || searchLoading) return;

    const hasAds = searchTotals.ads > 0 || searchResults.ads.length > 0;
    const hasBlogs = searchTotals.blogs > 0 || searchResults.blogs.length > 0;

    if (!hasAds && !hasBlogs) return;

    setSearchText("");
    searchInputRef.current?.blur();
    setActiveMenu("");
    router.push(hasAds ? searchHref : blogsSearchHref);
  };

  const goToSearchSection = (href) => {
    setSearchText("");
    searchInputRef.current?.blur();
    setActiveMenu("");
    router.push(href);
  };

  const getLocalizedName = (item) =>
    item?.[`name_${locale}`] || item?.name || item?.name_en || item?.name_ar;

  const getAdMeta = (ad) => {
    const category =
      ad.category ||
      ad.Categories ||
      categories.find((category) => category.id == ad.category_id);
    const department =
      ad.department ||
      ad.table ||
      tables.find((table) => table.id == (ad.table_id || category?.table_id));
    const rentFrequency = RentFrequencies.find(
      (item) => item.id == ad.rent_frequency,
    );
    const paymentMethod = PaymentMethod.find(
      (item) => item.id == ad.payment_method,
    );

    return {
      category: getLocalizedName(category),
      department: getLocalizedName(department),
      price: formatCurrency(ad.price, ad.currency || "EGP", locale),
      dealType:
        rentFrequency?.[`name_${locale}`] ||
        paymentMethod?.[`name_${locale}`] ||
        ad.rent_frequency ||
        ad.payment_method,
    };
  };

  const marketHref = ({ dep, cat, subcat } = {}) => {
    const params = new URLSearchParams();
    if (dep) params.set("dep", dep);
    if (cat) params.set("cat", cat);
    if (subcat) params.set("subcat", subcat);
    const query = params.toString();
    return query ? `/market?${query}` : "/market";
  };

  const getNodeHref = (node) => {
    if (!node) return marketHref();

    if (node.table_id && node.category_id) {
      return marketHref({
        dep: node.table_id,
        cat: node.category_id,
      });
    }

    if (node.table_id) {
      return marketHref({ dep: node.table_id });
    }

    if (node.children?.length) {
      return getNodeHref(node.children[0]);
    }

    return marketHref();
  };

  const handleLocationSelect = ({ governorate, city, area, compound }) => {
    const params = new URLSearchParams();
    if (governorate?.id) params.set("governorate_id", governorate.id);
    if (city?.id) params.set("city_id", city.id);
    if (area?.id) params.set("area_id", area.id);
    if (compound?.id) params.set("compound_id", compound.id);
    router.push(`/market?${params.toString()}`);
  };

  return (
    <>
      <header className={`${scrolled ? "border" : ""}`}>
        <div className="container">
          <div className="top">
            <Link href="/" className="logo">
              <Image src={`/logo.png`} fill alt="Dawaarly" />
              <span dir="ltr">awaarly</span>
            </Link>
            <div className="search" ref={searchRef}>
              <div
                className="search-holder"
                onClick={() => searchInputRef.current?.focus()}
              >
                {!screenSize.includes("small") && <FaSearch />}

                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t.placeholders.search}
                  value={searchText}
                  onFocus={() => {
                    if (searchValue.length > 2) setActiveMenu("search");
                  }}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setSearchText(nextValue);
                    if (nextValue.trim().length > 2) {
                      setActiveMenu("search");
                      setSearchLoading(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goToSearch(e);
                  }}
                />
                <Link href={searchHref} onClick={goToSearch}>
                  {!screenSize.includes("small") ? (
                    t.actions.search
                  ) : (
                    <FaSearch />
                  )}
                </Link>
              </div>
              <div
                className={`menu ${
                  activeMenu == "search" || searchText ? "active" : ""
                }`}
              >
                <div className="search-results">
                  {searchLoading && (
                    <div className="search-state">
                      {locale === "ar" ? "جاري البحث..." : "Searching..."}
                    </div>
                  )}

                  {!searchLoading && searchValue.length <= 2 && (
                    <div className="search-state">
                      {locale === "ar"
                        ? "اكتب 3 حروف على الأقل"
                        : "Type at least 3 characters"}
                    </div>
                  )}

                  {!searchLoading &&
                    searchValue.length > 2 &&
                    !searchResults.ads.length &&
                    !searchResults.blogs.length && (
                      <div className="search-state">
                        {locale === "ar" ? "لا توجد نتائج" : "No results found"}
                      </div>
                    )}

                  {!searchLoading && searchResults.ads.length > 0 && (
                    <div className="search-group">
                      <div className="top">
                        <h5>
                          {locale === "ar" ? "نتائج الإعلانات" : "Ads Result"}
                        </h5>
                        {searchTotals.ads > searchResults.ads.length && (
                          <button
                            type="button"
                            className="see-more-results"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => goToSearchSection(searchHref)}
                          >
                            {locale === "ar"
                              ? "عرض مزيد من الإعلانات"
                              : "See more ads"}
                          </button>
                        )}
                      </div>
                      {searchResults.ads.map((ad) => {
                        const meta = getAdMeta(ad);
                        const adHref = `/market/${ad.id}?dep=${ad.table_id || ad.department?.id || ad.table?.id || ""}`;

                        return (
                          <Link
                            key={`ad-${ad.id}`}
                            href={adHref}
                            className="search-result-item"
                          >
                            <span className="search-result-title">
                              {ad.title ||
                                ad.title_en ||
                                ad.title_ar ||
                                (locale === "ar" ? "إعلان" : "Ad")}
                            </span>
                            <span className="search-result-meta">
                              {[meta.department, meta.category]
                                .filter(Boolean)
                                .join(" / ")}
                            </span>
                            <span className="search-result-price">
                              {meta.price}
                              {meta.dealType ? ` / ${meta.dealType}` : ""}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {!searchLoading && searchResults.blogs.length > 0 && (
                    <div className="search-group">
                      <div className="top">
                        <h5>{locale === "ar" ? "المدونة" : "Blogs"}</h5>
                        {searchTotals.blogs > searchResults.blogs.length && (
                          <button
                            type="button"
                            className="see-more-results"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => goToSearchSection(blogsSearchHref)}
                          >
                            {locale === "ar"
                              ? "عرض مزيد من المدونات"
                              : "See more blogs"}
                          </button>
                        )}
                      </div>
                      {searchResults.blogs.map((blog) => (
                        <Link
                          key={`blog-${blog.id || blog.slug}`}
                          href={`/blogs/${blog.slug}`}
                          className="search-result-item"
                        >
                          <span className="search-result-title">
                            {blog?.[`title_${locale}`] ||
                              blog.title ||
                              blog.title_en ||
                              blog.title_ar}
                          </span>
                          <span className="search-result-meta">
                            {blog?.[`description_${locale}`] ||
                              blog.description ||
                              blog.description_en ||
                              blog.description_ar}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="account">
              {isAuthenticated ? (
                <>
                  {!screenSize.includes("small") && (
                    <>
                      <Link href={`/favorites`} className="icon-holder fav">
                        <FaRegHeart className="main" />
                        <FaHeart className="hover" />
                        <span>{user?.favorites_count || 0}</span>
                      </Link>
                      {/* <div className="icon-holder msg">
                        <LuMessageSquare className="main" />
                        <FaMessage className="hover" />
                        <span>6</span>
                      </div> */}
                      {/* <hr /> */}
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
                          {user?.user_type == "ADMIN" && (
                            <li>
                              <Link href={`/dashboard`} className="btn">
                                <TbDeviceDesktopAnalytics
                                  style={{ fontSize: "16px" }}
                                />
                                {t.actions.openDashBoard}
                              </Link>
                            </li>
                          )}

                          <li>
                            <Link href={`/account/${user?.id}`} className="btn">
                              <FaRegUser />
                              {t.actions.accountSettings}
                            </Link>
                          </li>
                          {user?.user_type !== "USER" && (
                            <li>
                              <Link href={`/mylisting/createAd`} className="btn">
                                <MdPostAdd style={{ fontSize: "17px" }} />
                                {t.actions.postAd}
                              </Link>
                            </li>
                          )}
                          {user?.user_type === "USER" && (
                            <li>
                              <Link href={`/request-ad`} className="btn">
                                <MdPostAdd style={{ fontSize: "17px" }} />
                                Request an ad
                              </Link>
                            </li>
                          )}
                          {user?.user_type !== "USER" && (
                            <li>
                              <Link href={`/mylisting`} className="btn">
                                <FaListUl />
                                {t.actions.viewAdsListing}
                              </Link>
                            </li>
                          )}

                          {screenSize.includes("small") && (
                            <>
                              <li>
                                <Link href={`/`} className="btn">
                                  <FaRegHeart />
                                  {t.actions.favorietList}
                                </Link>
                              </li>
                              {/* <li>
                                <Link href={`/`} className="btn">
                                  <LuMessageSquare />
                                  {t.actions.adsChat}
                                </Link>
                              </li> */}
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
                  <Link className="main-button request-ad" href={`/request-ad`}>
                    {!screenSize.includes("small") ? "Request an ad" : <MdPostAdd />}
                  </Link>
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
              <SelectLocation locale={locale} onSelect={handleLocationSelect} />

              <div
                className={`cats-nav ${activeSmallMenu ? "active" : ""}`}
                ref={menuRef2}
              >
                {nav?.map((group) => {
                  const isActive = activeSubCat === group.id;

                  return (
                    <div
                      key={group.id}
                      className="cat-item"
                      onMouseEnter={
                        !screenSize.includes("small")
                          ? () => openMenu(group.id)
                          : undefined
                      }
                      onMouseLeave={
                        !screenSize.includes("small") ? closeMenu : undefined
                      }
                    >
                      {/* ================= ROOT ================= */}

                      <Link
                        href={getNodeHref(group)}
                        onClick={(e) => {
                          if (screenSize !== "large") {
                            e.preventDefault();
                            toggleMenu(group.id);
                          }
                        }}
                      >
                        <span>{group?.[`name_${locale}`]}</span>

                        {group.children?.length > 0 && <FaAngleDown />}
                      </Link>

                      {/* ================= MENU ================= */}

                      {isActive && (
                        <div
                          className="menu active mega-menu"
                          onMouseEnter={
                            !screenSize.includes("small")
                              ? () => openMenu(group.id)
                              : undefined
                          }
                          onMouseLeave={
                            !screenSize.includes("small")
                              ? closeMenu
                              : undefined
                          }
                        >
                          <div className="mega-content">
                            {/* ========================================= */}
                            {/* VACATION HOMES */}
                            {/* ========================================= */}

                            {group.id === "vacation_homes" &&
                              group.children?.map((type) => (
                                <div key={type.id} className="mega-column">
                                  <div className="nested-wrapper">
                                    <h4 className="column-title">
                                      {type.direct ? (
                                        <Link
                                          href={marketHref({
                                            dep: type.table_id,
                                            cat: type.category_id,
                                          })}
                                        >
                                          <span>
                                            {type?.[`name_${locale}`]}
                                          </span>
                                          {type.children?.length > 0 && (
                                            <FaAngleDown />
                                          )}
                                        </Link>
                                      ) : (
                                        <>
                                          <span>
                                            {type?.[`name_${locale}`]}
                                          </span>
                                          {type.children?.length > 0 && (
                                            <FaAngleDown />
                                          )}
                                        </>
                                      )}
                                    </h4>

                                    {type.direct &&
                                      type.children?.length > 0 && (
                                        <div className="nested-links menu">
                                          {type.children.map((sub) => (
                                            <Link
                                              key={sub.id}
                                              href={marketHref({
                                                dep: type.table_id,
                                                cat: type.category_id,
                                                subcat: sub.id,
                                              })}
                                            >
                                              {sub?.[`name_${locale}`]}
                                            </Link>
                                          ))}
                                        </div>
                                      )}

                                    {!type.direct &&
                                      type.children?.length > 0 && (
                                        <div className="nested-links menu">
                                          {type.children.map((item) => (
                                            <div
                                              key={item.id}
                                              className="nested-item"
                                            >
                                              <Link
                                                href={marketHref({
                                                  dep: item.table_id,
                                                  cat: item.category_id,
                                                })}
                                                className="nested-parent"
                                              >
                                                <span>
                                                  {item?.[`name_${locale}`]}
                                                </span>

                                                {item.children?.length > 0 && (
                                                  <FaAngleDown />
                                                )}
                                              </Link>

                                              {item.children?.length > 0 && (
                                                <div className="nested-links menu">
                                                  {item.children.map((sub) => (
                                                    <Link
                                                      key={sub.id}
                                                      href={marketHref({
                                                        dep: item.table_id,
                                                        cat: item.category_id,
                                                        subcat: sub.id,
                                                      })}
                                                    >
                                                      {sub?.[`name_${locale}`]}
                                                    </Link>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              ))}

                            {/* ========================================= */}
                            {/* SALE / RENT ROOTS + OTHER TABLES */}
                            {/* ========================================= */}

                            {group.id !== "vacation_homes" &&
                              group.children?.map((table) => (
                                <div key={table.id} className="mega-column">
                                  <div className="nested-wrapper">
                                    {/* TABLE */}

                                    <h4 className="column-title">
                                      <Link
                                        href={marketHref({ dep: table.id })}
                                      >
                                        <span>{table?.[`name_${locale}`]}</span>
                                        {table.children?.length > 0 && (
                                          <FaAngleDown />
                                        )}
                                      </Link>
                                    </h4>

                                    {/* CATEGORIES */}

                                    {table.children?.length > 0 && (
                                      <div className="nested-links menu">
                                        {table.children.map((cat) => (
                                          <div
                                            key={cat.id}
                                            className="nested-item"
                                          >
                                            <Link
                                              href={marketHref({
                                                dep: table.id,
                                                cat: cat.id,
                                              })}
                                              className="nested-parent"
                                            >
                                              <span>
                                                {cat?.[`name_${locale}`]}
                                              </span>

                                              {cat.children?.length > 0 && (
                                                <FaAngleDown />
                                              )}
                                            </Link>

                                            {/* SUBCATEGORIES */}

                                            {cat.children?.length > 0 && (
                                              <div className="nested-links menu">
                                                {cat.children.map((sub) => (
                                                  <Link
                                                    key={sub.id}
                                                    href={marketHref({
                                                      dep: table.id,
                                                      cat: cat.id,
                                                      subcat: sub.id,
                                                    })}
                                                  >
                                                    {sub?.[`name_${locale}`]}
                                                  </Link>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
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
