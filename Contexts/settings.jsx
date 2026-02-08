"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const settings = createContext();

export const SettingsProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(null);
  const [isReady, setIsReady] = useState(false); // ← جديد
  const pathname = usePathname();
  const [onCreate, setOnCreate] = useState(null);
  useEffect(() => {
    function getScreenSize() {
      const width = window.innerWidth;
      if (width < 400) return "ultra-small";
      if (width < 768) return "small";
      if (width < 992) return "med";
      return "large";
    }

    setScreenSize(getScreenSize());
    setIsReady(true); // ← نعلن إننا جاهزين

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // 🔥 الحل: منع أي Render لحد ما الشاشة تتحدد

  const [isNavOpen, setIsNavOpen] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (screenSize !== "large") {
      setIsNavOpen(false);
    }
  }, [screenSize]);
  console.log(isNavOpen);

  useEffect(() => {
    setIsNavOpen(false);
    setIsMounted(true);
  }, [pathname]);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved) setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr",
    );
    localStorage.setItem("locale", locale);
  }, [locale]);

  const toggleLocale = () => setLocale((prev) => (prev === "en" ? "ar" : "en"));
  if (!isReady) {
    return null; // أو Loader صغير حسب رغبتك
  }

  return (
    <settings.Provider
      value={{
        pathname,
        screenSize,
        theme,
        setTheme,
        toggleTheme,
        locale,
        setLocale,
        toggleLocale,
        isNavOpen,
        setIsNavOpen,
        isMounted,
        onCreate,
        setOnCreate,
      }}
    >
      {children}
    </settings.Provider>
  );
};
