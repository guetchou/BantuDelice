import React, { useState } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AIChat from "@/components/chat/AIChat";
import LiveChat from "@/components/chat/LiveChat";
import HeroSection from "@/components/home/HeroSection";
import RestaurantFilters from "@/components/restaurants/RestaurantFilters";
import Header from "@/components/home/Header";
import CategoryList from "@/components/home/CategoryList";
import RestaurantGrid from "@/components/home/RestaurantGrid";
import AdditionalServices from "@/components/home/AdditionalServices";
import EssentialServices from "@/components/home/EssentialServices";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import CulturalServices from "@/components/home/CulturalServices";
import SpecializedServices from "@/components/home/SpecializedServices";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showChat, setShowChat] = useState(false);
  const [chatType, setChatType] = useState<'live' | 'ai'>('live');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <HeroSection />

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

        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <RestaurantGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          sortBy={sortBy}
        />
      </div>

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