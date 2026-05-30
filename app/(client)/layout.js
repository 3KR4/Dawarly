import { Cairo } from "next/font/google";
import { cookies } from "next/headers";
import Header from "@/components/home/Sections/Header";
import Footer from "@/components/home/Sections/Footer";
import { SettingsProvider } from "@/Contexts/settings";
import { FiltersProvider } from "@/Contexts/filters";
import { SelectorsProvider } from "@/Contexts/selectors";
import { AuthProvider } from "@/Contexts/AuthContext";
import { NotificationProvider } from "@/Contexts/NotificationContext";
import NotificationHolder from "@/components/Tools/NotificationHolder";
import { DataProvider } from "@/Contexts/DataContext";

import "@/styles/client/globals.css";
import InitSounds from "@/components/Tools/InitSounds";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Find your next getaway with Dawaarly - the platform that connects renters with property owners for vacation homes, summer stays, and short-term rentals across Egypt. Simple, secure, and made for your perfect escape.";

export const metadata = {
  metadataBase: new URL("https://dawaarly.com"),

  title: "Dawaarly",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "https://dawaarly.com",
  },

  keywords: [
    "vacation rentals Egypt",
    "short term rentals",
    "holiday homes Egypt",
    "rent apartment Egypt",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Dawaarly",
    description: SITE_DESCRIPTION,
    url: "https://dawaarly.com",
    siteName: "Dawaarly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dawaarly vacation rentals in Egypt",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Dawaarly",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/logo-favicon.png",
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
};

const getInitialLocale = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale === "en" || locale === "ar" ? locale : "ar";
};

export default async function RootLayout({ children }) {
  const initialLocale = await getInitialLocale();

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      className={cairo.className}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedLocale = localStorage.getItem("locale");
                var locale = storedLocale === "ar" || storedLocale === "en" ? storedLocale : "${initialLocale}";
                document.cookie = "locale=" + locale + "; path=/; max-age=31536000; SameSite=Lax";
                document.documentElement.setAttribute("lang", locale);
                document.documentElement.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
                if (locale !== "${initialLocale}") {
                  document.documentElement.setAttribute("data-locale-pending", "true");
                }
              } catch (error) {}
            `,
          }}
        />
        <style>{`html[data-locale-pending="true"] body { visibility: hidden; }`}</style>
      </head>
      <body>
        <SettingsProvider initialLocale={initialLocale}>
          <NotificationProvider>
            <AuthProvider>
              <FiltersProvider>
                <SelectorsProvider>
                  <DataProvider>
                    <Header />
                    {children}
                    <Footer />
                    <InitSounds />
                    <NotificationHolder />
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
