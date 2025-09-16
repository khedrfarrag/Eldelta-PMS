"use client";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";

export default function AnimatedThemeToggle() {
  const { theme, primaryColor, secondaryColor, toggleTheme, setPrimaryColor, setSecondaryColor } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [panelSide, setPanelSide] = useState<'left' | 'right'>("left");
  const constraintRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [constraints, setConstraints] = useState<{ left: number; right: number; top: number; bottom: number } | null>(null);
  const dragNodeRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

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

  // Initialize position from localStorage and on resize keep relative position
  useEffect(() => {
    const size = 56; // px
    const margin = 16;
    const navTop = 80 + margin; // avoid navbar area
    const hydrate = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const saved = typeof window !== 'undefined' ? localStorage.getItem('themeTogglePos') : null;
      // compute hard constraints so icon never leaves viewport and stays below navbar
      const left = margin;
      const right = vw - size - margin;
      const top = navTop;
      const bottom = vh - size - margin;
      setConstraints({ left, right, top, bottom });
      if (saved) {
        try {
          const { xPct, yPct } = JSON.parse(saved) as { xPct: number; yPct: number };
          const x = Math.min(Math.max(xPct * vw, left), right);
          const y = Math.min(Math.max(yPct * vh, top), bottom);
          setPosition({ x, y });
          setPanelSide(x > vw / 2 ? 'left' : 'right');
          setIsReady(true);
          return;
        } catch {}
      }
      // default near right middle similar to previous design
      const x = Math.min(Math.max(vw - size - 24, left), right); // right-6 ~ 24px
      const y = Math.min(Math.max(vh / 2 - size / 2, top), bottom);
      setPosition({ x, y });
      setPanelSide('left');
      setIsReady(true);
    };
    hydrate();
    const onResize = () => hydrate();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const savePosition = (x: number, y: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const xPct = Math.max(0, Math.min(1, x / vw));
    const yPct = Math.max(0, Math.min(1, y / vh));
    try { localStorage.setItem('themeTogglePos', JSON.stringify({ xPct, yPct })); } catch {}
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsOpen(false);
  };

  const handleDragEnd = (_: any, info: { point: { x: number; y: number } }) => {
    const size = 56;
    const margin = 16;
    const navTop = 80 + margin;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rawX = info.point.x - size / 2;
    const rawY = info.point.y - size / 2;
    const left = margin;
    const right = vw - size - margin;
    const top = navTop;
    const bottom = vh - size - margin;
    let x = Math.min(Math.max(rawX, left), right);
    let y = Math.min(Math.max(rawY, top), bottom);
    const snapThreshold = vw * 0.1;
    if (x < snapThreshold) x = margin;
    if (x > vw - size - snapThreshold) x = vw - size - margin;
    setPanelSide(x > vw / 2 ? 'left' : 'right');
    // animate wrapper to snapped position
    setPosition({ x, y });
    savePosition(x, y);
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleClickToggle = () => {
    if (isDragging) return;
    setIsOpen(!isOpen);
  };

  const resetPosition = () => {
    const size = 56;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = vw - size - 24;
    const y = Math.max(16, Math.min(vh / 2 - size / 2, vh - size - 16));
    setPosition({ x, y });
    setPanelSide('left');
    try { localStorage.removeItem('themeTogglePos'); } catch {}
  };

  if (!isReady || !position) {
    return null;
  }

  return (
    <div ref={constraintRef} className="fixed inset-0 z-50 pointer-events-none">
      <Draggable
        nodeRef={dragNodeRef}
        position={position ? { x: position.x, y: position.y } : undefined}
        onStart={(_, data: any) => {
          dragStartRef.current = { x: data.x, y: data.y };
          setIsDragging(false);
        }}
        onDrag={(_, data: any) => {
          const start = dragStartRef.current;
          if (!start) return;
          const dx = Math.abs(data.x - start.x);
          const dy = Math.abs(data.y - start.y);
          if (!isDragging && (dx > 4 || dy > 4)) {
            setIsDragging(true);
            setIsOpen(false);
          }
        }}
        onStop={(_, data: any) => {
          const size = 56; const margin = 16; const navTop = 80 + margin;
          const vw = window.innerWidth; const vh = window.innerHeight;
          const left = margin; const right = vw - size - margin; const top = navTop; const bottom = vh - size - margin;
          let x = Math.min(Math.max(data.x, left), right);
          let y = Math.min(Math.max(data.y, top), bottom);
          const snapThreshold = vw * 0.1;
          if (x < snapThreshold) x = left;
          if (x > right - snapThreshold) x = right;
          setPanelSide(x > vw / 2 ? 'left' : 'right');
          setPosition({ x, y });
          savePosition(x, y);
          // if it was a click (no real drag), toggle panel
          if (!isDragging) {
            setIsOpen(prev => !prev);
          }
          setTimeout(() => setIsDragging(false), 0);
        }}
        bounds={constraints ? constraints : { left: 16, right: (typeof window !== 'undefined' ? window.innerWidth : 0) - 56 - 16, top: 80 + 16, bottom: (typeof window !== 'undefined' ? window.innerHeight : 0) - 56 - 16 }}
      >
        <div ref={dragNodeRef} className="absolute pointer-events-auto" style={{ willChange: 'transform' }}>
      {/* Main Toggle Button */}
      <motion.button
        // click handled via Draggable onStop when !isDragging
        className="w-14 h-14 rounded-full dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center relative overflow-hidden cursor-grab"
        whileHover={{ scale: 1.0 }}
        whileTap={{ scale: 0.99 }}
        whileDrag={{ cursor: 'grabbing' }}
        animate={{
          boxShadow: isOpen 
            ? `0 0 20px ${primaryColor}40` 
            : "0 4px 12px rgba(0,0,0,0.15)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="  rounded-full"
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
            {/* Backdrop under side panel */}
            <motion.div
              className=" "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel - centered on screen */}
            <motion.div
              className="relative right-100 translate-x-[60%] top-50 translate-y-[-50%]  "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                // Close panel when clicking on backdrop (not on panel content)
                if (e.target === e.currentTarget) {
                  setIsOpen(false);
                }
              }}
            >
              <motion.div
                className="w-[260px] max-w-[90vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, opacity: { duration: 0.15 } }}
                onClick={(e) => e.stopPropagation()}
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
                  <div className="mt-4">
                    <button
                      onClick={resetPosition}
                      className="text-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {isRTL ? 'إعادة تعيين موضع الأيقونة' : 'Reset icon position'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </div>
      </Draggable>
    </div>
  );
}
