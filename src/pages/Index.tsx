
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiAuth } from "@/contexts/ApiAuthContext";
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

const foodImages = [
  "https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop"
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
            setUserCoordinates([-4.2634, 15.2429]);
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
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Hero Section with Background Image Carousel */}
      <HeroSection foodImages={foodImages} />

      {/* Services Grid Section */}
      <ServicesSection />

      {/* Taxi Section */}
      <TaxiSection />

      {/* Ridesharing Section */}
      <RidesharingSection />
      
      {/* Map Section */}
      <HomeMapSection />

      {/* Trending Section - À la une */}
      <TrendingSection />

      {/* Nearby Restaurants Section */}
      <NearbyRestaurantsSection restaurants={nearbyRestaurants} />

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
