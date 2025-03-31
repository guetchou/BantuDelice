
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiAuth } from "@/contexts/ApiAuthContext";
import SEO from "@/components/SEO";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HomeMapSection from "@/components/home/HomeMapSection";
import TaxiSection from "@/components/home/TaxiSection";
import RidesharingSection from "@/components/home/RidesharingSection";
import TrendingSection from "@/components/home/TrendingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SocialSection from "@/components/home/SocialSection";
import NearbyRestaurantsSection from "@/components/home/NearbyRestaurantsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import FooterSection from "@/components/home/FooterSection";
import Newsletter from "@/components/home/Newsletter";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import FeaturedDishes from "@/components/home/FeaturedDishes";
import ProfessionalServices from "@/components/home/ProfessionalServices";
import SpecializedServices from "@/components/home/SpecializedServices";
import FeaturedServices from "@/components/home/FeaturedServices";
import MarketingSection from "@/components/home/MarketingSection";

const foodImages = [
  "https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop"
];

const featuredServices = [
  {
    id: "taxi",
    title: "Réservation de Taxi",
    description: "Déplacez-vous rapidement et en toute sécurité",
    icon: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-3c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v3h2"/><path d="m14 3-3 3H7l3-3"/><path d="M16 10h-3"/></svg>,
    color: "bg-yellow-500",
    route: "/taxi/booking"
  },
  {
    id: "food",
    title: "Livraison de Repas",
    description: "Vos restaurants préférés livrés chez vous",
    icon: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>,
    color: "bg-red-500",
    route: "/restaurants"
  },
  {
    id: "share",
    title: "Covoiturage",
    description: "Partagez votre trajet et économisez",
    icon: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: "bg-green-500",
    route: "/covoiturage"
  },
  {
    id: "services",
    title: "Services Professionnels",
    description: "Des experts à votre service",
    icon: ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    color: "bg-indigo-500",
    route: "/services"
  }
];

export default function Index() {
  const navigate = useNavigate();
  const { user } = useApiAuth();
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoordinates([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
            setUserCoordinates([-4.2634, 15.2429]); // Coordonnées par défaut de Kinshasa
          }
        );
      }
    };

    getUserLocation();
    
    setNearbyRestaurants([
      {
        id: 'rest1',
        name: 'Le Gourmet Congolais',
        cuisine_type: 'Cuisine congolaise',
        banner_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
        average_rating: 4.7,
        delivery_fee: 0,
        average_prep_time: 25
      },
      {
        id: 'rest2',
        name: 'Saveurs d\'Afrique',
        cuisine_type: 'Panafricaine',
        banner_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        average_rating: 4.5,
        delivery_fee: 1500,
        average_prep_time: 35
      },
      {
        id: 'rest3',
        name: 'Chez Matou',
        cuisine_type: 'Fast Food',
        banner_image_url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=1964&auto=format&fit=crop',
        average_rating: 4.2,
        delivery_fee: 2000,
        average_prep_time: 20
      },
    ]);
    
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Optimization */}
      <SEO 
        title="Buntudelice - Livraison de repas, taxi et services à Kinshasa"
        description="Commandez des repas de restaurants locaux, réservez un taxi ou accédez à des services professionnels à Kinshasa. Service rapide, pratique et fiable."
        ogImage="/images/og-home.jpg"
      />
      
      {/* Header Component */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Hero Section with Background Image Carousel */}
      <HeroSection foodImages={foodImages} />

      {/* Featured Services Grid */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <FeaturedServices 
            services={featuredServices} 
            title="Nos Services Principaux" 
          />
        </div>
      </div>

      {/* Services Grid Section */}
      <ServicesSection />

      {/* Featured Carousel */}
      <FeaturedCarousel />

      {/* Taxi Section */}
      <TaxiSection />

      {/* Ridesharing Section */}
      <RidesharingSection />
      
      {/* Map Section */}
      <HomeMapSection />

      {/* Featured Dishes Section */}
      <FeaturedDishes />

      {/* Professional Services Section */}
      <ProfessionalServices />

      {/* Specialized Services Section */}
      <SpecializedServices />

      {/* Trending Section - À la une */}
      <TrendingSection />

      {/* Nearby Restaurants Section */}
      <NearbyRestaurantsSection restaurants={nearbyRestaurants} />

      {/* Marketing Section */}
      <MarketingSection />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Social Media Section */}
      <SocialSection />

      {/* Call to Action Section */}
      <CallToActionSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
