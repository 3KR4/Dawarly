import Image from "next/image";
import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import HeroSwiper from "@/components/home/Sections/LandingSwiper";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import SearchSection from "@/components/home/Sections/SearchSection";

export default function Home() {
  return (
    <>
      <HeroSwiper />
      {/* <SearchSection /> */}
      <CategoriesSwiper type={`cat`} />
      {/* <CategoriesSwiper type={`sub-cat`} catId={2} /> */}

      <AdsSwiper type={`governorate`} id={23} />
      <AdsSwiper type={`city`} id={357} />
      <AdsSwiper type={`compound`} id={111} />
      <AdsSwiper type={`category`} id={1} />
      <AdsSwiper type={`category`} id={2} />
    </>
  );
}
