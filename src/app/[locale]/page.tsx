"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PublicHomePage from "@/app/(public)/page";
import { VisitorNav } from "@/components/shared/Navigation";
import Footer from "@/components/layout/Footer";
export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect authenticated users to their dashboard
        if (user.role === "super_admin") {
          router.push("/super-admin/dashboard");
        } else if (user.role === "admin") {
          router.push("/admin/dashboard");
        }
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }
  // If not authenticated, show public homepage content directly
  if (!isAuthenticated) {
    return (
      <>
        <VisitorNav />
        <PublicHomePage />
        <Footer />
      </>
    );
  }

  // This should not render if redirects work properly
  return null;
}
