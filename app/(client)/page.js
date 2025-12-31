import Image from "next/image";
import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import HeroSwiper from "@/components/home/Sections/LandingSwiper";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";

export default function Home() {
  return (
    <>
      <HeroSwiper />
      <CategoriesSwiper type={`cat`} />
      <CategoriesSwiper type={`sub-cat`} catId={3} />
      <AdsSwiper title={`most popular`} type={`popular`} />
    </>
  );
}
