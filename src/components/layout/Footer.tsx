import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import componylogo from "../../../public/images/Nav/eldita.svg"; // Assuming this is the correct path to your logo
export default function Footer() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <footer className="w-full transition-colors duration-300 relative overflow-hidden ">
      <hr />
      {/* Background Watermark */}
      <div className="absolute inset-0 opacity-6">
        <div className="absolute bottom-50  transform">
          <h1
            className="text-8xl font-bold text-gray-300 dark:text-gray-900 whitespace-nowrap"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "الدلــــتا للإستيراد والتصدير"
              : "El Delta for Import and Export"}
          </h1>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto px-4 md:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1 - Contact Information (Right) */}
            <div className="md:order-3  ">
              <h3
                className="text-2xl font-bold text-[var(--color-primary)] mb-6"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-teal-600 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <Link href={"mailto:support@eldelta-group.com"}>
                    <span className="text-gray-300 dark:text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-400">
                      support@eldelta-group.com
                    </span>
                  </Link>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-teal-600 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <Link href={"tel:+966 59 837 7921"}>
                    <span className="text-gray-300 dark:text-gray-900  hover:text-[var(--color-primary)] transition-colors duration-400">
                      +966 59 837 7921
                    </span>
                  </Link>
                </div>

                {/* Social Media */}
                <div className="pt-4">
                  <p
                    className="text-gray-300 dark:text-gray-600 mb-3 text-sm font-bold"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "ويمكنكم التواصل معنا أيضا أو متابعتنا عبر"
                      : "You can also contact us or follow us via"}
                  </p>

                  <div className="flex space-x-3">
                     {/* Facebook */}
                     <Link
                        href={
                          "https://www.facebook.com/people/DELTA-import-and-export/61578012036477/#"
                        }
                      >
                        <div className="w-9 h-9 bg-blue-100   dark:bg-blue-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
                          <span className="text-blue-600 dark:text-white font-bold text-sm">
                            <i className="fa-brands fa-facebook"></i>
                          </span>
                        </div>
                      </Link>
                        {/*  */}
                        <Link href={"https://www.instagram.com/eldelta_group"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all duration-200">
                          <i className="fa-brands fa-instagram text-white text-sm"></i>
                        </div>
                      </Link>

                    {/* WhatsApp */}
                    <Link href={"https://wa.me/966598377921"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center cursor-pointer hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200">
                          <i className="fa-brands fa-whatsapp text-white text-sm"></i>
                        </div>
                      </Link>

                        {/* Gmail */}
                        <Link href={"mailto:support@eldelta-group.com"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200">
                          <i className="fa-brands fa-google-plus-g text-white"></i>
                        </div>
                      </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 - Page Links (Middle) */}
            <div className="md:order-2">
              <h3
                className="text-xl font-bold text-[var(--color-primary)] mb-6"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? "روابط الصفحة" : "Page Links"}
              </h3>

              <div className="space-y-3 flex gap-4">
                <Link
                  href="/"
                  className=" text-gray-700 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-200 underline"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "الرئيسية" : "Home"}
                </Link>

                <Link
                  href="/about-us"
                  className=" text-gray-700 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-200 underline"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "من نحن" : "About Us"}
                </Link>

                <Link
                  href="/contact-us"
                  className=" text-gray-700 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-200 underline"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "تواصل معنا" : "Contact Us"}
                </Link>
                <Link
                  href="/services"
                  className=" text-gray-700 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-200 underline"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "خدماتنا" : "Our Services"}
                </Link>
              </div>
            </div>
            {/* Column 3 - Company Branding (Left) */}
            <div className="md:order-1 ">
              <div className="flex items-center space-x-0 rtl:space-x-reverse gap-2">
                {/* Company Logo - Using Next.js Image component */}
                <Image
                  src={componylogo}
                  alt={
                    isRTL
                      ? "شعار الدلتا للإستيراد والتصدير"
                      : "El Delta for Import and Export Logo"
                  }
                  width={64} // Adjust width as needed
                  height={64} // Adjust height as needed
                  className="flex-shrink-0 border-4 border-[var(--color-primary)] rounded-full"
                />

                {/* Company Info */}
                <div className="flex-1">
                  <h2
                    className="text-lg font-bold text-gray-300 dark:text-gray-900 mb-2"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <span className="text-[var(--color-primary)] text-2xl">
                      {" "}
                      {isRTL ? "الدلتـــــــــا" : "Delta"}
                    </span>{" "}
                    {isRTL
                      ? "للإستيراد والتصدير"
                      : "El Delta for Import and Export"}
                  </h2>

                  <p
                    className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "شريكك الموثوق في التوريد والشحن العالمي"
                      : "Your trusted partner in global supply and shipping"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - Above the line */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4">
          <div className="text-center">
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL
                ? "جميع الحقوق محفوظة لشركة الدلتا للإستيراد والتصدير © 2025"
                : "All rights reserved to El Delta for Import and Export Company © 2025"}
            </p>
          </div>
        </div>
        {/* Developer Info */}
        <div className="shadow-2xl rounded-lg px-4 py-3 ">
          <div className="text-center">
            <h4
              className="text-xl font-bold text-gray-300 dark:text-gray-900 mb-1"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "تطوير شركة " : "Developed by Company"}
              <span className="text-teal-600">{isRTL ? "رؤية" : "Ru'ya "}</span>
            </h4>

            <p
              className="text-xs text-gray-600 dark:text-gray-400 mb-2"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "للخدمات البرمجية" : "for Software Services"}
            </p>

            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              {/* Email */}
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  khedr.farrag@gmail.com
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  +20 1090259510
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
