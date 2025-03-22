
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

const HomeMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // This is where we would normally initialize Mapbox
    // For now, we'll display a placeholder with input for token
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, we would store and use this token
    if (mapboxToken) {
      toast.success("Token applied. Map would load with your token in production.");
    } else {
      toast.error("Please enter a valid Mapbox token.");
    }
  };

  const toast = {
    success: (message: string) => console.log(message),
    error: (message: string) => console.error(message)
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
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="max-w-md w-full">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Pour utiliser la carte Mapbox complète:
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Dans une version de production, cette section afficherait une carte Mapbox 
                    interactive montrant les restaurants, taxis et services disponibles à proximité.
                  </p>
                  <form onSubmit={handleTokenSubmit} className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                        placeholder="Entrez votre token Mapbox (pour démonstration)"
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
            )}
          </div>

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
