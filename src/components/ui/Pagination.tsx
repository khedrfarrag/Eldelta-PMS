"use client";

import React from "react";

type Props = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  dir?: "rtl" | "ltr";
};

function getRange(current: number, totalPages: number) {
  const delta = 1;
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < totalPages - 1) range.push("...");
  if (totalPages > 1) range.push(totalPages);
  return range;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  dir = "rtl",
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clamped = Math.min(Math.max(1, currentPage), totalPages);
  const range = getRange(clamped, totalPages);

  const start = totalCount === 0 ? 0 : (clamped - 1) * pageSize + 1;
  const end = Math.min(clamped * pageSize, totalCount);

  return (
    <div className=" px-4 py-3 flex items-center justify-between" dir={dir}>
      <span className="text-sm dark:text-gray-900 text-gray-300 ">
        {dir === "rtl"
          ? `عرض ${start} إلى ${end} من ${totalCount} نتيجة`
          : `Showing ${start} to ${end} of ${totalCount} results`}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, clamped - 1))}
          disabled={clamped <= 1}
          className="cursor-pointer px-2 h-8 rounded-md bg-white border border-gray-300 text-gray-800 disabled:opacity-50"
          aria-label={dir === "rtl" ? "السابق" : "Previous"}
        >
          {dir === "rtl" ? "‹" : "‹"}
        </button>
        {range.map((p, idx) =>
          typeof p === "number" ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`cursor-pointer px-3 h-8 rounded-md border ${
                p === clamped
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
              }`}
            >
              {p}
            </button>
          ) : (
            <span
              key={idx}
              className="px-2 h-8 inline-flex items-center text-gray-500"
            >
              …
            </span>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, clamped + 1))}
          disabled={clamped >= totalPages}
          className="cursor-pointer px-2 h-8 rounded-md bg-white border border-gray-300 text-gray-800 disabled:opacity-50"
          aria-label={dir === "rtl" ? "التالي" : "Next"}
        >
          {dir === "rtl" ? "›" : "›"}
        </button>
      </div>
    </div>
  );
}
