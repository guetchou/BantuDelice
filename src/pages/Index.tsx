import HeroSection from "@/components/home/HeroSection";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import EssentialServices from "@/components/home/EssentialServices";
import AdditionalServices from "@/components/home/AdditionalServices";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import SpecializedServices from "@/components/home/SpecializedServices";
import CulturalServices from "@/components/home/CulturalServices";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="space-y-16">
        <FeaturedCarousel />
        <EssentialServices />
        <div className="bg-gray-50">
          <AdditionalServices />
          <ProfessionalServices />
        </div>
        <SpecializedServices />
        <div className="bg-gray-50">
          <CulturalServices />
        </div>
        <Testimonials />
        <Newsletter />
      </div>
      <Footer />
    </main>
  );
};

export default Index;