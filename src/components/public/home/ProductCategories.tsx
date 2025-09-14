import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import imgman from "../../../../public/images/service/manicon.svg";
import imgship from "../../../../public/images/service/shipicon.svg";
import icon1 from "../../../../public/images/service/icon5.svg";
import icon2 from "../../../../public/images/service/laptob.svg";
import icon3 from "../../../../public/images/service/material.svg";
import icon4 from "../../../../public/images/service/biulds.svg";

export default function ProductCategories() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);

  const categories = [
    {
      id: 1,
      name: isRTL ? "المواد الخام" : "Raw Materials",
      icon: icon3,
    },
    {
      id: 2,
      name: isRTL ? "الالكترونيات و التكنولوجيا" : "Electronics & Technology",
      icon: icon2,
    },
    {
      id: 3,
      name: isRTL ? "خطوط الإنتاج" : "Production Lines",
      icon: icon1,
    },
    {
      id: 4,
      name: isRTL ? "مواد البناء" : "Building Materials",
      icon: icon4,
    },
    {
      id: 5,
      name: isRTL ? "المنزل والديكور" : "Home & Decor",
      icon: icon1,
    },
    {
      id: 6,
      name: isRTL ? "الرياضة والهوايات" : "Sports & Hobbies",
      icon: icon2,
    },
    {
      id: 7,
      name: isRTL ? "الملابس والأكسسوارات" : "Clothing & Accessories",
      icon: icon3,
    },
    {
      id: 8,
      name: isRTL ? "مستلزمات صحية وأجهزة طبية" : "Health & Medical Equipment",
      icon: icon4,
    },
    {
      id: 9,
      name: isRTL ? "المواد الغذائية" : "Food Materials",
      icon: icon1,
    },
    {
      id: 10,
      name: isRTL ? "الآلات والمعدات" : "Machinery & Equipment",
      icon: icon2,
    },
    {
      id: 11,
      name: isRTL ? "المنسوجات والجلود" : "Textiles & Leather",
      icon: icon3,
    },
    {
      id: 12,
      name: isRTL ? "المواد الكيميائية" : "Chemical Materials",
      icon: icon4,
    },
  ];

  // Pagination settings
  const itemsPerPage = 4;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentCategories = categories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // 10 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  // Navigation function
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Animation variants
  const pageVariants = {
    enter: { 
      opacity: 0, 
      x: 50, 
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn" as any
      }
    },
    center: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any
      }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn" as any
      }
    }
  };

  const containerVariants = {
    enter: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    center: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as any
      }
    }
  };

  const dotVariants = {
    inactive: { 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut" as any
      }
    },
    active: { 
      scale: 1.25,
      transition: {
        duration: 0.3,
        ease: "easeOut" as any
      }
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12  transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Product Categories */}
          <div className="lg:col-span-1">
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-bold text-[var(--color-secondary)] dark:text-[var(--color-secondary)] mb-6"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL ? "فئات منتجاتنا" : "Our Product Categories"}
            </motion.h3>

            {/* Categories Grid 2x2 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <motion.div
                  variants={containerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="contents"
                >
                  {currentCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-4 rounded-2xl cursor-pointer
                        flex flex-col items-center justify-center text-center min-h-[120px]
                        border border-gray-200 dark:border-gray-700
                        hover:bg-[var(--color-secondary)] hover:shadow-lg hover:shadow-teal-400/50
                      `}
                    >
                      {/* Icon */}
                      <div className="mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-secondary)] border border-gray-200 dark:border-gray-300">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={24}
                            height={24}
                            priority
                            fetchPriority="high"
                            loading="eager"
                            className="w-6 h-6"
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        className="text-sm font-bold text-gray-300 dark:text-gray-900"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        {category.name}
                      </h4>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <motion.button
                  key={index}
                  variants={dotVariants}
                  animate={index === currentPage ? "active" : "inactive"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToPage(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPage
                      ? 'bg-[var(--color-secondary)]'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-1">
            {/* Main Title */}
            <h2
              className="text-3xl md:text-5xl font-bold text-gray-300 dark:text-gray-900 mb-6"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL
                ? "منتجات"
                : "Diverse products suitable for every market"}
                <span className="text-[var(--color-secondary)]">
                  {isRTL ? " متنوعة" : "Diverse"}
                </span>
                <span className="">
                  {isRTL ? " تناسب" : "suitable"}
                </span>
                <span className="">
                  {isRTL ? " كل سوق" : "every market"}
                </span>
            </h2>

            {/* Description */}
            <p
              className="text-gray-300 dark:text-gray-500 text-lg leading-relaxed mb-8"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {isRTL
                ? "تلبي احتياجات الاستيراد والتصدير في قطاعات متعددة بخبرة ومرونة."
                : "Meets import and export needs in multiple sectors with experience and flexibility."}
            </p>

            {/* Ship Image */}
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

          {/* Right Column - Personal Panel */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl p-8 h-full min-h-[500px] flex flex-col items-center justify-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 dark:border-b-cyan-400 rounded"></div>
                <div className="absolute top-12 left-12 w-6 h-6 border-2 dark:border-b-cyan-400 rounded"></div>
                <div className="absolute bottom-0 right-5 w-10 h-10 border-2 dark:border-b-cyan-400 rounded"></div>
                <div className="absolute bottom-10 right-20 w-4 h-4 border-2 dark:border-b-cyan-400 rounded"></div>
              </div>
              {/* Main Person Image */}
              <div className="relative z-10">
                <Image
                  src={imgman}
                  alt={isRTL ? "خبير تجاري" : "Business Expert"}
                  width={200}
                  height={100}
                  className=" w-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
