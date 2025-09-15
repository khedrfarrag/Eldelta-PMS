"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedThemeToggle from "@/components/shared/Navigation/AnimatedThemeToggle";
// import mobileheroimg from "../../../../public/images/homepage/homeMobile.png";

export default function Hero() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <section className="w-full pt-20 md:px-0 mt-5  transition-colors duration-300">
      {/* Visual container with image and overlays */}
      <div className="relative w-full min-h-[calc(100svh-80px)] md:min-h-[calc(120svh-10px)] overflow-hidden transition-colors duration-300">
        {/* Hero image fills container */}
        {/* Mobile image */}
        <Image
          src={"/images/homepage/homeMobile.png"}
          alt={isRTL ? "سفينة شحن" : "Cargo ship"}
          fill
          priority
          fetchPriority="high"
          placeholder="empty"
          className=" md:hidden "
          sizes="100vw"
        />

        {/* Desktop image */}
        <Image
          src="/images/homepage/home.svg"
          alt={isRTL ? "سفينة شحن" : "Cargo ship"}
          fill
          priority
          fetchPriority="high"
          placeholder="empty"
          className="object-cover hidden md:block"
          sizes="100vw"
        />

        {/* Mobile-only gradient to improve headline contrast */}
        <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-black/35 to-transparent md:hidden" />

        {/* Headline block */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 ms-3 md:top-0 md:right-5 md:translate-y-0  z-10 pr-1">
          <h1
            className={`leading-snug  text-2xl sm:text-3xl text-center  ${
              isRTL
                ? "md:text-4xl lg:text-5xl md:max-w-[18ch] text-right font-extrabold"
                : "md:text-3xl lg:text-4xl md:max-w-[18ch] text-left font-bold md:translate-x-6  "
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL ? (
              <>
                {/* Mobile: single line centered */}
                <span className=" md:hidden inline-block dark:text-gray-300 text-center ">
                  نربط تجارتك بالعالم…
                  <span className="text-[var(--color-primary)] "> تصدير</span>&
                  <span className="text-[var(--color-primary)]"> استيراد</span>
                  بسهولة وأمان
                </span>
                {/* Desktop: multiline as before */}
                <span className="hidden md:inline">
                  نربط تجارتك بالعالم…
                  <br />
                  <span className="text-[var(--color-primary)]">تصدير</span> و
                  <span className="text-[var(--color-primary)]">استيراد</span>
                  <br />
                  بسهولة وأمان
                </span>
              </>
            ) : (
              <>
                {/* Mobile: single line centered */}
                <span className="md:hidden inline-block dark:text-gray-300 text-center">
                  We connect your business to the world…
                  <span className="text-[var(--color-primary)]">
                    {" "}
                    Export
                  </span>{" "}
                  &
                  <span className="text-[var(--color-primary)]">
                    {" "}
                    Import{" "}
                  </span>{" "}
                  <span className="">with ease and safety</span>
                </span>
                {/* Desktop: multiline as before */}
                <span className="hidden md:inline ">
                  We connect your
                  <br />
                  business to the world…
                  <br />
                  <span className="text-[var(--color-primary)]">
                    Export
                  </span>{" "}
                  &
                  <span className="text-[var(--color-primary)]">
                    {" "}
                    Import
                  </span>
                  <br />
                  <span className="ml-7">with ease and safety</span>
                </span>
              </>
            )}
          </h1>

          {/* Mobile-only description below headline */}
          <p className="md:hidden mt-3 text-white/80 text-sm leading-relaxed font-light max-w-[50ch] m-auto text-center ">
            {isRTL
              ? "نقدّم لك حلول استيراد وتصدير متكاملة تشمل الشحن، التخليص، التوصيل وخدمات الموردين… بخبرة موثوقة وأسعار تنافسية."
              : "We provide end‑to‑end import and export solutions including shipping, clearance, delivery, and supplier services — with trusted experience and competitive prices."}
          </p>
        </div>

        {/* Description card */}
        {/* Desktop description card at bottom-left */}
        <div
          className="hidden md:block absolute bottom-30 left-0 max-w-[500px] z-10"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="p-6">
            <p className=" text-xl leading-relaxed font-bold ">
              {isRTL
                ? "نقدّم لك حلول استيراد وتصدير متكاملة تشمل الشحن، التخليص، التوصيل وخدمات الموردين… بخبرة موثوقة وأسعار تنافسية."
                : "We provide end‑to‑end import and export solutions including shipping, clearance, delivery, and supplier services — with trusted experience and competitive prices."}
            </p>
          </div>
        </div>
        <div className="block md:block md:mt-4 absolute left-4 md:left-5 bottom-6 md:bottom-5 z-10">
          {/* Action Button - Dark Blue with White Text and Arrow */}
          <button className="px-3 py-2 md:px-6 md:py-3 rounded-full md:rounded-4xl font-medium transition-colors flex items-center space-x-1 md:space-x-2 hover:opacity-80 cursor-pointer bg-[var(--color-primary)]">
            <span className="text-white text-xs md:text-sm   ">
              {isRTL ? "إبدأ الآن" : "Start Now"}
            </span>
            <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 md:w-3 md:h-3 text-gray-800 dark:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Animated Theme Toggle */}
      <AnimatedThemeToggle />

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8 rounded-3xl p-6 md:p-8 shadow-sm text-center transition-colors duration-300">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-gray-900">
            4.8
          </div>
          <div
            className="text-xs md:text-sm text-gray-300 dark:text-gray-900 mt-1"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL ? "تقييم المستخدم" : "User rating"}
          </div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-gray-900 ">
            +60K
          </div>
          <div
            className="text-xs md:text-sm text-gray-300 dark:text-gray-900  mt-1"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL ? "ثقة ناجحة" : "Successful trust"}
          </div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-gray-900 ">
            90%
          </div>
          <div
            className="text-xs md:text-sm text-gray-300 dark:text-gray-900  mt-1"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL ? "مستخدمون سعداء" : "Happy users"}
          </div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-300 dark:text-gray-900 ">
            +10K
          </div>
          <div
            className="text-xs md:text-sm text-gray-300 dark:text-gray-900  mt-1"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL ? "مستخدم حول العالم" : "Users worldwide"}
          </div>
        </div>
      </div>
      <hr className="" />
    </section>
  );
}
