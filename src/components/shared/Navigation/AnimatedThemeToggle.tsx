"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedThemeToggle() {
  const { theme, primaryColor, secondaryColor, toggleTheme, setPrimaryColor, setSecondaryColor } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isRTL = language === "ar";

  const colorOptions = [
    {
      value: "#2A7280",
      label: isRTL ? "أزرق رمادي" : "Blue Gray",
      bg: "bg-[#2A7280]",
    },
    {
      value: "#FAA533",
      label: isRTL ? "برتقالي" : "Orange",
      bg: "bg-[#FAA533]",
    },
    {
      value: "#0BA6DF",
      label: isRTL ? "أزرق فاتح" : "Light Blue",
      bg: "bg-[#0BA6DF]",
    },
    {
      value: "#192845",
      label: isRTL ? "أزرق داكن" : "Dark Blue",
      bg: "bg-[#192845]",
    },
  ];

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50" ref={panelRef}>
      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center relative overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? `0 0 20px ${primaryColor}40` 
            : "0 4px 12px rgba(0,0,0,0.15)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: primaryColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Theme icon */}
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === "light" ? (
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m6.638-6.638l.707-.707m6.364-.707l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Animated Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 backdrop-blur-sm -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 min-w-[280px]"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                opacity: { duration: 0.2 }
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {isRTL ? "الإعدادات" : "Settings"}
                </h3>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Theme Toggle Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  {isRTL ? "المظهر" : "Appearance"}
                </h4>
                <motion.button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-900 flex items-center justify-center">
                      {theme === "light" ? (
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m6.638-6.638l.707-.707m6.364-.707l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ms-2">
                      {isRTL ? (theme === "light" ? "الوضع الفاتح" : "الوضع الداكن") : (theme === "light" ? "Light Mode" : "Dark Mode")}
                    </span>
                  </div>
                  <motion.div
                    className="w-10 h-6 rounded-full relative"
                    style={{ backgroundColor: theme === "dark" ? primaryColor : "#e5e7eb" }}
                    animate={{ backgroundColor: theme === "dark" ? primaryColor : "#e5e7eb" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full absolute top-1"
                      animate={{ x: theme === "dark" ? 20 : 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Color Palette Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  {isRTL ? "ألوان الموقع" : "Site Colors"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((color, index) => (
                    <motion.button
                      key={color.value}
                      onClick={() => {
                        setPrimaryColor(color.value as any);
                        setSecondaryColor(color.value as any);
                      }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        primaryColor === color.value
                          ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${color.bg}`}
                          whileHover={{ scale: 1.1 }}
                          animate={{ 
                            boxShadow: primaryColor === color.value 
                              ? `0 0 0 2px ${color.value}40` 
                              : "0 0 0 0px"
                          }}
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {color.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}