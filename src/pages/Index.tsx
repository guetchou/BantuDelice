import HeroSection from "@/components/home/HeroSection";
import EssentialServices from "@/components/home/EssentialServices";
import AdditionalServices from "@/components/home/AdditionalServices";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import SpecializedServices from "@/components/home/SpecializedServices";
import CulturalServices from "@/components/home/CulturalServices";
import MenuList from "@/components/menu/MenuList";
import ServiceList from "@/components/services/ServiceList";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4">
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Notre Menu
          </h2>
          <MenuList />
        </section>
        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nos Services
          </h2>
          <ServiceList />
        </section>
      </div>
      <EssentialServices />
      <AdditionalServices />
      <ProfessionalServices />
      <SpecializedServices />
      <CulturalServices />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;