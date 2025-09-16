import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import imgman from "../../../../public/images/whychoosUs/ExperianseMan.svg";
import imgmap from "../../../../public/images/whychoosUs/maping.svg";
import imgcompony from "../../../../public/images/whychoosUs/eldita.svg";
// Use public path string instead of static import to avoid Netlify image optimization issues
import imgship from "../../../../public/images/whychoosUs/imgship.svg";

export default function WhyChoooseUS() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // FAQ Data - Static for now, will be dynamic later
  const faqData = [
    {
      id: 1,
      question: isRTL
        ? "كيف أبدأ عملية الشحن أو الاستيراد؟"
        : "How do I start the shipping or import process?",
      answer: isRTL
        ? "يمكنك البدء بسهولة من خلال التواصل معنا عبر الموقع أو الهاتف. سنقوم بتقييم احتياجاتك وتقديم خطة شاملة تناسب مشروعك."
        : "You can start easily by contacting us through the website or phone. We will assess your needs and provide a comprehensive plan that suits your project.",
    },
    {
      id: 2,
      question: isRTL
        ? "هل أستطيع الاستيراد بكميات صغيرة؟"
        : "Can I import small quantities?",
      answer: isRTL
        ? "نعم، نقدم خدمات الاستيراد لجميع الأحجام من الكميات الصغيرة إلى الحاويات الكاملة. لدينا حلول مرنة تناسب كل حجم عمل."
        : "Yes, we provide import services for all sizes from small quantities to full containers. We have flexible solutions that suit every business size.",
    },
    {
      id: 3,
      question: isRTL ? "من أين يتم الشحن؟" : "From where is shipping done?",
      answer: isRTL
        ? "نعمل مع شبكة واسعة من الموانئ والمطارات حول العالم. نبدأ من المورد مباشرة ونصل إلى وجهتك النهائية بأمان وسرعة."
        : "We work with a wide network of ports and airports around the world. We start directly from the supplier and reach your final destination safely and quickly.",
    },
    {
      id: 4,
      question: isRTL
        ? "هل تشمل خدماتكم التخليص الجمركي؟"
        : "Do your services include customs clearance?",
      answer: isRTL
        ? "نعم، خدماتنا شاملة وتتضمن التخليص الجمركي، إعداد المستندات، المتابعة، والتوصيل حتى باب منزلك أو مكتبك."
        : "Yes, our services are comprehensive and include customs clearance, document preparation, tracking, and delivery to your home or office door.",
    },
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[var(--color-secondary)]"></div>
            <h3
              className="text-[var(--color-secondary)] text-3xl font-bold mx-4"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "لمــــــاذا نحن؟" : "Why Us?"}
            </h3>
            <div className="w-12 h-0.5 bg-[var(--color-secondary)]"></div>
          </div>

          {/* Main Title */}
          <div className="mb-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-300 dark:text-gray-900 mb-2"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL
                ? "كل ما تحتاجه للتجارة...."
                : "Everything you need for trade...."}
            </h1>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)]"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "في مكان واحد" : "in one place"}
            </h2>
          </div>

          {/* Description */}
          <p
            className="text-gray-600 dark:text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed mb-8"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "نقدم حلول استيراد وتصدير متكاملة بخبرة، سرعة، وأمان من المورد حتى وجهتك النهائية."
              : "We provide integrated import and export solutions with expertise, speed, and safety from supplier to your final destination."}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Left Side - 2x2 Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Card 1 - International Coverage */}
              <div className="bg-gradient-to-br from-[var(--color-secondary)]  to-gray-600 drop-shadow-2xl rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-4 ">
                    <Image
                      src={imgmap}
                      alt={isRTL ? "خريطة العالم" : "World Map"}
                      width={300}
                      height={100}
                      className="w-full  object-cover"
                      loading="lazy"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "تغطية دولية مرنة وسريعة"
                      : "International, Flexible & Fast Coverage"}
                  </h3>
                  <p
                    className="text-white/90 text-sm leading-relaxed"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "نشحن إلى مختلف الدول العربية والأجنبية بخطط مرنة تناسب كل مشروع."
                      : "We ship to various Arab and foreign countries with flexible plans that suit every project."}
                  </p>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              </div>

              {/* Card 2 - Company Logo */}
              <div className="   rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center gap-5">
                <div className=" mb-20 flex flex-row items-center gap-3">
                  <Image
                    src={imgcompony}
                    alt={isRTL ? "شعار الدلتا" : "Delta Logo"}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-contain border-4 border-[var(--color-secondary)] rounded-full"
                    loading="lazy"
                    sizes="80px"
                  />
                  <h3
                    className="w-60 text-lg font-bold dark:text-gray-900 text-gray-300 mb-2 "
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <span className="text-[var(--color-primary)] text-2xl">
                      {" "}
                      {isRTL ? "الدلتـــــــــــــــــــــا" : "Delta"}
                    </span>
                    {isRTL
                      ? " للاستيراد والتصدير"
                      : "Delta for Import and Export"}
                  </h3>
                </div>

                <p
                  className=" text-gray-300 dark:text-gray-700 text-lg font-bold "
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL
                    ? "شريكك الموثوق في التوريد والشحن العالمي"
                    : "Your trusted partner in global supply and shipping"}
                </p>
              </div>

              {/* Card 3 - Support & Pricing */}
              <div className=" shadow-2xl rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="mb-4">
                    <div className="w-15 h-15 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                      <i className="fa-regular fa-clock text-2xl"></i>
                    </div>
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "دعم دائم وأسعار تنافسية"
                      : "Continuous Support & Competitive Prices"}
                  </h3>
                  <p
                    className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "نقدم متابعة لحظية، تواصل مباشر وخطط أسعار شفافة بدون مفاجآت."
                      : "We offer real-time tracking, direct communication, and transparent pricing plans without surprises."}
                  </p>
                </div>
                {/* Background Pattern */}
                {/* <div className="absolute bottom-0 left-0 w-32 h-32 dark:bg-teal-500 rounded-full translate-y-16 -translate-x-16"></div> */}
              </div>

              {/* Card 4 - Trusted Expertise */}
              <div className="rounded-2xl p-6 shadow-2xl">
                <div className="mb-4 w-15 h-15 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <i className="fa-regular fa-handshake"></i>
                </div>
                <h3
                  className="text-lg font-bold text-gray-300 dark:text-gray-900 mb-3"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL
                    ? "خبرة موثوقة وعلاقات عالمية"
                    : "Trusted Expertise & Global Relations"}
                </h3>
                <p
                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL
                    ? "نمتلك خبرة ونعمل مع شبكة من الموردين وشركاء شحن حول العالم."
                    : "We have experience and work with a network of suppliers and shipping partners worldwide."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Integrated Solutions Card */}
          <div className="lg:col-span-1">
            <div className=" rounded-2xl p-6  h-full flex flex-col">
              <h3
                className="text-2xl font-bold text-gray-300 dark:text-gray-900 mb-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? "حلول متكاملة" : "Integrated Solutions"}
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL
                  ? "من البحث عن الموردين والتفاوض إلى التخليص الجمركي والتوصيل - كل شيء تحت سقف واحد."
                  : "From supplier search and negotiation to customs clearance and delivery - everything under one roof."}
              </p>
              <div className="rounded-xl overflow-hidden">
                <Image
                  src={imgman}
                  alt={isRTL ? "رجال أعمال" : "Business Men"}
                  width={300}
                  height={200}
                  className="w-full  object-cover"
                  loading="lazy"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="flex items-center justify-center mb-4 gap-2">
            <div className="w-12 h-0.5 bg-[var(--color-secondary)]"></div>
            <h3
              className="text-[var(--color-secondary)] text-3xl font-bold mb-4"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions?"}
            </h3>
            <div className="w-12 h-0.5 bg-[var(--color-secondary)]"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Person Image */}
            <div className="lg:col-span-1">
              <div className="relative rounded-2xl ps-12 pe-12">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded"></div>
                  <div className="absolute top-12 left-12 w-6 h-6 border-2 border-white rounded"></div>
                  <div className="absolute bottom-8 right-8 w-10 h-10 border-2 border-white rounded"></div>
                  <div className="absolute bottom-16 right-16 w-4 h-4 border-2 border-white rounded"></div>
                </div>
                {/* Main Person Image */}
                <div className="relative z-10">
                  <Image
                    src={"/images/whychoosUs/imgGirl.png"}
                    alt={isRTL ? "خبير تجاري" : "Business Expert"}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    sizes="(max-width:768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Middle Column - Text Content */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {/* Top Section - Title and Description */}
                <div className=" rounded-2xl p-6 shadow">
                  <h2
                    className="text-5xl leading-15 font-bold mb-4 text-center"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <span className="text-gray-300 dark:text-gray-900">
                      {isRTL ? "كل ما تحتاج " : "Everything you need"}
                    </span>
                    <span className="text-[var(--color-secondary)]">
                      {isRTL ? "معرفته" : "to know"}
                    </span>
                    <br />
                    <span className="text-gray-300 dark:text-gray-900 ">
                      {isRTL ? "قبل أن " : "before you"}
                    </span>
                    <span className="text-[var(--color-secondary)] ">
                      {isRTL ? "تبدأ" : "start"}
                    </span>
                  </h2>
                  <p
                    className="text-center max-w-[400px] m-auto text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL
                      ? "أجبنا لك على أكثر الأسئلة التي نسمعها من عملائنا لنساعدك في اتخاذ القرار الصحيح."
                      : "We have answered the most common questions we hear from our customers to help you make the right decision."}
                  </p>
                </div>

                {/* Bottom Section - Ship Image */}
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src={imgship}
                    alt={isRTL ? "سفينة شحن" : "Cargo ship"}
                    width={400}
                    height={250}
                    className="w-full h-48 md:h-64 object-cover"
                    loading="lazy"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - FAQ */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* <h3
                  className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                </h3> */}

                {faqData.map((faq) => (
                  <div
                    key={faq.id}
                    className=" rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="  w-full p-6 text-left flex items-center justify-between dark:hover:bg-[var(--color-secondary)] cursor-pointer transition-colors duration-300"
                    >
                      <h4
                        className="text-lg font-semibold text-gray-300 dark:text-gray-900 pr-4"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        {faq.question}
                      </h4>
                      <svg
                        className={`w-5 h-5 text-gray-300 dark:text-gray-900 transition-transform duration-300 ${
                          openFAQ === faq.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openFAQ === faq.id && (
                      <div className="px-6 pb-6">
                        <p
                          className="text-gray-600 dark:text-gray-400 leading-relaxed"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* CTA Button */}
              {/* <Link
                href={isRTL ? "/contact-us" : "/contact-us"}
                className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-white bg-[var(--color-secondary)] text-sm sm:text-base shadow hover:opacity-90  dark:hover:bg-[var(--color-secondary)] transition mt-5"
              >
                {isRTL ? "أسال أكثر" : "Learn More"}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full dark:bg-gray-300 dark:text-gray-900  ">
                  <svg
                    className="w-3 h-3 text-[var(--color-secondary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              </Link> */}
              <div className="max-w-[160px]  inline-flex mt-5">
                <Link
                  href={isRTL ? "/contact-us" : "/contact-us"}
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
          </div>
        </div>
      </div>
    </section>
  );
}
