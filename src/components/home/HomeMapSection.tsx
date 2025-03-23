
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Car, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const HomeMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const { toast } = useToast();
  const { userLocation, findNearMe } = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);

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
        new mapboxgl.Marker({ color: '#FF6B35' })
          .setLngLat([userLocation[1], userLocation[0]])
          .addTo(map.current);
      }

      // Ajouter quelques marqueurs de démonstration pour les restaurants, taxis, etc.
      const demoLocations = [
        { lng: userLocation ? userLocation[1] + 0.005 : -4.2634 + 0.005, lat: userLocation ? userLocation[0] + 0.003 : 15.2429 + 0.003, type: 'restaurant', name: 'Restaurant Le Gourmet' },
        { lng: userLocation ? userLocation[1] - 0.003 : -4.2634 - 0.003, lat: userLocation ? userLocation[0] + 0.002 : 15.2429 + 0.002, type: 'taxi', name: 'Taxi disponible' },
        { lng: userLocation ? userLocation[1] + 0.002 : -4.2634 + 0.002, lat: userLocation ? userLocation[0] - 0.004 : 15.2429 - 0.004, type: 'covoiturage', name: 'Point de covoiturage' }
      ];

      demoLocations.forEach(location => {
        const el = document.createElement('div');
        el.className = `marker-${location.type}`;
        el.style.backgroundSize = 'cover';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundImage = location.type === 'restaurant' 
          ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTExZDQ4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXRlbnNpbHMiPjxwYXRoIGQ9Ik0zIDJoM3YxMGwzLTNsMy4wMDEgMyAwLTEwaC8iLz48cGF0aCBkPSJNMTUgMmg2djI0Ii8+PC9zdmc+")'
          : location.type === 'taxi'
          ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzQ5N2ZkIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2FyIj48cGF0aCBkPSJNMTQgMTZINW0xNSAwaC0zIi8+PHBhdGggZD0iTTcgTDguMDUgOS4wMCBBMi41IDIuNSAwIDAgMSAxMC4zMSA4aDIuMzhhMi41IDIuNSAwIDAgMSAyLjI2IDEuNDBMNiA4djZhMiAyIDAgMCAwIDIgMmgEVsDIvPjxjaXJjbGUgY3g9IjYuNSIgY3k9IjE2LjUiIHI9IjIuNSIvPjxjaXJjbGUgY3g9IjE2LjUiIGN5PSIxNi41IiByPSIyLjUiLz48L3N2Zz4=")'
          : 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlcnMiPjxwYXRoIGQ9Ik0xNiAyMXYtMmE0IDQgMCAwIDAtNC00SDVhNCA0IDAgMCAwLTQgNHYyIi8+PHBhdGggZD0TTIDOWEzIDAgMSAwIDAgMTAzIDMgMCAwIDAgMC02Ii8+PHBhdGggZD0iTTIzIDIxdi0yYTQgNCAwIDAgMC0zLTMuODciLz48cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1Ii8+PC9zdmc+")'
        
        new mapboxgl.Marker(el)
          .setLngLat([location.lng, location.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${location.name}</h3>`))
          .addTo(map.current);
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        setMapInitialized(true);
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      toast({
        title: "Erreur de carte",
        description: "Impossible d'initialiser la carte Mapbox",
        variant: "destructive"
      });
      setMapLoaded(true); // Pour afficher l'interface de secours
    }
  };

  // Effet pour initialiser la carte quand le token est fourni
  useEffect(() => {
    if (mapboxToken && !mapInitialized) {
      initializeMap(mapboxToken);
    }
  }, [mapboxToken, userLocation, mapInitialized]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mapboxToken) {
      initializeMap(mapboxToken);
      toast({
        title: "Token appliqué",
        description: "La carte Mapbox a été initialisée avec votre token",
      });
    } else {
      toast({
        title: "Token invalide",
        description: "Veuillez entrer un token Mapbox valide",
        variant: "destructive"
      });
    }
  };

  // Essayer d'utiliser le token stocké au chargement de la page
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    } else {
      // Si aucun token n'est stocké, on affiche simplement le placeholder
      setTimeout(() => {
        setMapLoaded(true);
      }, 500);
    }
  }, []);

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

  // Sauvegarder le token dans le localStorage
  const saveTokenToLocalStorage = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      toast({
        title: "Token sauvegardé",
        description: "Votre token Mapbox a été sauvegardé pour une utilisation future",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-5"></div>
      
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : !mapInitialized ? (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="max-w-md w-full">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Pour utiliser la carte Mapbox complète:
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Entrez votre token Mapbox public ci-dessous pour afficher une carte interactive 
                    montrant les restaurants, taxis et services disponibles à proximité.
                  </p>
                  <form onSubmit={handleTokenSubmit} className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                        placeholder="Entrez votre token Mapbox public"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                  <div className="flex flex-col space-y-2 mb-4">
                    <Button
                      variant="outline"
                      className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      onClick={saveTokenToLocalStorage}
                    >
                      Sauvegarder ce token pour plus tard
                    </Button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                      onClick={() => navigate('/restaurants')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Voir les restaurants
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      onClick={() => navigate('/taxis')}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Commander un taxi
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {mapInitialized && (
            <div className="absolute bottom-6 left-6 z-20 flex flex-col space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={handleUpdateLocation}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ma position
              </Button>
            </div>
          )}

          <div className="absolute bottom-6 right-6 z-20">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/map')}
              >
                Explorer la carte
              </Button>
            </div>
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
