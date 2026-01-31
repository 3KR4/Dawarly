import { Cairo } from "next/font/google";
import Header from "@/components/home/Sections/Header";
import Footer from "@/components/home/Sections/Footer";
import { SettingsProvider } from "@/Contexts/settings";
import { FiltersProvider } from "@/Contexts/filters";
import { SelectorsProvider } from "@/Contexts/selectors";

import "@/styles/client/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Dawaarly",
  description:
    "Explore hidden gems, exciting night spots, and real Egyptian culture with Dawaarly. Your journey starts here — fun, local, and unforgettable.",
  openGraph: {
    title: "Dawaarly",
    description:
      "Explore hidden gems, exciting night spots, and real Egyptian culture with Dawaarly. Your journey starts here — fun, local, and unforgettable.",
    url: "https://Dawaarly.vercel.app/",
    siteName: "Dawaarly",
    images: [
      {
        url: "/logo.png",
        width: 1000,
        height: 1000,
        alt: "Dawaarly-logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/full-logo.jpg",
    shortcut: "/full-logo.jpg",
    apple: "/full-logo.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cairo.className}>
      <body>
        <SettingsProvider>
          <FiltersProvider>
            <SelectorsProvider>
              <Header />
              {children}
              <Footer />
            </SelectorsProvider>
          </FiltersProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
