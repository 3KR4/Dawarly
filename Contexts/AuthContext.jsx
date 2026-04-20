"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api, { plainApi, setAccessToken } from "@/services/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = ({ user, accessToken }) => {
    setAccessToken(accessToken);

    // ✅ حط اليوزر فورًا
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
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

      // ✅ save in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // ================= REFRESH TOKEN =================
  const refreshAuth = async () => {
    try {
      const res = await plainApi.post("/auth/refresh-token"); // ✅
      setAccessToken(res.data.accessToken);

      await fetchUser();
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    }

    setLoading(false);
  };

  // ================= INIT =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ instant UI
      setLoading(false); // ✅ منع الفلاش
    }

    refreshAuth();
  }, []);

const updateUserFavoritesCount = (newCount) => {
  setUser((prev) => {
    if (!prev) return prev;

    const updatedUser = {
      ...prev,
      favorites_count: newCount,
    };

    // ✅ sync مع localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

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
        updateUserFavoritesCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
export const useAuth = () => useContext(AuthContext);
