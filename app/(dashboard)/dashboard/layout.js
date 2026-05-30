"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cairo } from "next/font/google";

import SideNav from "@/components/dashboard/SideNav";
import "@/styles/client/globals.css";
import "@/styles/dashboard/globals.css";
import Head from "@/components/dashboard/Head";
import { SettingsProvider } from "@/Contexts/settings";
import { FiltersProvider } from "@/Contexts/filters";
import { SelectorsProvider } from "@/Contexts/selectors";
import { DataProvider } from "@/Contexts/DataContext";
import { NotificationProvider } from "@/Contexts/NotificationContext";
import NotificationHolder from "@/components/Tools/NotificationHolder";
import { AuthProvider, useAuth } from "@/Contexts/AuthContext";
import useTranslate from "@/Contexts/useTranslation";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});


// ---------------- PROTECTED DASHBOARD ----------------
const ProtectedDashboard = ({ children }) => {
  const { user, loading } = useAuth();
  const t = useTranslate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && user?.user_type !== "ADMIN") {
      router.replace("/register"); // لو مش مسجل → رجع على register
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>{t.common.loading}</div>;
  }

  return children;
};

// ---------------- ROOT LAYOUT ----------------
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var locale = localStorage.getItem("locale");
                if (locale !== "ar" && locale !== "en") {
                  var storedUser = localStorage.getItem("user");
                  var user = storedUser ? JSON.parse(storedUser) : null;
                  locale = user && (user.language === "ar" || user.language === "en")
                    ? user.language
                    : "ar";
                }
                document.cookie = "locale=" + locale + "; path=/; max-age=31536000; SameSite=Lax";
                document.documentElement.setAttribute("lang", locale);
                document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
                if (locale !== "ar") {
                  document.documentElement.setAttribute("data-locale-pending", "true");
                }
              } catch (error) {}
            `,
          }}
        />
        <style>{`html[data-locale-pending="true"] body { visibility: hidden; }`}</style>
      </head>
      <body>
        <SettingsProvider>
          <NotificationProvider>
            <AuthProvider>
              <FiltersProvider>
                <SelectorsProvider>
                  <DataProvider>
                    <ProtectedDashboard>
                      <div className="dashboard">
                        <SideNav />
                        <div className="holder">
                          <Head />
                          {children}
                        </div>
                        <NotificationHolder />
                      </div>
                    </ProtectedDashboard>
                  </DataProvider>
                </SelectorsProvider>
              </FiltersProvider>
            </AuthProvider>
          </NotificationProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
