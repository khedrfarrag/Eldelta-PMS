"use client";

import { useEffect, useMemo, useState } from "react";
import { createSiteReview } from "@/lib/api/siteReviews";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  initialName?: string;
  locale?: "ar" | "en";
  className?: string;
  onSubmitted?: () => void;
};

export default function CreateReview({ initialName = "", locale, className = "", onSubmitted }: Props) {
  const { language } = useLanguage?.() || { language: locale || "ar" } as any;
  const activeLocale = useMemo<"ar" | "en">(() => (locale || (language === "ar" ? "ar" : "en")), [locale, language]);
  const isRTL = activeLocale === "ar";

  const [name, setName] = useState(initialName || "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  const labels = {
    title: isRTL ? "قيّم تجربتك معنا" : "Rate your experience",
    subtitle: isRTL ? "ملاحظاتك تساعدنا على التطوير المستمر" : "Your feedback helps us improve",
    name: isRTL ? "الاسم" : "Name",
    rating: isRTL ? "التقييم" : "Rating",
    comment: isRTL ? "تعليقك" : "Comment",
    submit: isRTL ? "إرسال التقييم" : "Submit Review",
    thanksTitle: isRTL ? "تم إرسال تقييمك بنجاح!" : "Your review has been submitted!",
    thanksBody: isRTL ? "شكراً لثقتك — الدلتا للاستيراد والتصدير" : "Thanks for your trust — Eldelta Import & Export",
  };

  const canSubmit = name.trim().length > 0 && comment.trim().length > 0 && rating > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await createSiteReview({ name: name.trim(), rating, comment: comment.trim(), locale: activeLocale });
      setSubmitted(true);
      onSubmitted?.();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`w-full max-w-2xl mx-auto rounded-2xl border border-cyan-200 dark:border-cyan-900/40 bg-white dark:bg-gray-900 p-6 md:p-8 text-center ${className}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <span className="text-green-600 text-3xl">✓</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2">{labels.thanksTitle}</h3>
        <p className="text-gray-600 dark:text-gray-300">{labels.thanksBody}</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-5xl mx-auto rounded-2xl border border-[var(--color-primary)] dark:[var(--color-primary)] bg-transparent p-6 md:p-8 shadow-sm mb-10 shadow-xl bg-gradient-to-br from-[var(--color-secondary)]  to-transparent drop-shadow-2xl  ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-cyan-600">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.519 3.651a1.25 1.25 0 001.04.768l3.957.317c1.164.093 1.64 1.53.75 2.3l-3.01 2.59a1.25 1.25 0 00-.403 1.28l.925 3.837c.273 1.133-.964 2.03-1.96 1.415l-3.38-2.057a1.25 1.25 0 00-1.29 0l-3.38 2.057c-.996.615-2.233-.282-1.96-1.415l.925-3.838a1.25 1.25 0 00-.403-1.279l-3.01-2.59c-.89-.77-.414-2.207.75-2.3l3.957-.318a1.25 1.25 0 001.04-.768l1.519-3.65z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">{labels.title}</h3>
          <p className=" text-gray-300 dark:text-gray-700 text-sm md:text-base">{labels.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-4">
        <div className="col-span-1">
          <label className="block text-sm mb-1">{labels.name}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary)] dark:[var(--color-primary)] bg-transparent outline-none"
            placeholder={isRTL ? "اكتب اسمك" : "Enter your name"}
          />
        </div>
        <div className="col-span-1 ">
          <label className="block text-sm mb-1">{labels.rating}</label>
          <div className="flex items-center gap-2 ">
            {Array.from({ length: 5 }).map((_, i) => {
              const v = i + 1;
              const active = v <= rating;
              return (
                <button
                  key={v}
                  type="button"
                  aria-label={`rating-${v}`}
                  className={`p-1 transition-transform ${loading ? "opacity-50" : "hover:scale-110"}`}
                  onClick={() => setRating(v)}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-7 h-7 ${active ? "text-[var(--color-primary)]" : "text-gray-300 dark:text-gray-600"} cursor-pointer`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.75.75 0 011.04.39l1.56 3.736a.75.75 0 00.61.46l4.052.35a.75.75 0 01.42 1.317l-3.06 2.63a.75.75 0 00-.24.77l.94 3.9a.75.75 0 01-1.12.83l-3.43-2.07a.75.75 0 00-.78 0l-3.43 2.07a.75.75 0 01-1.12-.83l.94-3.9a.75.75 0 00-.24-.77l-3.06-2.63a.75.75 0 01.42-1.318l4.053-.35a.75.75 0 00.61-.46l1.56-3.735a.75.75 0 01.39-.39z" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">{labels.comment}</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
          placeholder={isRTL ? "شاركنا رأيك بكل صراحة" : "Share your honest feedback"}
          className="w-full px-3 py-2 rounded-lg border border-[var(--color-primary)] dark:[var(--color-primary)] bg-transparent outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 cursor-pointer"
        >
          {loading ? (isRTL ? "جاري الإرسال..." : "Submitting...") : labels.submit}
        </button>
      </div>
    </div>
  );
}

