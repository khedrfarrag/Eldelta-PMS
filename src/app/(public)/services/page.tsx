"use client";
import ProductCategories from "@/components/public/home/ProductCategories";
import ServicesList from "@/components/public/home/ServicesList";
export default function ServicesPage() {
  return (
    <section className="w-full transition-colors duration-300">
      <div className="space-y-10">
        {/* Services grid */}
        <ServicesList />
        {/* Category shortcuts */}
        <ProductCategories />
      </div>
    </section>
  );
}
