
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import HomeMapControls from './HomeMapControls';
import { addDemoMarkers, addUserLocationMarker } from './HomeMapMarkers';

const HomeMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();
  const { userLocation, findNearMe } = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Utilisation du hook sécurisé pour récupérer le token Mapbox
  const { token: mapboxToken, loading: tokenLoading, error: tokenError } = useMapboxToken();

  // Cette fonction initialise la carte Mapbox
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      // Configurer le token Mapbox
      mapboxgl.accessToken = token;
      
      // Créer la carte
      if (map.current) map.current.remove();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation || [-4.2634, 15.2429], // Brazzaville par défaut
        zoom: 13,
        interactive: true
      });

      // Ajouter les contrôles de navigation
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Ajouter un marqueur pour l'emplacement actuel
      if (userLocation) {
        addUserLocationMarker(map.current, userLocation);
      }

      // Ajouter des marqueurs de démonstration
      if (map.current) {
        addDemoMarkers(map.current, userLocation);
      }

      map.current.on('load', () => {
        setMapLoaded(true);
        setMapInitialized(true);
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte Mapbox"
      });
      setMapLoaded(true); // Pour afficher l'interface de secours
    }
  };

  // Effet pour initialiser la carte quand le token est récupéré
  useEffect(() => {
    if (mapboxToken && !mapInitialized) {
      initializeMap(mapboxToken);
    }
  }, [mapboxToken, userLocation, mapInitialized]);

  // Gérer les erreurs de token
  useEffect(() => {
    if (tokenError) {
      toast({
        title: "Erreur de configuration",
        description: tokenError
      });
      setMapLoaded(true); // Pour afficher l'interface de secours
    }
  }, [tokenError, toast]);

  // Gérer le changement de localisation
  const handleUpdateLocation = () => {
    if (findNearMe) {
      const newLocation = findNearMe();
      if (newLocation && map.current) {
        map.current.flyTo({
          center: [newLocation[1], newLocation[0]],
          zoom: 14
        });
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDYtMi42OS02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] bg-repeat opacity-5"></div>
      
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
            {tokenLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Chargement de la carte...</p>
                </div>
              </div>
            ) : !mapLoaded ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : (
              <HomeMapControls
                mapboxToken={mapboxToken || ''}
                setMapboxToken={() => {}} // Plus nécessaire car géré par le hook
                handleTokenSubmit={() => {}} // Plus nécessaire
                saveTokenToLocalStorage={() => {}} // Plus nécessaire
                handleUpdateLocation={handleUpdateLocation}
                mapInitialized={mapInitialized}
                tokenError={tokenError}
              />
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
