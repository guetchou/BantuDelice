import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  rating?: number;
  estimated_preparation_time: number;
  cuisine_type?: string;
  distance?: number;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('restaurants')
        .select('*');

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      if (selectedCategory !== 'Tout') {
        query = query.eq('cuisine_type', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les restaurants",
          variant: "destructive",
        });
        throw error;
      }

      return data as Restaurant[];
    }
  });

  const categories = [
    'Tout',
    'Congolais',
    'Fast Food',
    'Healthy',
    'Pizza',
    'Asiatique'
  ];

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Food Delivery Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Livraison de Repas
          </h2>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Rechercher un restaurant ou un plat..."
              className="w-full pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
          </div>

          {/* Categories */}
          <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : restaurants?.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="relative">
                  <img
                    src={restaurant.image_url || 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.distance && (
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary">
                      {restaurant.distance} km
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    {restaurant.rating && (
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 font-medium">{restaurant.rating}</span>
                      </div>
                    )}
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4" />
                      <span className="ml-1">{restaurant.estimated_preparation_time} min</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{restaurant.address}</span>
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