import React, { useState } from 'react';
import { Search, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
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
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import RestaurantFilters from "@/components/restaurants/RestaurantFilters";
import CategoryList from "@/components/restaurants/CategoryList";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image_url?: string;
  rating?: number;
  estimated_preparation_time: number;
  cuisine_type?: string;
  distance?: number;
  menu_items?: MenuItem[];
}

const categories = [
  { id: 'Tout', label: 'Tout', icon: ChefHat },
  { id: 'Congolais', label: 'Congolais', icon: ChefHat },
  { id: 'Fast Food', label: 'Fast Food', icon: ChefHat },
  { id: 'Healthy', label: 'Healthy', icon: ChefHat },
  { id: 'Pizza', label: 'Pizza', icon: ChefHat },
  { id: 'Asiatique', label: 'Asiatique', icon: ChefHat }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants', searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      console.log('Fetching restaurants with filters:', { searchQuery, selectedCategory, priceRange, sortBy });
      
      let query = supabase
        .from('restaurants')
        .select(`
          *,
          menu_items (
            id,
            name,
            price,
            category
          )
        `);

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      if (selectedCategory !== 'Tout') {
        query = query.eq('cuisine_type', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les restaurants",
          variant: "destructive",
        });
        throw error;
      }

      let filteredData = data as Restaurant[];
      if (priceRange !== 'all') {
        filteredData = filteredData.filter(restaurant => {
          const avgPrice = restaurant.menu_items?.reduce((acc, item) => acc + item.price, 0) / (restaurant.menu_items?.length || 1);
          switch(priceRange) {
            case 'low': return avgPrice < 5000;
            case 'medium': return avgPrice >= 5000 && avgPrice <= 15000;
            case 'high': return avgPrice > 15000;
            default: return true;
          }
        });
      }

      return filteredData.sort((a, b) => {
        switch(sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'preparation_time':
            return a.estimated_preparation_time - b.estimated_preparation_time;
          default:
            return 0;
        }
      });
    }
  });

  const handleRestaurantClick = (restaurantId: string) => {
    console.log('Navigating to restaurant:', restaurantId);
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Food Delivery Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Livraison de Repas
            </h2>
            <RestaurantFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
          
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
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

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
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={handleRestaurantClick}
              />
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
