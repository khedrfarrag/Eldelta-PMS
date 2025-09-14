"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  dir?: "rtl" | "ltr";
  children: React.ReactNode;
};

export default function FiltersSheet({ open, onClose, title = "الفلاتر", dir = "rtl", children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:w-96 md:right-auto bg-white rounded-t-2xl md:rounded-none md:rounded-r-2xl shadow-xl p-4 overflow-auto" dir={dir}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} aria-label={dir === 'rtl' ? 'إغلاق' : 'Close'} className="text-gray-600 hover:text-gray-800">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
