"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ReviewsTable() {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement reviews fetching
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'التقييمات' : 'Reviews'}
        </h2>
        <div className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'لا توجد تقييمات حالياً' : 'No reviews available'}
        </div>
      </div>
    </div>
  );
}
