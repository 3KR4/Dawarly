"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import "@/styles/client/pages/blog-details.css";
import Image from "next/image";
import Link from "next/link";
import Navigations from "@/components/Tools/Navigations";

import useTranslate from "@/Contexts/useTranslation";

import "swiper/css";
import "swiper/css/navigation";

import { settings } from "@/Contexts/settings";

import AdDetailsSkeleton from "@/components/skeletons/AdDetailsSkeleton";
import { getOneBlog } from "@/services/blogs/blogs.service";

export default function Blog() {
  const t = useTranslate();
  const { slug } = useParams();
  const { screenSize, locale } = useContext(settings);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOneBlog(slug)
      .then((res) => {
        console.log("res", res.data);
        setBlog(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <AdDetailsSkeleton />;
  }

  return (
    <>
      <div className="blog-page fluid-container">
        <Image
          className="main-img"
          fill
          src={blog?.cover?.secure_url}
          alt={blog?.[`title_${locale}`]}
        />

        <div className="holder container">

          <h1 className="title">{blog?.[`title_${locale}`]}</h1>

          {blog?.content_en?.map((item, index) => {
            switch (item.type) {
              case "paragraph":
                return (
                  <p key={index} className="blog-paragraph">
                    {item.content}
                  </p>
                );

              case "heading":
                if (item.level === 1) {
                  return (
                    <h1 key={index} className="blog-h1">
                      {item.content}
                    </h1>
                  );
                }

                if (item.level === 2) {
                  return (
                    <h2 key={index} className="blog-h2">
                      {item.content}
                    </h2>
                  );
                }

                return (
                  <h3 key={index} className="blog-h3">
                    {item.content}
                  </h3>
                );

              case "image":
                return (
                  <div key={index} className="blog-image-wrapper">
                    <Image
                      src={item.image?.secure_url}
                      alt="blog image"
                      width={800}
                      height={500}
                      className="blog-image"
                    />
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
}
