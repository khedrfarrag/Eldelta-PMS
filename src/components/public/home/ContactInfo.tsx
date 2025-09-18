import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactsAPI } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// import womanImage from "/public/images/contact/woman.png";
import womanimg from "../../../../public/images/Contact/women.svg";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ContactInfo() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Validation schema
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: isRTL ? "الاسم مطلوب" : "Name is required" }),
    email: z
      .string()
      .trim()
      .email({
        message: isRTL ? "بريد إلكتروني غير صالح" : "Invalid email address",
      }),
    phone: z.string().trim().optional(),
    message: z
      .string()
      .trim()
      .min(10, {
        message: isRTL
          ? "الرسالة يجب أن تكون 10 أحرف على الأقل"
          : "Message must be at least 10 characters",
      }),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // (react-hook-form manages inputs)

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await contactsAPI.send(values);

      toast.success(
        isRTL
          ? "تم إرسال رسالتك بنجاح سنتواصل معك في أسرع وقت"
          : "Your message has been sent successfully we will contact you as soon as possible"
      );
      reset();
    } catch (err: any) {
      const apiError = err?.response?.data?.error;
      setErrorMessage(
        apiError ||
          (isRTL ? "حدث خطأ أثناء الإرسال" : "An error occurred while sending")
      );
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-12  transition-colors duration-300 mt-30">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1 - Contact Form (Right) */}
          <div className="order-3">
            <div className="rounded-2xl p-8 shadow-xl">
              {/* Contact Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errorMessage && (
                  <div
                    className="text-red-600 text-sm"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div
                    className="text-green-600 text-sm"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {successMessage}
                  </div>
                )}
                {/* Name Field - Full Width */}
                <div>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-4 outline-0 border border-[var(--color-primary)] rounded-xl  text-gray-300 dark:text-gray-900 placeholder-[var(--color-primary)] focus:ring-2 focus:ring-teal-500 transition-colors duration-200 text-right"
                    placeholder={isRTL ? "الإسم" : "Name"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  {errors.name && (
                    <p
                      className="text-red-600 text-xs mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email and Phone Fields - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-4 outline-0 border border-[var(--color-primary)] rounded-xl  text-gray-300 dark:text-gray-900 placeholder-[var(--color-primary)] focus:ring-2 focus:ring-teal-500  transition-colors duration-200 text-right"
                      placeholder={isRTL ? "البريد الإلكتروني" : "Email"}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    {errors.email && (
                      <p
                        className="text-red-600 text-xs mt-1"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-4 border border-[var(--color-primary)] rounded-xl  text-gray-300 dark:text-gray-900 placeholder-[var(--color-primary)] outline-0 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200 text-right"
                      placeholder={isRTL ? "رقم الهاتف" : "Phone Number"}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </div>

                {/* Message Field - Full Width */}
                <div>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full px-4 py-4 border border-[var(--color-primary)] rounded-xl  text-gray-300 dark:text-gray-900 placeholder-[var(--color-primary)] outline-0 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200 resize-none text-right"
                    placeholder={isRTL ? "ادخل رسالتك" : "Enter your message"}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  {errors.message && (
                    <p
                      className="text-red-600 text-xs mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full  bg-cyan-950  hover:bg-[var(--color-primary)] cursor-pointer text-white border-1 outline-0 border-[var(--color-primary)] font-semibold py-4 px-6 rounded-xl transition-colors duration-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  dir={isRTL ? "rtl" : "ltr"}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isRTL
                      ? "جاري الإرسال..."
                      : "Sending..."
                    : isRTL
                      ? "إرسال"
                      : "Send"}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2 - Info Panel (Middle) */}
          <div className="order-2">
            <div className="space-y-8">
              {/* Main Title */}
              <div>
                <h1
                  className="text-5xl leading-15 font-bold text-gray-300 dark:text-gray-900 mb-4 text-center max-w-[300px] m-auto "
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL ? "جاهزون للرد على كل " : "Ready to answer all "}
                  <span className="text-[var(--color-primary)]">
                    {isRTL ? "استفساراتك" : "your inquiries"}{" "}
                  </span>
                </h1>

                <p
                  className="text-lg text-center max-w-[400px] m-auto  text-gray-600 dark:text-gray-400 leading-relaxed"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {isRTL
                    ? "سجل بياناتك وأرسل رسالتك، وفريقنا سيهتم بالرد عليك في أسرع وقت."
                    : "Register your details and send your message, and our team will respond to you as soon as possible."}
                </p>
              </div>

              {/* Contact Info Box */}
              <div className="shadow-2xl rounded-2xl p-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-teal-600 dark:text-teal-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <Link href={"mailto:support@eldelta-group.com"}>
                      <span className="text-gray-300 dark:text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-400">
                        support@eldelta-group.com
                      </span>
                    </Link>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-teal-600 dark:text-teal-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <Link href={"tel:+966 59 837 7921"}>
                      <span className="text-gray-300 dark:text-gray-900  hover:text-[var(--color-primary)] transition-colors duration-400">
                        +966 59 837 7921
                      </span>
                    </Link>
                  </div>

                  {/* Social Media */}
                  <div className="pt-4">
                    <p
                      className="text-gray-300 dark:text-gray-600 mb-3 text-sm font-bold"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL
                        ? "ويمكنكم التواصل معنا أيضا أو متابعتنا عبر"
                        : "You can also contact us or follow us via"}
                    </p>

                    <div className="flex space-x-4">
                      {/* Gmail */}

                      {/* Facebook */}
                      <Link
                        href={
                          "https://www.facebook.com/people/DELTA-import-and-export/61578012036477/#"
                        }
                      >
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-200">
                          <i className="fa-brands fa-facebook text-white text-sm"></i>
                        </div>
                      </Link>

                      {/*  */}
                      <Link href={"https://www.instagram.com/delta_import_and_export?igsh=ajFjMmhrbDdrcTI0&utm_source=qr"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 transition-all duration-200">
                          <i className="fa-brands fa-instagram text-white text-sm"></i>
                        </div>
                      </Link>
                      {/* WhatsApp */}
                      <Link href={"https://wa.me/966598377921"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center cursor-pointer hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200">
                          <i className="fa-brands fa-whatsapp text-white text-sm"></i>
                        </div>
                      </Link>

                      <Link href={"mailto:support@eldelta-group.com"}>
                        <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full flex items-center justify-center cursor-pointer hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200">
                          <i className="fa-brands fa-google-plus-g text-white"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 - Visual Panel (Left) */}
          <div className="order-1">
            <div className="relative">
              {/* Teal Background */}
              <div className="rounded-2xl  flex items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
                </div>

                {/* Woman Image */}
                <div className="relative z-10">
                  {/* Form Title */}
                  <h2
                    className="text-3xl text-start max-w-[300px] m-auto font-bold drop-shadow-2xl text-[var(--color-primary)] mb-8 "
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {isRTL ? "تواصل معنا" : "Contact Us"}
                  </h2>
                  <Image
                    src={womanimg}
                    alt={
                      isRTL
                        ? "ممثلة خدمة العملاء"
                        : "Customer Service Representative"
                    }
                    width={200}
                    height={200}
                    priority
                    fetchPriority="high"
                    loading="eager"
                    sizes="(max-width:1024px) 80vw, 25vw"
                    className=" w-full object-cover "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
