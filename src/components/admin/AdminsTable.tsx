"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminsTable() {
  const { language } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement admins fetching
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading admins...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'قائمة المدراء' : 'Admins List'}
        </h2>
        <div className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'لا توجد بيانات مدراء حالياً' : 'No admins data available'}
        </div>
      </div>
    </div>
  );
}
