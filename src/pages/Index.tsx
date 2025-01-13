import React, { useState } from 'react';
import { Search, ChevronDown, Clock, Star, MapPin } from 'lucide-react';
import HeroSection from "@/components/home/HeroSection";
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
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Livraison de Repas</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un restaurant ou un plat..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Categories */}
            <div className="flex space-x-4 overflow-x-auto py-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[#2ECC71] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.name}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-black">{restaurant.name}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-[#FF9800]" />
                      <span className="ml-1">{restaurant.rating}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4" />
                      <span className="ml-1">{restaurant.deliveryTime} min</span>
                      <span className="mx-2">•</span>
                      <span>{restaurant.distance} km</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {restaurant.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
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
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;