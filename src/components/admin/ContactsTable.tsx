"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactsTable() {
  const { language } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement contacts fetching
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ar' ? 'رسائل التواصل' : 'Contact Messages'}
        </h2>
        <div className="text-gray-500 dark:text-gray-400">
          {language === 'ar' ? 'لا توجد رسائل تواصل حالياً' : 'No contact messages available'}
        </div>
      </div>
    </div>
  );
}
