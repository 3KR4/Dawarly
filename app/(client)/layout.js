import { Cairo } from "next/font/google";
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

export const metadata = {
  metadataBase: new URL("https://www.dawaarly.com"),

  title: "Dawaarly",
  description:
    "Find your next getaway with Dawaarly — the platform that connects renters with property owners for vacation homes, summer stays, and short-term rentals across Egypt. Simple, secure, and made for your perfect escape.",

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
    description:
      "Find your next getaway with Dawaarly — the platform that connects renters with property owners for vacation homes, summer stays, and short-term rentals across Egypt. Simple, secure, and made for your perfect escape.",
    url: "https://www.dawaarly.com",
    siteName: "Dawaarly",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Dawaarly logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Dawaarly",
    description:
      "Find your next getaway with Dawaarly — the platform that connects renters with property owners for vacation homes, summer stays, and short-term rentals across Egypt. Simple, secure, and made for your perfect escape.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cairo.className}>
      <body>
        <SettingsProvider>
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
