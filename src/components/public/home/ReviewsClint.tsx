import React from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ReviewsClint() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Static data - will be replaced with API data later
  const reviewsData = [
    {
      id: 1,
      name: isRTL ? "حسن" : "Hassan",
      country: isRTL ? "مصر" : "Egypt",
      review: isRTL
        ? "خدمة متكاملة جداً من أول البحث عن المورد إلى استلام البضائع - شكراً من القلب."
        : "Very comprehensive service from supplier search to goods receipt - thank you from the heart.",
      rating: 5,
      avatar: "/images/reviews/avatar1.jpg",
    },
    {
      id: 2,
      name: isRTL ? "أحمد يوسف" : "Ahmed Youssef",
      country: isRTL ? "مصر" : "Egypt",
      review: isRTL
        ? "خدمة ممتازة وسريعة جداً! تم توصيل شحنتي في الوقت المحدد وباحترافية عالية."
        : "Excellent and very fast service! My shipment was delivered on time with high professionalism.",
      rating: 5,
      avatar: "/images/reviews/avatar2.jpg",
    },
    {
      id: 3,
      name: isRTL ? "مصطفى رضا" : "Mostafa Reda",
      country: isRTL ? "مصر" : "Egypt",
      review: isRTL
        ? "فريقكم دائماً متاح ومستجيب. شكراً لكم على الخدمة المتميزة والاهتمام بالتفاصيل."
        : "Your team is always available and responsive. Thank you for the excellent service and attention to detail.",
      rating: 5,
      avatar: "/images/reviews/avatar3.jpg",
    },
    {
      id: 4,
      name: isRTL ? "سارة محمد" : "Sara Mohamed",
      country: isRTL ? "السعودية" : "Saudi Arabia",
      review: isRTL
        ? "تجربة رائعة مع الدلتا. الأسعار تنافسية والخدمة سريعة. أنصح الجميع بالتعامل معهم."
        : "Amazing experience with Delta. Competitive prices and fast service. I recommend everyone to deal with them.",
      rating: 5,
      avatar: "/images/reviews/avatar4.jpg",
    },
    {
      id: 5,
      name: isRTL ? "علي أحمد" : "Ali Ahmed",
      country: isRTL ? "الإمارات" : "UAE",
      review: isRTL
        ? "خدمة احترافية جداً. تم التعامل مع جميع الإجراءات الجمركية بسهولة ويسر."
        : "Very professional service. All customs procedures were handled easily and smoothly.",
      rating: 5,
      avatar: "/images/reviews/avatar5.jpg",
    },
    {
      id: 6,
      name: isRTL ? "فاطمة علي" : "Fatima Ali",
      country: isRTL ? "الكويت" : "Kuwait",
      review: isRTL
        ? "شكراً لكم على المتابعة المستمرة والتواصل الدائم. خدمة تستحق التقدير."
        : "Thank you for continuous follow-up and constant communication. Service worth appreciation.",
      rating: 5,
      avatar: "/images/reviews/avatar6.jpg",
    },
  ];

  // Split reviews into two rows
  const splitReviews = (reviews: typeof reviewsData) => {
    const total = reviews.length;
    if (total <= 2) {
      return { topRow: reviews, bottomRow: [] };
    }

    const mid = Math.ceil(total / 2);
    return {
      topRow: reviews.slice(0, mid),
      bottomRow: reviews.slice(mid),
    };
  };

  const { topRow, bottomRow } = splitReviews(reviewsData);

  // Duplicate reviews for seamless animation
  const duplicatedTopRow = [...topRow, ...topRow];
  const duplicatedBottomRow = [...bottomRow, ...bottomRow];

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12 transition-colors duration-300 h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Subtitle */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-[var(--color-primary)]"></div>
            <h3
              className="text-[var(--color-primary)] text-3xl font-bold mx-4"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "آراء عملائنا" : "Our Customers' Opinions"}
            </h3>
            <div className="w-12 h-0.5 bg-[var(--color-primary)]"></div>
          </div>

          {/* Main Title */}
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-300 dark:text-gray-900 mb-6"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "ماذا يقول عملاؤنا عن تجربتهم معنا؟"
              : "What do our customers say about their experience with us?"}
          </h2>

          {/* Description */}
          <p
            className="text-gray-600 dark:text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {isRTL
              ? "نفتخر بثقة المئات من العملاء حول العالم الذين جربوا خدماتنا وشاركوا رأيهم بكل شفافية"
              : "We are proud of the trust of hundreds of customers around the world who have tried our services and shared their opinions with full transparency"}
          </p>
        </div>

        {/* Animated Cards Section */}
        <div className="space-y-8">
          {/* Top Row - Moving Left */}
          <div className="overflow-hidden relative h-50">
            <div className="absolute top-0 left-0 w-full h-full">
              {duplicatedTopRow.map((review, index) => (
                <div
                  key={`top-${review.id}-${index}`}
                  className="absolute w-80 rounded-2xl p-6 shadow-lg border border-gray-200  bg-[var(--color-primary)] ]  animate-scroll-left"
                  style={{
                    left: `max(calc(320px * ${duplicatedTopRow.length}), 100%)`,
                    animationDelay: `calc(30s / ${duplicatedTopRow.length} * (${duplicatedTopRow.length} - ${index + 1}) * -1)`,
                  }}
                >
                  {/* Card Content Layout */}
                  <div className="flex h-full min-h-[120px]">
                    {/* Left Side - Profile Picture */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-xl">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 flex flex-col justify-between min-h-[120px]">
                      {/* Top - Review Text */}
                      <div className="flex-1 mb-4 min-h-[60px] flex items-start">
                        <p
                          className="text-gray-300 dark:text-gray-900 text-sm leading-relaxed line-clamp-4"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {review.review}
                        </p>
                      </div>

                      {/* Bottom Row - Fixed at bottom */}
                      <div className="flex items-center justify-between mt-auto">
                        {/* Left - Rating */}
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-300 dark:text-gray-900 font-semibold text-sm">
                            {review.rating}
                          </span>
                        </div>

                        {/* Right - Customer Info */}
                        <div className="text-right flex flex-row-reverse gap-3">
                          <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600"></div>
                          <div>
                            <h4 className="font-semibold text-gray-300 dark:text-gray-900 text-sm">
                              {review.name}
                            </h4>
                            <p className="text-xs text-gray-300 dark:text-gray-900">
                              {review.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Moving Right */}
          <div className="overflow-hidden relative h-50">
            <div className="absolute top-0 left-0 w-full h-full">
              {duplicatedBottomRow.map((review, index) => (
                <div
                  key={`bottom-${review.id}-${index}`}
                  className="absolute w-80  rounded-2xl p-6 shadow-lg border border-gray-200 bg-[var(--color-primary)] animate-scroll-right"
                  style={{
                    right: `max(calc(320px * ${duplicatedBottomRow.length}), 100%)`,
                    animationDelay: `calc(30s / ${duplicatedBottomRow.length} * (${duplicatedBottomRow.length} - ${index + 1}) * -1)`,
                  }}
                >
                  {/* Card Content Layout */}
                  <div className="flex h-full min-h-[120px]">
                    {/* Left Side - Profile Picture */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-xl">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 flex flex-col justify-between min-h-[120px]">
                      {/* Top - Review Text */}
                      <div className="flex-1 mb-4 min-h-[60px] flex items-start">
                        <p
                          className="text-gray-300 dark:text-gray-900 text-sm leading-relaxed line-clamp-4"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {review.review}
                        </p>
                      </div>

                      {/* Bottom Row - Fixed at bottom */}
                      <div className="flex items-center justify-between mt-auto">
                        {/* Left - Rating */}
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-300 dark:text-gray-900 font-semibold text-sm">
                            {review.rating}
                          </span>
                        </div>

                        {/* Right - Customer Info */}
                        <div className="text-right flex flex-row-reverse gap-3">
                          <div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-600"></div>
                          <div>
                            <h4 className="font-semibold text-gray-300 dark:text-gray-900 text-sm">
                              {review.name}
                            </h4>
                            <p className="text-xs text-gray-300 dark:text-gray-900">
                              {review.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scrollLeft {
          to {
            left: -320px;
          }
        }

        @keyframes scrollRight {
          to {
            right: -320px;
          }
        }

        .animate-scroll-left {
          animation: scrollLeft 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scrollRight 30s linear infinite;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
