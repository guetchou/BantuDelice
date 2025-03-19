
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryList from '@/components/home/CategoryList';
import RestaurantCarousel from '@/components/home/RestaurantCarousel';
import RestaurantPromotions from '@/components/home/RestaurantPromotions';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import TaxiFeature from '@/components/home/TaxiFeature';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import MarketingSection from '@/components/home/MarketingSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryList />
      <RestaurantCarousel />
      <RestaurantPromotions />
      <MarketingSection />
      <FeaturedCarousel />
      <TaxiFeature />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
