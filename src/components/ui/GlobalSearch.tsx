"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  className?: string;
};

export default function GlobalSearch({
  value,
  onChange,
  placeholder = "ابحث...",
  dir = "rtl",
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`} dir={dir}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-full border border-gray-300 rounded-lg px-9 sm:px-10 py-2 text-sm sm:text-base focus:outline-none "
        placeholder={placeholder}
      />
      <span className="absolute inset-y-0 right-2 sm:right-3 flex items-center text-gray-400">
        <i className="fa-solid fa-magnifying-glass" />
      </span>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 left-2 flex items-center text-gray-500 hover:text-gray-700"
          aria-label={dir === "rtl" ? "مسح البحث" : "Clear search"}
        >
          ×
        </button>
      )}
    </div>
  );
}
