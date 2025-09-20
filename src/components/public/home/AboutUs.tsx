"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutUs() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Team Image with Dark Background */}
          <div className="order-2 md:order-1">
            <div
              className="relative rounded-2xl overflow-hidden h-96"
              // style={{ backgroundColor: "#1A2B40" }}
            >
              <Image
                src="/images/aboutus/pepole.svg"
                alt={isRTL ? "فريق العمل" : "Our Team"}
                fill
                className="object-fill "
                priority
                loading="eager"
                fetchPriority="high"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Middle Column - Mission + Ship Image */}
          <div className="order-3 md:order-2 space-y-6">
            {/* Mission Card */}
            <div className="shadow-2xl rounded-2xl p-6 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-lightbulb text-2xl text-[var(--color-primary)] dark:text-[var(--color-primary)]"></i>
                <h3
                  className="text-xl font-bold text-[var(--color-primary)]  transition-colors duration-300"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "رسالتنا" : "Our Mission"}
                </h3>
              </div>

              <p
                className="text-sm leading-relaxed mb-4 text-gray-300 dark:text-gray-900 transition-colors duration-300"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL
                  ? "تقديم حلول لوجستية ذكية تمكن الأفراد والشركات من التوسع في تجارتهم بكل ثقة."
                  : "Providing smart logistical solutions that enable individuals and companies to expand their trade with confidence."}
              </p>

              {/* Team Photos */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* Ship Image */}
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/aboutus/shipse.svg"
                alt={isRTL ? "الشحن البحري" : "Maritime Shipping"}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
                loading="lazy"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Right Column - About Us + Vision */}
          <div className="order-1 md:order-3 space-y-6">
            {/* About Us Section */}
            <div className="shadow-2xl rounded-2xl p-6 transition-colors duration-300">
              <h4
                className="text-lg font-bold mb-2 text-[var(--color-primary)] dark:text-[var(--color-primary)]"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? "من نحن" : "About Us"}
              </h4>

              <h2
                className="text-2xl font-bold mb-4 text-gray-300 dark:text-gray-900"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL
                  ? "شريكك العالمي في التجارة"
                  : "Your Global Trade Partner"}
              </h2>

              <p
                className="text-sm leading-relaxed mb-4 text-gray-300 dark:text-gray-900"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL
                  ? "تقدم خدمات استيراد وتصدير تساعدك في الوصول للموردين، شحن آمن، وتوصيل سريع... بخبرة موثوقة وأسعار مناسبة."
                  : "We provide import and export services that help you reach suppliers, secure shipping, and fast delivery... with trusted experience and competitive prices."}
              </p>
              <div className="max-w-[160px] inline-flex ">
                <Link
                  href={isRTL ? "/ar/blog" : "/en/blog"}
                  className="px-3 py-2 md:px-6 md:py-3 rounded-full md:rounded-4xl font-medium transition-colors flex items-center space-x-1 md:space-x-2 hover:opacity-80 cursor-pointer bg-[var(--color-secondary)]"
                >
                  <span className="text-white text-xs md:text-sm   ">
                    {isRTL ? "اعرفنا أكثر" : "Learn More"}
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
                </Link>
              </div>
            </div>

            {/* Vision Card */}
            <div className="shadow-2xl rounded-2xl p-6 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-eye text-2xl text-[var(--color-primary)] dark:text-[var(--color-primary)]"></i>
                <h3
                  className="text-xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)]"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "رؤيتنا" : "Our Vision"}
                </h3>
              </div>

              <p
                className="text-sm leading-relaxed text-gray-300 dark:text-gray-900"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL
                  ? "أن نكون الخيار الأول في العالم العربي لكل من يرغب في استيراد أو تصدير بضائع بأمان وسلاسة واحتراف."
                  : "To be the first choice in the Arab world for anyone who wants to import or export goods safely, smoothly and professionally."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
