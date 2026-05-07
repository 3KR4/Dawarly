"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "@/styles/client/pages/blogs.css";
import useTranslate from "@/Contexts/useTranslation";
import { getAllBlogs } from "@/services/blogs/blogs.service";
import BlogCard from "../BlogCard";

export default function BlogsSection() {
  const t = useTranslate();

  // ================= STATES =================
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getAllBlogs(1, 3);
      setBlogs(res.data.data);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return;
  }

  return (
    <div className="all-blogs fluid-container for-blogs">
      <div className="top">
        <h3 className="title">latest Blogs</h3>

        <Link href={`/blogs`} className="link">
          {t.home.seeMore}
        </Link>
      </div>
      <div className="grid-holder">
        {blogs.map((item) => (
          <BlogCard data={item} size={"small"} key={item.id} />
        ))}
      </div>
    </div>
  );
}
