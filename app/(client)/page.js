import Image from "next/image";
import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import HeroSwiper from "@/components/home/Sections/LandingSwiper";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import SearchSection from "@/components/home/Sections/SearchSection";
import BlogsSection from "@/components/home/Sections/BlogsSection";

export default function Home() {
  return (
    <>
      <HeroSwiper />
      {/* <SearchSection /> */}
      <CategoriesSwiper type={`categories`} />
      <CategoriesSwiper type={`tables`} />
      {/* <CategoriesSwiper type={`subcategories`} target={2}  /> */}
      {/* <CategoriesSwiper type={`subcategories`}  />
      <CategoriesSwiper type={`countries`}  />
      <CategoriesSwiper type={`governorates`}   />
      <CategoriesSwiper type={`governorates`} target={2}  />
      <CategoriesSwiper type={`cities`}  />
      <CategoriesSwiper type={`areas`}  />
      <CategoriesSwiper type={`compounds`}  /> */}

      <AdsSwiper type={`governorate`} id={23} />
      <AdsSwiper type={`city`} id={357} />
      <BlogsSection />
      <AdsSwiper type={`compound`} id={111} />
      <AdsSwiper type={`category`} id={1} />
      <AdsSwiper type={`category`} id={2} />
    </>
  );
}
