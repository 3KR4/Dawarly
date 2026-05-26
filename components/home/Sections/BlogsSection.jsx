"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "@/styles/client/pages/blogs.css";
import useTranslate from "@/Contexts/useTranslation";
import { getAllBlogs } from "@/services/blogs/blogs.service";
import BlogCard from "../BlogCard";

export default function BlogsSection() {
  const t = useTranslate();

  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getAllBlogs(1, 4);
      const blogsData = res.data.data || [];

      setBlogs(blogsData);
      setTotalBlogs(res.data.pagination?.total || blogsData.length);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const visibleBlogs = blogs.slice(0, 3);
  const hasMoreBlogs = totalBlogs > 3 || blogs.length > 3;

  if (loading || visibleBlogs.length === 0) return null;

  return (
    <div className="all-blogs fluid-container for-blogs">
      <div className="top">
        <h3 className="title">{t.common.latestBlogs}</h3>

        {hasMoreBlogs && (
          <Link href={`/blogs`} className="link">
            {t.home.seeMore}
          </Link>
        )}
      </div>
      <div className="grid-holder">
        {visibleBlogs.map((item) => (
          <BlogCard data={item} size={"small"} key={item.id} />
        ))}
      </div>
    </div>
  );
}
