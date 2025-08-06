
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Users, Navigation, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HomeMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([-4.2634, 15.2429]); // Brazzaville par défaut
  const [isLoading, setIsLoading] = useState(false);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showTaxis, setShowTaxis] = useState(true);
  const { toast } = useToast();

  // Données simulées pour les restaurants et services
  const mockRestaurants = [
    { id: 1, name: "Restaurant Le Congo", position: [-4.2634, 15.2429] as [number, number], type: "restaurant", rating: 4.5, address: "Avenue de la Paix, Brazzaville" },
    { id: 2, name: "Café Brazza", position: [-4.2650, 15.2440] as [number, number], type: "cafe", rating: 4.2, address: "Boulevard Denis Sassou Nguesso" },
    { id: 3, name: "Pizzeria Italia", position: [-4.2620, 15.2410] as [number, number], type: "restaurant", rating: 4.7, address: "Rue de la Joie, Brazzaville" },
  ];

  const mockTaxis = [
    { id: 1, position: [-4.2640, 15.2430] as [number, number], available: true, driver: "Jean-Pierre" },
    { id: 2, position: [-4.2660, 15.2450] as [number, number], available: true, driver: "Marie-Claire" },
    { id: 3, position: [-4.2610, 15.2400] as [number, number], available: false, driver: "Paul" },
  ];

  // Fonction pour obtenir la géolocalisation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        setIsLoading(false);
        toast({
          title: "Localisation mise à jour",
          description: "Votre position a été mise à jour"
        });
      },
      (error) => {
        setIsLoading(false);
        console.warn('Erreur de géolocalisation:', error);
        toast({
          title: "Erreur de localisation",
          description: "Utilisation de la position par défaut (Brazzaville)"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Initialisation de la carte
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gray-800 opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Explorez Brazzaville</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Découvrez les meilleurs restaurants, services et attractions proches de vous avec notre carte interactive
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800"
        >
          <div className="w-full h-[500px] bg-gray-800 relative overflow-hidden" ref={mapContainer}>
            {!mapLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Chargement de la carte...</p>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Carte OpenStreetMap en iframe */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation[1]-0.01},${userLocation[0]-0.01},${userLocation[1]+0.01},${userLocation[0]+0.01}&layer=mapnik&marker=${userLocation[0]},${userLocation[1]}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
                
                {/* Contrôles de la carte */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-lg transition-colors shadow-lg"
                    title="Trouver près de moi"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
                    ) : (
                      <Navigation className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowRestaurants(!showRestaurants)}
                    className={`p-3 rounded-lg transition-colors shadow-lg ${
                      showRestaurants 
                        ? 'bg-orange-500/90 hover:bg-orange-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-800'
                    }`}
                    title="Afficher/Masquer les restaurants"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => setShowTaxis(!showTaxis)}
                    className={`p-3 rounded-lg transition-colors shadow-lg ${
                      showTaxis 
                        ? 'bg-blue-500/90 hover:bg-blue-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-800'
                    }`}
                    title="Afficher/Masquer les taxis"
                  >
                    <Car className="w-5 h-5" />
                  </button>
                </div>

                {/* Panneau d'informations */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm z-[1000]">
                  <h3 className="font-semibold text-gray-800 mb-2">Informations</h3>
                  
                  {showRestaurants && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-orange-600 mb-1">Restaurants à proximité</h4>
                      <div className="space-y-1">
                        {mockRestaurants.map((restaurant) => (
                          <div key={restaurant.id} className="text-xs text-gray-600 flex items-center justify-between">
                            <span>{restaurant.name}</span>
                            <span className="text-orange-500">⭐ {restaurant.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {showTaxis && (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Taxis disponibles</h4>
                      <div className="space-y-1">
                        {mockTaxis.map((taxi) => (
                          <div key={taxi.id} className="text-xs text-gray-600 flex items-center justify-between">
                            <span>Taxi #{taxi.id} - {taxi.driver}</span>
                            <span className={taxi.available ? 'text-green-500' : 'text-red-500'}>
                              {taxi.available ? '🟢' : '🔴'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${userLocation[0]}&mlon=${userLocation[1]}&zoom=13`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Ouvrir dans OpenStreetMap
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Marqueurs simulés sur la carte */}
                <div className="absolute inset-0 pointer-events-none z-[500]">
                  {/* Marqueur de position utilisateur */}
                  <div 
                    className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  </div>

                  {/* Marqueurs des restaurants */}
                  {showRestaurants && mockRestaurants.map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      className="absolute w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${45 + (index * 5)}%`,
                        top: `${40 + (index * 10)}%`
                      }}
                      title={restaurant.name}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-xs px-2 py-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        {restaurant.name}
                      </div>
                    </div>
                  ))}

                  {/* Marqueurs des taxis */}
                  {showTaxis && mockTaxis.map((taxi, index) => (
                    <div
                      key={taxi.id}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform ${
                        taxi.available ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                      style={{
                        left: `${55 + (index * 8)}%`,
                        top: `${60 + (index * 8)}%`
                      }}
                      title={`Taxi ${taxi.id} - ${taxi.driver}`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-xs px-2 py-1 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        Taxi {taxi.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <MapPin className="h-8 w-8 text-orange-500 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Restaurants à proximité</h3>
            <p className="text-gray-400">Découvrez les meilleurs restaurants autour de vous, avec des filtres par cuisine et prix.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <Car className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Taxis disponibles</h3>
            <p className="text-gray-400">Visualisez les taxis en temps réel et estimez les temps d'attente dans votre zone.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <Users className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Trajets partagés</h3>
            <p className="text-gray-400">Trouvez des covoiturages et des trajets partagés pour économiser et voyager de manière écologique.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeMapSection;
