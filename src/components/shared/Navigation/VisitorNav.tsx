"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function VisitorNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRTL = language === "ar";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: isRTL ? "الرئيسية" : "Home" },
    { href: "/about-us", label: isRTL ? "من نحن" : "About Us" },
    { href: "/contact-us", label: isRTL ? "تواصل معنا" : "Contact Us" },
    { href: "/services", label: isRTL ? "خدماتنا" : "Our Services" },
  ];
  // Smooth navbar animation on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // ?i have to add this classname moving duration 1000ms smoothly?
    <nav
      className={`fixed z-50 h-20  transition-all duration-900 ease-in-out bg-gray-900 ${
        isScrolled
          ? "top-0 left-0 right-0 w-full shadow-2xl "
          : "top-5 left-2 right-2 w-auto rounded-3xl"
      }`}
    >
      <div className="w-full h-full px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Right Side - Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Logo Icon - Dark Blue Circle with Ship Icon */}
              <div className="border-3 border-[var(--color-secondary)] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gray-800 dark:bg-gray-700 transition-colors duration-300">
                <Image
                  src="/images/Nav/eldita.svg"
                  alt="Eldilta Logo"
                  width={40}
                  height={40}
                  priority
                  fetchPriority="high"
                />
              </div>

              {/* Company Name - Two Lines */}
              <div className="text-right">
                <h1 className="text-sm md:text-lg font-bold leading-tight text-gray-800 dark:text-white transition-colors duration-300">
                  <div className="text-[var(--color-primary)]">
                    {isRTL ? "الدلتا" : "Delta"}
                  </div>
                  <div className="text-xs md:text-sm font-normal text-gray-300 transition-colors duration-300">
                    {isRTL ? "للإستيراد والتصدير" : "Import & Export"}
                  </div>
                </h1>
              </div>

              {/* Separator Line - Hidden on mobile */}
              <div className="hidden md:block w-px h-8 bg-gray-600 dark:bg-gray-400 transition-colors duration-300"></div>
            </div>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium  hover:text-[var(--color-primary)] transition-all duration-1000 ${
                  pathname === link.href
                    ? "text-[var(--color-secondary)]"
                    : "text-gray-300 "
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Left Side - Theme/Language Toggles and Action Button */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Theme and Language Toggles - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <LanguageToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden  ">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 cursor-pointer   transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                // ""
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 z-40" onClick={closeMobileMenu} />

          {/* Mobile Menu Content */}
          <div
            className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-colors duration-300
             ${isScrolled ? "rounded-none" : "rounded-2xl"}
      
            `}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-3 text-base font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg ${
                    pathname === link.href
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Theme and Language Toggles */}
              <div className="flex items-center justify-center space-x-50 pt-3 border-t border-gray-300 ">
                {/* <ThemeToggle /> */}
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
