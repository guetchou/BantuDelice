import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Utensils, Clock, Star, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DeliveryMap from '@/components/DeliveryMap';
import CartDrawer from '@/components/cart/CartDrawer';
import ChatBubble from '@/components/chat/ChatBubble';
import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FeaturedRestaurant {
  id: string;
  name: string;
  banner_image_url?: string;
  cuisine_type?: string;
  rating?: number;  
  estimated_preparation_time?: number;
  is_open?: boolean;
  opening_hours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const { data: featuredRestaurants, isLoading, error } = useQuery({
    queryKey: ['featuredRestaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          id,
          name,
          banner_image_url,
          cuisine_type,
          rating,
          estimated_preparation_time,
          opening_hours
        `)
        .eq('featured', true)
        .limit(3);
      
      if (error) {
        throw error;
      }

      return (data || []).map(restaurant => ({
        ...restaurant,
        is_open: checkRestaurantOpen(restaurant.opening_hours)
      })) as FeaturedRestaurant[];
    },
    meta: {
      errorMessage: "Impossible de charger les restaurants mis en avant"
    }
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    } else {
      toast({
        title: "Recherche invalide",
        description: "Veuillez entrer un terme de recherche",
        variant: "destructive",
      });
    }
  };

  const checkRestaurantOpen = (openingHours: FeaturedRestaurant['opening_hours']): boolean => {
    if (!openingHours) return false;
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = openingHours[day];
    if (!todayHours) return false;

    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    return currentTime >= openTime && currentTime <= closeTime;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ opacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/30 to-gray-900/90 backdrop-blur-sm" />
          </div>
        </motion.div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge 
              className="mb-6 bg-orange-500/90 hover:bg-orange-600 text-white px-4 py-2 text-sm"
              variant="secondary"
            >
              Découvrez la cuisine africaine authentique
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Savourez l'Afrique<br />
              <span className="text-gradient bg-gradient-to-r from-orange-400 to-yellow-400">
                à votre porte
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              Une expérience culinaire unique avec les meilleurs restaurants africains. 
              Découvrez des saveurs authentiques, livrées rapidement chez vous.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl w-full"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un plat, un restaurant..."
                className="w-full px-6 py-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                         text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500
                         transition-all duration-300 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600"
                size="lg"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg"
              onClick={() => navigate('/restaurants')}
            >
              Commander maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => navigate('/services')}
            >
              Découvrir nos services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="text-orange-400 mb-4">
              Restaurants à la une
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Nos meilleures adresses
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Découvrez notre sélection des meilleurs restaurants africains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-800/50 rounded-lg h-96 animate-pulse"
                  />
                ))
              ) : error ? (
                <div className="col-span-3 text-center text-red-500">
                  Une erreur est survenue lors du chargement des restaurants
                </div>
              ) : featuredRestaurants?.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate(`/restaurants/${restaurant.id}/menu`)}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 h-full">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={restaurant.banner_image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {restaurant.cuisine_type && (
                          <Badge className="bg-orange-500">
                            {restaurant.cuisine_type}
                          </Badge>
                        )}
                        <Badge className={restaurant.is_open ? "bg-green-500" : "bg-red-500"}>
                          {restaurant.is_open ? "Ouvert" : "Fermé"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{restaurant.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        <div className="flex items-center gap-4 mt-2">
                          {restaurant.rating && (
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current mr-1" />
                              <span>{restaurant.rating.toFixed(1)}/5</span>
                            </div>
                          )}
                          {restaurant.estimated_preparation_time && (
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{restaurant.estimated_preparation_time} min</span>
                            </div>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi nous choisir
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Notre engagement pour une expérience unique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                title: "Cuisine Authentique",
                description: "Des plats préparés par des chefs passionnés"
              },
              {
                icon: Clock,
                title: "Livraison Rapide",
                description: "Vos commandes livrées en 30 minutes"
              },
              {
                icon: MapPin,
                title: "Large Couverture",
                description: "Livraison dans toute la ville"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-700/50 
                          transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-orange-500 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Map Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Zone de Livraison</h2>
            <p className="text-gray-400">Vérifiez si vous êtes dans notre zone de livraison</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[400px] rounded-lg overflow-hidden shadow-xl"
          >
            <DeliveryMap 
              latitude={-4.4419} 
              longitude={15.2663}
            />
          </motion.div>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="fixed bottom-4 right-4 z-50">
        <CartDrawer />
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        <ChatBubble />
      </div>

      <Footer />
    </main>
  );
}
