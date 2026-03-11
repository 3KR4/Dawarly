"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/axios";
import { setAccessToken } from "@/services/apiInterceptor";
import { refreshToken, getCurrentUser } from "@/services/auth/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // read user from localStorage immediately
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(!user); // loading true only if no cached user

  const login = ({ user, accessToken }) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user)); // save to localStorage
    setAccessToken(accessToken);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    localStorage.removeItem("user");
    setAccessToken(null);
  };

  const refreshAuth = async () => {
    try {
      const res = await refreshToken();
      setAccessToken(res.data.accessToken);

      const userRes = await getCurrentUser();
      setUser(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    }
    setLoading(false);
  };

  useEffect(() => {
    // if there's no cached user, call refreshAuth
    if (!user) refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
