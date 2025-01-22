import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MessageCircle, Bot, ChefHat, Utensils, GasCylinder, Car, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import AIChat from "@/components/chat/AIChat";
import LiveChat from "@/components/chat/LiveChat";
import HeroSection from "@/components/home/HeroSection";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import RestaurantFilters from "@/components/restaurants/RestaurantFilters";
import CategoryList from "@/components/restaurants/CategoryList";
import AdditionalServices from "@/components/home/AdditionalServices";
import EssentialServices from "@/components/home/EssentialServices";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import CulturalServices from "@/components/home/CulturalServices";
import SpecializedServices from "@/components/home/SpecializedServices";

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

interface Category {
  id: string;
  label: string;
  icon: typeof ChefHat;
}

const categories: Category[] = [
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
  const [showChat, setShowChat] = useState(false);
  const [chatType, setChatType] = useState<'live' | 'ai'>('live');
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Buntudelice
              </h1>
              <div className="relative w-96">
                <Input
                  type="text"
                  placeholder="Rechercher un plat congolais..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                    Menu <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/10 backdrop-blur-lg border-white/20">
                  <DropdownMenuItem onClick={() => navigate('/restaurants')} className="text-white hover:bg-white/10">
                    Restaurants
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/services')} className="text-white hover:bg-white/10">
                    Services
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/contact')} className="text-white hover:bg-white/10">
                    Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
            Cuisine Congolaise Authentique
          </h2>
          <RestaurantFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* Categories */}
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div 
                key={index}
                className="glass-card animate-pulse"
              >
                <div className="h-48 bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
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

      {/* Services Sections with Glassmorphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-green-600/10 animate-gradient-x"></div>
        <div className="relative">
          <EssentialServices />
          <AdditionalServices />
          <ProfessionalServices />
          <CulturalServices />
          <SpecializedServices />
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-4">
          {showChat && (
            <div className="w-96 glass-card overflow-hidden">
              <div className="p-4 border-b border-white/20 flex justify-between items-center">
                <h3 className="font-semibold text-white">
                  {chatType === 'live' ? 'Chat en Direct' : 'Assistant IA'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/10"
                >
                  ×
                </Button>
              </div>
              {chatType === 'live' ? <LiveChat /> : <AIChat />}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 floating-button"
              onClick={() => {
                setChatType('ai');
                setShowChat(!showChat);
              }}
            >
              <Bot className="w-6 h-6" />
            </Button>
            <Button
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 floating-button"
              onClick={() => {
                setChatType('live');
                setShowChat(!showChat);
              }}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
