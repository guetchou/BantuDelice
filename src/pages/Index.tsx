
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Car, 
  Package, 
  Users, 
  MapPin,
  Star,
  ChevronRight,
  PhoneCall,
  Calendar,
  Gift
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useApiAuth } from "@/contexts/ApiAuthContext";
import Header from "@/components/home/Header";

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
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % foodImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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

  const heroContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const heroItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* Hero Section with Background Image Carousel */}
      <section className="relative h-screen overflow-hidden">
        {foodImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentBgIndex === index ? 1 : 0,
              scale: currentBgIndex === index ? 1.05 : 1 
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80">
          <div className="container mx-auto px-6 flex items-center h-full">
            <motion.div 
              className="max-w-4xl"
              variants={heroContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                variants={heroItem} 
                className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight"
              >
                Découvrez la Cuisine<br />
                <span className="text-orange-500">Congolaise</span> Authentique
              </motion.h1>
              
              <motion.p 
                variants={heroItem}
                className="text-xl text-white/90 mb-12 max-w-2xl"
              >
                Des plats traditionnels préparés avec passion et livrés directement chez vous.
                Explorez une expérience culinaire unique.
              </motion.p>
              
              <motion.div variants={heroItem} className="flex flex-wrap gap-6">
                <Button 
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg group"
                  onClick={() => navigate('/restaurants')}
                >
                  Commander Maintenant
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 font-semibold px-8 py-6 text-lg flex items-center gap-2"
                  onClick={() => navigate('/taxi/booking')}
                >
                  <Car className="w-5 h-5" />
                  Réserver un Taxi
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/80 rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Nos Services</h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16">Découvrez notre gamme complète de services conçus pour vous offrir confort et commodité au quotidien.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
                    <service.icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-300 text-sm mb-6">{service.description}</p>
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
        </div>
      </section>

      {/* Nearby Restaurants Section */}
      {nearbyRestaurants.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <MapPin className="mr-2 h-6 w-6 text-orange-400" />
                  À proximité de vous
                </h2>
                <Button 
                  variant="link" 
                  className="text-orange-400 hover:text-orange-300 flex items-center group"
                  onClick={() => navigate("/restaurants")}
                >
                  Voir plus 
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/10 
                              hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer h-full"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    >
                      <div className="h-48 w-full relative overflow-hidden">
                        <motion.img 
                          src={restaurant.banner_image_url} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                        <div className="absolute top-2 right-2 bg-black/60 text-white p-1 px-2 rounded-full flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs">{restaurant.average_rating?.toFixed(1) || "Nouveau"}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-white text-xl">{restaurant.name}</h3>
                        <p className="text-gray-300 text-sm">{restaurant.cuisine_type || "Restaurant local"}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{restaurant.average_prep_time ? `${restaurant.average_prep_time} min` : "~30 min"}</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <Badge className={restaurant.delivery_fee === 0 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "bg-blue-600 hover:bg-blue-700"}>
                            {restaurant.delivery_fee === 0 ? "Livraison gratuite" : `${restaurant.delivery_fee} XAF`}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10">
                            Commander <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/30 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-400/30 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Téléchargez notre application mobile
                  </h2>
                  <p className="text-white/80 text-lg mb-6">
                    Accédez à toutes nos fonctionnalités où que vous soyez et profitez d'offres exclusives réservées aux utilisateurs mobiles.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-white/90"
                    >
                      <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 mr-2">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                      App Store
                    </Button>
                    <Button 
                      size="lg"
                      className="bg-white text-orange-600 hover:bg-white/90"
                    >
                      <svg viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 mr-2">
                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                      </svg>
                      Google Play
                    </Button>
                  </div>
                </div>
                
                <div className="relative h-96 w-64 md:h-80 shrink-0 mx-auto md:mx-0">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="absolute w-52 h-auto top-0 -right-4 z-20 rounded-xl shadow-2xl"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1622227056993-6e7f88420e4f?q=80&w=1887&auto=format&fit=crop" 
                      alt="App mobile 1" 
                      className="w-full h-auto rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 20, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="absolute w-52 h-auto left-0 top-20 z-10 rounded-xl shadow-2xl"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1770&auto=format&fit=crop" 
                      alt="App mobile 2" 
                      className="w-full h-auto rounded-xl"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 bg-black text-white border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">Buntudelice</h3>
              <p className="text-gray-400 mb-6">Votre plateforme de livraison et de services au Congo, disponible 24h/24 et 7j/7.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Restaurants</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Livraison</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Taxis</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Covoiturage</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">À propos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Carrières</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Devenir partenaire</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span className="text-gray-400">123 Avenue de la République, Brazzaville</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">+242 06 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">Lun-Dim: 8h-22h</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2023 Buntudelice. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Confidentialité</a>
              <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Conditions d'utilisation</a>
              <a href="#" className="text-gray-500 hover:text-orange-500 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Clock(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
