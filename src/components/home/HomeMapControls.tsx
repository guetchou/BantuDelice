
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HomeMapControlsProps {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  handleTokenSubmit: (e: React.FormEvent) => void;
  saveTokenToLocalStorage: () => void;
  handleUpdateLocation: () => void;
  mapInitialized: boolean;
}

const HomeMapControls = ({
  mapboxToken,
  setMapboxToken,
  handleTokenSubmit,
  saveTokenToLocalStorage,
  handleUpdateLocation,
  mapInitialized
}: HomeMapControlsProps) => {
  const navigate = useNavigate();

  return (
    <>
      {!mapInitialized ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full p-6">
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
                <Search className="h-4 w-4 mr-2" />
                Commander un taxi
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default HomeMapControls;
