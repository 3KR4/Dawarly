import { Roboto } from "next/font/google";
import SideNav from "@/components/dashboard/SideNav";
import "@/styles/client/globals.css";
import "@/styles/dashboard/globals.css";
import Head from "@/components/dashboard/Head";
import { SettingsProvider } from "@/Contexts/settings";
import { FiltersProvider } from "@/Contexts/filters";
import { SelectorsProvider } from "@/Contexts/selectors";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "dawarly DashBoard",
  description: "",

  openGraph: {
    title: "dawarly DashBoard",
    description: "",
    url: "https://dawarly.vercel.app/dashboard",
    siteName: "dawarly DashBoard",
    images: [
      {
        url: "/full-logo.jpg",
        width: 1000,
        height: 1000,
        alt: "dawarly-logo",
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
    <html lang="en" className={roboto.className}>
      <body>
        <SettingsProvider>
          <FiltersProvider>
            <SelectorsProvider>
              <div className="dashboard">
                <SideNav />

                <div className="dash-holder">
                  <Head />
                  {children}
                </div>
              </div>
            </SelectorsProvider>
          </FiltersProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
