"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { refreshAccessToken, setAccessToken } from "@/services/axios";

const AuthContext = createContext(null);

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const storeUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  if (["ar", "en"].includes(user?.language)) {
    localStorage.setItem("locale", user.language);
    document.cookie = `locale=${user.language}; path=/; max-age=31536000; SameSite=Lax`;
  }
  if (["light", "dark"].includes(user?.theme)) {
    localStorage.setItem("theme", user.theme);
    document.cookie = `theme=${user.theme}; path=/; max-age=31536000; SameSite=Lax`;
  }
  window.dispatchEvent(new CustomEvent("user-preferences-updated", {
    detail: {
      language: user?.language,
      theme: user?.theme,
    },
  }));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = ({ user, accessToken }) => {
    setAccessToken(accessToken);
    setUser(user);
    storeUser(user);
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      storeUser(res.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // ================= REFRESH TOKEN =================
  const refreshAuth = async () => {
    try {
      await refreshAccessToken();
      await fetchUser();
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    refreshAuth();
  }, []);

  const updateUserFavoritesCount = (newCount) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        favorites_count: newCount,
      };

      storeUser(updatedUser);

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        updateUserFavoritesCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
export const useAuth = () => useContext(AuthContext);
