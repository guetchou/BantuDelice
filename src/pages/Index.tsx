import React, { useState } from 'react';
import { Bot, MessageCircle, ChefHat, Cylinder, Car, Coffee, HeartHandshake, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AIChat from "@/components/chat/AIChat";
import LiveChat from "@/components/chat/LiveChat";
import Header from "@/components/home/Header";
import CategoryList from "@/components/home/CategoryList";
import RestaurantGrid from "@/components/home/RestaurantGrid";
import EssentialServices from "@/components/home/EssentialServices";
import AdditionalServices from "@/components/home/AdditionalServices";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import CulturalServices from "@/components/home/CulturalServices";
import SpecializedServices from "@/components/home/SpecializedServices";
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showChat, setShowChat] = useState(false);
  const [chatType, setChatType] = useState<'live' | 'ai'>('live');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-green-800/50 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
            Découvrez la Cuisine<br />
            <span className="text-gradient bg-gradient-to-r from-orange-400 to-green-400">Congolaise Authentique</span>
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
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gradient-to-r from-orange-500/5 to-green-500/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Coffee, title: "Restaurants", desc: "Découvrez nos restaurants partenaires" },
              { icon: Cylinder, title: "Gaz", desc: "Livraison de gaz à domicile" },
              { icon: Car, title: "Transport", desc: "Réservez votre taxi" },
              { icon: HeartHandshake, title: "Services", desc: "Services professionnels" }
            ].map((category, index) => (
              <div 
                key={index}
                className={cn(
                  "glass-card p-6 text-center transition-all duration-300 hover:scale-105",
                  "cursor-pointer hover:shadow-xl hover:shadow-orange-500/10"
                )}
              >
                <category.icon className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-4 py-12">
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

      {/* Services Sections with Gradient Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-green-600/10 animate-gradient-x" />
        <div className="relative">
          <EssentialServices />
          <AdditionalServices />
          <ProfessionalServices />
          <CulturalServices />
          <SpecializedServices />
        </div>
      </div>

      {/* Chat Buttons */}
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
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-orange-500 to-orange-600 
                       hover:from-orange-600 hover:to-orange-700 floating-button"
              onClick={() => {
                setChatType('ai');
                setShowChat(!showChat);
              }}
            >
              <Bot className="w-6 h-6" />
            </Button>
            <Button
              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 floating-button"
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