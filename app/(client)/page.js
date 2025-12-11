import Image from "next/image";
import "@/styles/client/pages/home.css";
import LandingSwiper from "@/components/home/Sections/LandingSwiper";
import Categories from "@/components/home/Sections/Categories";
import Places from "@/components/home/Sections/Places";

export default function Home() {
  return (
    <>
      <LandingSwiper />
      <Categories />
      <Places />
    </>
  );
}
