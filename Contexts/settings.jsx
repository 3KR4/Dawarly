"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { updateUserProfile } from "@/services/auth/auth.service";

export const settings = createContext();

const DEFAULT_LOCALE = "ar";
const DEFAULT_THEME = "light";
const SUPPORTED_LOCALES = ["ar", "en"];

const setPreferenceCookie = (key, value) => {
  if (typeof document === "undefined") return;

  document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`;
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const updateStoredUser = (updates) => {
  const user = getStoredUser();
  if (!user) return;

  localStorage.setItem("user", JSON.stringify({ ...user, ...updates }));
};

const getStoredLocale = (initialLocale = DEFAULT_LOCALE) => {
  if (typeof window === "undefined") return initialLocale;

  const storedLocale = localStorage.getItem("locale");
  if (SUPPORTED_LOCALES.includes(storedLocale)) return storedLocale;

  const user = getStoredUser();
  if (SUPPORTED_LOCALES.includes(user?.language)) return user.language;

  return initialLocale;
};

const getScreenSize = () => {
  if (typeof window === "undefined") return "large";

  const width = window.innerWidth;
  if (width < 400) return "ultra-small";
  if (width < 768) return "small";
  if (width < 992) return "med";
  return "large";
};

export const SettingsProvider = ({ children, initialLocale = DEFAULT_LOCALE }) => {
  const [screenSize, setScreenSize] = useState(getScreenSize);
  const pathname = usePathname();
  const [menuType, setMenuType] = useState(null);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isNavOpen, setIsNavOpen] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (screenSize !== "large") {
        setIsNavOpen(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [screenSize]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsNavOpen(false);
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const user = getStoredUser();

      return user?.theme || localStorage.getItem("theme") || DEFAULT_THEME;
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const persistPreferences = async (updates) => {
    const storedUser = getStoredUser();
    if (!storedUser) return;

    updateStoredUser(updates);
    if (SUPPORTED_LOCALES.includes(updates.language)) {
      localStorage.setItem("locale", updates.language);
      setPreferenceCookie("locale", updates.language);
    }
    if (["light", "dark"].includes(updates.theme)) {
      localStorage.setItem("theme", updates.theme);
      setPreferenceCookie("theme", updates.theme);
    }

    try {
      const res = await updateUserProfile(updates);
      if (res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Failed to sync user preferences", err);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";
      persistPreferences({ theme: nextTheme });
      return nextTheme;
    });
  };

  const [locale, setLocale] = useState(() => {
    return getStoredLocale(initialLocale);
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr",
    );
    localStorage.setItem("locale", locale);
    setPreferenceCookie("locale", locale);
    document.documentElement.removeAttribute("data-locale-pending");
  }, [locale]);

  useEffect(() => {
    const applyUserPreferences = (event) => {
      const { language, theme } = event.detail || {};

      if (["ar", "en"].includes(language)) {
        setLocale(language);
      }

      if (["light", "dark"].includes(theme)) {
        setTheme(theme);
      }
    };

    window.addEventListener("user-preferences-updated", applyUserPreferences);

    return () => {
      window.removeEventListener(
        "user-preferences-updated",
        applyUserPreferences,
      );
    };
  }, []);

  const toggleLocale = () => {
    setLocale((prev) => {
      const nextLocale = prev === "en" ? "ar" : "en";
      persistPreferences({ language: nextLocale });
      return nextLocale;
    });
  };
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
        menuType,
        setMenuType,
      }}
    >
      {children}
    </settings.Provider>
  );
};
