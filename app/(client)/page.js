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

      <AdsSwiper type={`governorate`} id={1} />
      <AdsSwiper type={`governorate`} id={2} />
      <AdsSwiper type={`city`} id={1} />
      <AdsSwiper type={`compound`} id={1} />
      <AdsSwiper type={`category`} id={1} />
      <AdsSwiper type={`subCategory`} id={5} />
    </>
  );
}
