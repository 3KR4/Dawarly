"use client";
export const dynamic = "force-dynamic";
import "@/styles/client/pages/blogs.css";
import React, { useState, useContext, useEffect } from "react";
import Pagination from "@/components/Tools/Pagination";
import "@/styles/client/pages/market.css";
import { settings } from "@/Contexts/settings";
import { TbListSearch } from "react-icons/tb";
import Navigations from "@/components/Tools/Navigations";
import { getAllBlogs } from "@/services/blogs/blogs.service";
import BlogCard from "@/components/home/BlogCard";

export default function Marketplace() {
  const { screenSize, locale } = useContext(settings);

  const [blogsData, setBlogsData] = useState({
    blogs: [],
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
    },
  });

  const [loadingContent, setLoadingContent] = useState(false);

  const fetchBlogs = async (page = 1) => {
    try {
      setLoadingContent(true);

      const res = await getAllBlogs(page);

      setBlogsData({
        blogs: res.data.data || [],
        pagination: res.data.pagination || blogsData.pagination,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingContent(false);
    }
  };

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };

  return (
    <div className="container all-blogs">
      <Navigations items={[{ name: "blogs" }]} container="main" />

      <div
        className="grid-holder"
        style={{
          position: "relative",
          opacity: loadingContent ? "0.6" : "1",
        }}
      >
        {loadingContent && (
          <div className="loading-content">
            <span
              className="loader"
              style={{ opacity: loadingContent ? "1" : "0" }}
            ></span>
          </div>
        )}
        {!blogsData?.blogs?.length && !loadingContent ? (
          <div className="no-data-found">
            <TbListSearch />
            <p>{"no data found"} </p>
          </div>
        ) : (
          blogsData?.blogs?.map((item) => (
            <BlogCard data={item} key={item.id} />
          ))
        )}
      </div>

      {blogsData?.pagination?.totalPages > 1 && (
        <Pagination
          pageCount={blogsData?.pagination.totalPages}
          screenSize={screenSize}
          isDashBoard={true}
          currentPage={blogsData?.pagination.page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
