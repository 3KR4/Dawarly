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
      {/* <CategoriesSwiper type={`sub-cat`} catId={3} /> */}
      <AdsSwiper type={`newest`} />
      <AdsSwiper type={`cat`} id={1} />
      <AdsSwiper type={`cat`} id={2} />
      <AdsSwiper type={`cat`} id={3} />
      <AdsSwiper type={`sub-cat`} id={11} />
      <AdsSwiper type={`sub-cat`} id={14} />
      <AdsSwiper type={`sub-cat`} id={21} />
    </>
  );
}
