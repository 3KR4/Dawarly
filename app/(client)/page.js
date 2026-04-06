"use client"
import Image from "next/image";
import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import HeroSwiper from "@/components/home/Sections/LandingSwiper";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import SearchSection from "@/components/home/Sections/SearchSection";
import { useAppData } from "@/Contexts/DataContext";

export default function Home() {
  const { categories, subCategories, governorates, cities } = useAppData();

  return (
    <>
      <HeroSwiper />
      <SearchSection />
      <CategoriesSwiper type={`cat`} />
      {/* <CategoriesSwiper type={`sub-cat`} catId={3} /> */}

      <AdsSwiper
        type={`governorate`}
        value={governorates.find((x) => x.id == 1)}
      />
      <AdsSwiper
        type={`governorate`}
        value={governorates.find((x) => x.id == 2)}
      />
      <AdsSwiper
        type={`governorate`}
        value={governorates.find((x) => x.id == 3)}
      />

      {/* <AdsSwiper type={`newly_added`} />
      <AdsSwiper type={`cat`} id={1} />
      <AdsSwiper type={`cat`} id={2} />
      <AdsSwiper type={`cat`} id={3} />
      <AdsSwiper type={`cat`} id={5} />
      <AdsSwiper type={`cat`} id={6} />
      <AdsSwiper type={`cat`} id={7} />
      <AdsSwiper type={`cat`} id={8} />
      <AdsSwiper type={`cat`} id={9} />
      <AdsSwiper type={`cat`} id={10} />
      <AdsSwiper type={`cat`} id={11} />
      <AdsSwiper type={`cat`} id={12} /> */}
      {/* <AdsSwiper type={`sub-cat`} id={11} />
      <AdsSwiper type={`sub-cat`} id={14} />
      <AdsSwiper type={`sub-cat`} id={21} /> */}
    </>
  );
}
