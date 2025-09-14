"use client";
import AboutUs from "@/components/public/home/AboutUs";
import ProductCategories from "@/components/public/home/ProductCategories";
import ServicesList from "@/components/public/home/ServicesList";
import WhyChoooseUS from "@/components/public/home/WhyChoooseUS";
export default function AboutUsPage() {
  return (
    <>
      <section className="mt-20">
        <AboutUs />
        <ServicesList />
        <WhyChoooseUS />
      </section>
    </>
  );
}
