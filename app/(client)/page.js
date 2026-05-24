import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";
import HeroSwiper from "@/components/home/Sections/LandingSwiper";
import CategoriesSwiper from "@/components/home/Sections/CategoriesSwiper";
import BlogsSection from "@/components/home/Sections/BlogsSection";

export default function Home() {
  return (
    <>
      <HeroSwiper />
      <CategoriesSwiper type={`categories`} />
      <CategoriesSwiper type={`tables`} />

      <BlogsSection />

      <AdsSwiper type="gov" id={1} />
      <AdsSwiper type="city" id={1} />
      <AdsSwiper type="area" id={10} />
      <AdsSwiper type="compound" id={5} />

      <AdsSwiper type="table" id={3} />
      <AdsSwiper type="table" id={4} />

      <AdsSwiper type="category" id={1} tableId={3} />
      <AdsSwiper type="subcategory" id={1} tableId={3} />

      <AdsSwiper type="category" id={1} tableId={3} />
      <AdsSwiper type="subCategory" id={1} tableId={4} />

      <AdsSwiper type="views" />
      <AdsSwiper type="views" tableId={3} />

      <AdsSwiper type="featured" />
      <AdsSwiper type="featured" tableId={3} />

      <AdsSwiper type="favorites" />
      <AdsSwiper type="favorites" tableId={4} />
    </>
  );
}
