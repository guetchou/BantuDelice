
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Car, 
  MapPin,
  Package, 
  Users, 
  Map, 
  Sparkles,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useApiAuth } from "@/contexts/ApiAuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useApiAuth();
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoordinates([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Use default coordinates for Brazzaville
            setUserCoordinates([-4.2634, 15.2429]);
          }
        );
      }
    };

    getUserLocation();
    
    // Mock nearby restaurants data
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

  const services = [
    {
      title: "Restaurants",
      description: "Découvrez une sélection de restaurants à Brazzaville",
      icon: UtensilsCrossed,
      action: () => navigate("/restaurants"),
      color: "bg-gradient-to-br from-orange-400 to-red-500"
    },
    {
      title: "Livraison",
      description: "Suivez votre livraison en temps réel",
      icon: Package,
      action: () => navigate("/delivery"),
      color: "bg-gradient-to-br from-green-400 to-green-600"
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
      title: "Explorer",
      description: "Découvrez les lieux populaires à proximité",
      icon: Compass,
      action: () => navigate("/explorer"),
      color: "bg-gradient-to-br from-amber-400 to-amber-600"
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
      {/* Hero Background with blur overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1603417406253-4c65c06974c5?q=80&w=2070&auto=format&fit=crop')", 
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Buntudelice
            </h1>
            
            {user ? (
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
                Bienvenue, {user.email}!
              </p>
            ) : null}
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Votre plateforme de livraison de repas, transport et services au Congo
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
                onClick={() => navigate("/delivery")} 
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                Suivre ma Livraison
              </Button>
            </div>
          </motion.div>

          {/* Nearby Restaurants Section */}
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
                  className="text-orange-400 hover:text-orange-300"
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
                    <div 
                      className="overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/10 
                              hover:bg-black/50 transition-all cursor-pointer h-full"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    >
                      <div className="h-40 w-full relative">
                        <img 
                          src={restaurant.banner_image_url} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1 px-2 rounded-full flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs">{restaurant.average_rating?.toFixed(1) || "Nouveau"}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white">{restaurant.name}</h3>
                        <p className="text-gray-300 text-sm">{restaurant.cuisine_type || "Restaurant local"}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            {restaurant.average_prep_time ? `${restaurant.average_prep_time} min` : "~30 min"}
                          </span>
                          <Badge className={restaurant.delivery_fee === 0 ? "bg-green-600" : "bg-blue-600"}>
                            {restaurant.delivery_fee === 0 ? "Livraison gratuite" : `${restaurant.delivery_fee} XAF`}
                          </Badge>
                        </div>
                      </div>
                    </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
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
                <div 
                  className="bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/50 
                           transition-all h-full text-white cursor-pointer rounded-xl overflow-hidden"
                  onClick={service.action}
                >
                  <div className={`${service.color} rounded-t-lg py-6 px-4`}>
                    <div className="flex justify-between items-center">
                      <service.icon className="w-8 h-8" />
                      <h3 className="text-lg font-bold">{service.title}</h3>
                    </div>
                  </div>
                  <div className="pt-3 pb-4 px-4">
                    <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                    <Button 
                      onClick={service.action}
                      className="w-full group bg-white/10 hover:bg-white/20 text-white"
                      variant="ghost"
                    >
                      Découvrir
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
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
                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
              >
                Tester la démo
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Offre spéciale",
                    description: "Utilisez le code WELCOME15 pour obtenir 15% de réduction sur votre première commande!",
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

function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function Gift(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  )
}
