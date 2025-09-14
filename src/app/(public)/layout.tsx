"use client";
import { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { VisitorNav } from "@/components/shared/Navigation";
import AnimatedThemeToggle from "@/components/shared/Navigation/AnimatedThemeToggle";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["visitor"]} redirectTo="/login">
      <div className="min-h-screen">
        {/* Header */}
        <VisitorNav />
        {/* Animated Theme Toggle - global for public pages */}
        <AnimatedThemeToggle />
        {/* Main Content */}
        <main className="pt-20">{children}</main>
        {/* Footer */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
