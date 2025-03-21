
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Car, 
  Wallet, 
  Package, 
  Users, 
  Map, 
  MessageSquare, 
  Compass, 
  Calendar, 
  Sparkles, 
  Gift,
  Bookmark,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoordinates([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Utiliser des coordonnées par défaut pour Brazzaville
            setUserCoordinates([-4.2634, 15.2429]);
          }
        );
      }
    };

    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserName(profile.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserLocation();
    fetchUserProfile();
    setLoading(false);
  }, []);

  // Récupérer les restaurants à proximité
  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      if (!userCoordinates) return;
      
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .limit(3);
        
        if (error) throw error;
        setNearbyRestaurants(data || []);
      } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
      }
    };

    fetchNearbyRestaurants();
  }, [userCoordinates]);

  const services = [
    {
      title: "Restaurants",
      description: "Découvrez une sélection de restaurants à Brazzaville",
      icon: UtensilsCrossed,
      action: () => navigate("/restaurants"),
      color: "bg-gradient-to-br from-orange-400 to-red-500"
    },
    {
      title: "Taxi",
      description: "Réservez un taxi rapidement et en toute sécurité",
      icon: Car,
      action: () => navigate("/taxis"),
      color: "bg-gradient-to-br from-blue-400 to-blue-600"
    },
    {
      title: "Covoiturage",
      description: "Partagez vos trajets et économisez",
      icon: Users,
      action: () => navigate("/covoiturage"),
      color: "bg-gradient-to-br from-teal-400 to-teal-600"
    },
    {
      title: "Commandes",
      description: "Suivez vos commandes en temps réel",
      icon: Package,
      action: () => navigate("/orders"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
    },
    {
      title: "Wallet",
      description: "Gérez vos paiements et transactions",
      icon: Wallet,
      action: () => navigate("/wallet"),
      color: "bg-gradient-to-br from-purple-400 to-purple-600"
    },
    {
      title: "Messages",
      description: "Communiquez avec les chauffeurs et livreurs",
      icon: MessageSquare,
      action: () => navigate("/messages"),
      color: "bg-gradient-to-br from-pink-400 to-pink-600"
    },
    {
      title: "Explorer",
      description: "Découvrez les lieux populaires à proximité",
      icon: Compass,
      action: () => navigate("/explorer"),
      color: "bg-gradient-to-br from-amber-400 to-amber-600"
    },
    {
      title: "Événements",
      description: "Trouvez des événements locaux et culturels",
      icon: Calendar,
      action: () => navigate("/events"),
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600"
    },
    {
      title: "Favoris",
      description: "Accédez à vos restaurants et services préférés",
      icon: Bookmark,
      action: () => navigate("/favorites"),
      color: "bg-gradient-to-br from-rose-400 to-rose-600"
    },
    {
      title: "Récompenses",
      description: "Gagnez et utilisez vos points de fidélité",
      icon: Gift,
      action: () => navigate("/rewards"),
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="relative min-h-screen">
      {/* Fond d'écran avec superposition */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop')", 
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              EazyCongo
            </h1>
            
            {userName ? (
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
                Bienvenue, {userName}!
              </p>
            ) : null}
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Votre plateforme tout-en-un pour vos besoins quotidiens au Congo
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate("/restaurants")} 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                Commander
              </Button>
              <Button 
                onClick={() => navigate("/taxis")} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
              >
                Réserver un Taxi
              </Button>
            </div>
          </motion.div>

          {/* Section des restaurants à proximité */}
          {nearbyRestaurants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-16"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Map className="mr-2 h-5 w-5 text-orange-400" />
                  À proximité de vous
                </h2>
                <Button 
                  variant="link" 
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => navigate("/restaurants")}
                >
                  Voir plus <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="overflow-hidden bg-black/40 backdrop-blur-md border-gray-800 
                              hover:bg-black/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    >
                      <div className="h-40 w-full relative">
                        <img 
                          src={restaurant.banner_image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1 px-2 rounded-full flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs">{restaurant.average_rating?.toFixed(1) || "Nouveau"}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white">{restaurant.name}</h3>
                        <p className="text-gray-300 text-sm">{restaurant.cuisine_type || "Restaurant local"}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            {restaurant.average_prep_time ? `${restaurant.average_prep_time} min` : "~30 min"}
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {restaurant.delivery_fee === 0 ? "Livraison gratuite" : `${restaurant.delivery_fee} XAF`}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Services Grid */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-white mb-6 flex items-center"
          >
            <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
            Nos services
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="bg-black/40 backdrop-blur-md border-gray-800 hover:bg-black/50 
                           transition-all h-full text-white cursor-pointer"
                  onClick={service.action}
                >
                  <CardHeader className={`${service.color} rounded-t-lg pb-2`}>
                    <div className="flex justify-between items-center">
                      <service.icon className="w-8 h-8" />
                      <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-4">
                    <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                    <Button 
                      onClick={service.action}
                      className="w-full group bg-white/10 hover:bg-white/20 text-white"
                      variant="ghost"
                    >
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              Découvrez l'application tout-en-un pour le Congo
            </h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              Transport, livraison de repas, paiements et bien plus encore dans une seule application intuitive et facile à utiliser.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => navigate("/order-demo")} 
                size="lg"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
              >
                Tester la démo
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Offre spéciale",
                    description: "Utilisez le code WELCOME15 pour obtenir 15% de réduction sur votre première commande!",
                    variant: "default"
                  });
                }} 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Gift className="mr-2 h-5 w-5" />
                Offres spéciales
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
