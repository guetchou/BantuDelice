import React, { useState } from 'react';
import { Search, ChevronDown, Clock, Star, MapPin } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  const categories = [
    'Tout',
    'Restaurants',
    'Fast Food',
    'Healthy',
    'Pizza',
    'Asiatique'
  ];

  const restaurants = [
    {
      name: 'Le Bistrot Gourmet',
      image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
      rating: 4.8,
      deliveryTime: '20-30',
      category: 'Français',
      tags: ['Traditionnel', 'Fait maison'],
      distance: '1.2'
    },
    {
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
      rating: 4.6,
      deliveryTime: '25-35',
      category: 'Japonais',
      tags: ['Sushi', 'Frais'],
      distance: '0.8'
    },
    {
      name: 'Veggie Paradise',
      image: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369',
      rating: 4.7,
      deliveryTime: '15-25',
      category: 'Végétarien',
      tags: ['Bio', 'Healthy'],
      distance: '1.5'
    }
  ];

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Food Delivery Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Livraison de Repas</h2>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Rechercher un restaurant ou un plat..."
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-sm"
            />
            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          </div>

          {/* Categories */}
          <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary">
                    {restaurant.distance} km
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4" />
                      <span className="ml-1">{restaurant.deliveryTime} min</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Existing Services */}
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
