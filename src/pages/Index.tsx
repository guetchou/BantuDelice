import { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RestaurantCarousel from "@/components/home/RestaurantCarousel";
import AdditionalServices from "@/components/home/AdditionalServices";
import Testimonials from "@/components/home/Testimonials";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Phone } from "lucide-react";
import LiveChat from "@/components/chat/LiveChat";
import AIChat from "@/components/chat/AIChat";
import { useNavigation } from '@/contexts/NavigationContext';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const { navigateTo } = useNavigation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden pt-16">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-gray-900/80 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Découvrez la Cuisine<br />
            <span className="text-gradient bg-gradient-to-r from-orange-400 to-green-400">
              Congolaise Authentique
            </span>
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl w-full mx-auto relative animate-fade-in delay-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un plat, un service..."
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500
                         transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4 mt-8 animate-fade-in delay-200">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Commander
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Nos Services
            </Button>
          </div>
        </div>
      </section>

      {/* Restaurant Carousel */}
      <section className="py-16 container mx-auto px-4">
        <RestaurantCarousel />
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
        <AdditionalServices />
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Testimonials />
      </section>

      {/* Chat Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Chat avec un Assistant IA</h3>
              <AIChat />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Chat en Direct</h3>
              <LiveChat />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Besoin d'aide ?</h3>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => window.location.href = 'tel:+123456789'}
              >
                <Phone className="w-4 h-4" />
                Appeler le Service Client
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigateTo('/contact')}
              >
                <MessageCircle className="w-4 h-4" />
                Nous Contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}