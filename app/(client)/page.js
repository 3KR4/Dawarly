import Image from "next/image";
import "@/styles/client/pages/home.css";
import AdsSwiper from "@/components/home/Sections/AdsSwiper";

export default function Home() {
  return (
    <>
      <AdsSwiper title={`most popular`} type={`popular`} />
    </>
  );
}
