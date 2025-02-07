
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import EssentialServices from "@/components/home/EssentialServices";
import AdditionalServices from "@/components/home/AdditionalServices";
import CulturalServices from "@/components/home/CulturalServices";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import TaxiFeature from "@/components/home/TaxiFeature";
import CulinaryEvents from "@/components/home/CulinaryEvents";
import CookingClassesSection from "@/components/home/CookingClassesSection";
import RestaurantPromotions from "@/components/home/RestaurantPromotions";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DeliveryMap from '@/components/DeliveryMap';
import CartDrawer from '@/components/cart/CartDrawer';
import ChatBubble from '@/components/chat/ChatBubble';
import { useState } from 'react';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-gray-900/80 backdrop-blur-sm" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Découvrez la Cuisine<br />
            <span className="text-gradient bg-gradient-to-r from-orange-400 to-green-400">
              Congolaise Authentique
            </span>
          </h1>
          
          <div className="max-w-2xl w-full mx-auto relative animate-fade-in delay-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un plat, un restaurant..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500
                         transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8 animate-fade-in delay-200">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              onClick={() => navigate('/restaurants')}
            >
              Commander
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/services')}
            >
              Nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Essential Services */}
      <EssentialServices />

      {/* Restaurant Promotions */}
      <RestaurantPromotions />

      {/* Culinary Events */}
      <CulinaryEvents />

      {/* Cooking Classes */}
      <CookingClassesSection />

      {/* Additional Services */}
      <TaxiFeature />
      <AdditionalServices />
      <CulturalServices />

      {/* Map Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Notre Zone de Livraison</h2>
        <div className="h-[400px] rounded-lg overflow-hidden shadow-xl">
          <DeliveryMap 
            latitude={-4.4419} 
            longitude={15.2663}
          />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* Cart Drawer */}
      <div className="fixed bottom-4 right-4 z-50">
        <CartDrawer />
      </div>

      {/* Chat Bubble */}
      <div className="fixed bottom-4 left-4 z-50">
        <ChatBubble />
      </div>

      <Footer />
    </main>
  );
}
