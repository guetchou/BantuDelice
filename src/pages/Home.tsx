
import React, { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDishes from '@/components/home/FeaturedDishes';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import CategoryList from '@/components/home/CategoryList';
import EssentialServices from '@/components/home/EssentialServices';
import AdditionalServices from '@/components/home/AdditionalServices';
import CulturalServices from '@/components/home/CulturalServices';
import FeaturedRestaurant from '@/components/home/FeaturedRestaurant';

export const Home = () => {
  usePageTitle({ title: "Accueil" });
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <CategoryList 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      {/* Featured Content */}
      <FeaturedDishes />
      <FeaturedCarousel />
      
      {/* Services Sections */}
      <EssentialServices />
      <AdditionalServices />
      
      {/* Featured Restaurant */}
      <FeaturedRestaurant />
      
      {/* Cultural Services */}
      <CulturalServices />
    </div>
  );
};

export default Home;
