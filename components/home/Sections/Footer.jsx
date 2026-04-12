"use client";
import "@/styles/client/footer.css";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { settings } from "@/Contexts/settings";
import useTranslate from "@/Contexts/useTranslation";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import {
  FaRegHeart,
  FaRegComment,
  FaShieldAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";

function Footer() {
  const t = useTranslate();
  const { locale, theme } = useContext(settings);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      // { name: t.footer.aboutUs, href: "/about" },
      { name: t.footer.contactUs, href: "/contact" },
      // { name: t.footer.howItWorks, href: "/how-it-works" },
      // { name: t.footer.faq, href: "/faq" },
      { name: t.footer.favorites, href: "/favorites" },

      { name: t.footer.blog, href: "/blog" },
    ],
    forBuyers: [
      { name: t.footer.browseListings, href: "/market" },
      { name: t.footer.searchByLocation, href: "/market?location" },
      { name: t.footer.searchByCategory, href: "/market?category" },
    ],
    forSellers: [
      { name: t.footer.postAd, href: "/mylisting/createAd" },
      { name: t.footer.myListings, href: "/mylisting" },
      { name: t.footer.pricing, href: "/pricing" },
      { name: t.footer.advertising, href: "/advertise" },
    ],
    legal: [
      { name: t.footer.termsOfUse, href: "/terms" },
      { name: t.footer.privacyPolicy, href: "/privacy" },
      // { name: t.footer.cookiePolicy, href: "/cookies" },
      // { name: t.footer.refundPolicy, href: "/refund" },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
    // { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    {
      icon: <FaInstagram />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
    // { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
  ];

  const features = [
    {
      icon: <FaShieldAlt />,
      title: t.footer.securePayments,
      desc: t.footer.securePaymentsDesc,
    },
    // {
    //   icon: <FaTruck />,
    //   title: t.footer.fastDelivery,
    //   desc: t.footer.fastDeliveryDesc,
    // },
    // {
    //   icon: <FaUndo />,
    //   title: t.footer.easyReturns,
    //   desc: t.footer.easyReturnsDesc,
    // },
    {
      icon: <FaRegHeart />,
      title: t.footer.customerSupport,
      desc: t.footer.customerSupportDesc,
    },
  ];

  return (
    <footer className={`footer ${theme === "dark" ? "dark-theme" : ""}`}>
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>{t.footer.newsletterTitle}</h3>
              <p>{t.footer.newsletterDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section company-info">
              <Link href="/" className="footer-logo">
                <Image src="/logo.png" width={45} height={45} alt="Dawaarly" />
                <span>{t.header.awaarly}</span>
              </Link>
              <p className="company-description">{t.footer.companyDesc}</p>
              <div className="contact-info">
                <div className="contact-item">
                  <MdEmail />
                  <span>support@dawaarly.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>{t.footer.quickLinks}</h4>
              <ul>
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Buyers */}
            <div className="footer-section">
              <h4>{t.footer.forBuyers}</h4>
              <ul>
                {footerLinks.forBuyers.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Sellers */}
            <div className="footer-section">
              <h4>{t.footer.forSellers}</h4>
              <ul>
                {footerLinks.forSellers.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="footer-features">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <div className="copyright">
              <p>
                &copy; {currentYear} Dawaarly. {t.footer.allRightsReserved}
              </p>
            </div>
            <div className="legal-links">
              {footerLinks.legal.map((link, index) => (
                <Link key={index} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
