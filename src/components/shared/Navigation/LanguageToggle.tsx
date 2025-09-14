"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2  bg-[var(--color-primary)] hover: rounded-lg transition-colors font-medium  shadow-sm text-sm cursor-pointer"
      title={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {language === "en" ? (
        <i className="fa-solid fa-language"></i>
      ) : (
        <i className="fa-solid fa-earth-oceania"></i>
      )}
    </button>
  );
}
