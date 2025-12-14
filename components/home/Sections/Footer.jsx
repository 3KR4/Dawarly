"use client";
import "@/styles/client/footer.css";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";

import { FaTiktok, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer>
      {/* <Image
        src="/footer-bg.png"
        alt="Footer Background"
        fill
        className="footer-bg"
      />
      <p className="paragraph">
        Discover the beauty, history, and culture of Egypt — all in one place.
      </p>
      <div className="container">
        <Image
          className="logo"
          src="/logo-transparent.png"
          alt="dawarly Logo"
          fill
        />

        <div className="hold">
          <div className="about">
            <h4>Contact Us</h4>
            <p>
              Email: <a href="mailto:info@dawarly.com">info@dawarly.com</a>
            </p>
            <p>
              Phone: <a href="tel:+201000000000">+20 100 000 0000</a>
            </p>
          </div>
          <div className="social">
            <h4>Social</h4>
            <div className="holder">
              <a
                href="https://www.instagram.com/dawarly.eg/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/dawarly%C2%B0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.facebook.com/dawarlye/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.tiktok.com/@dawarly.travel/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <div className="navlinks">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/governorates">governorates</Link>
            </li>
            <li>
              <Link href="/places">Top Attractions</Link>
            </li>
            <li>
              <Link href="/products">Local Products</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="privacy">
        © {new Date().getFullYear()} dawarly. All rights reserved. |
        <Link href="/privacy" className="privacy-link">
          {""}
          Privacy Policy
        </Link>
      </p> */}
    </footer>
  );
};

export default Footer;
