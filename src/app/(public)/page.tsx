import Hero from "@/components/public/home/Hero";
import AboutUs from "@/components/public/home/AboutUs";
import ServicesList from "@/components/public/home/ServicesList";
import ProductCategories from "@/components/public/home/ProductCategories";
import WhyChoooseUS from "@/components/public/home/WhyChoooseUS";
import ReviewsClint from "@/components/public/home/ReviewsClint";
import ContactInfo from "@/components/public/home/ContactInfo";
export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <AboutUs />
      <ServicesList />
      <ProductCategories />
      <WhyChoooseUS />
      <ReviewsClint />
      <ContactInfo />
    </>
  );
}
