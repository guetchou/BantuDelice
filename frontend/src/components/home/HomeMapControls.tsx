
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Search, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HomeMapControlsProps {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  handleTokenSubmit: (e: React.FormEvent) => void;
  saveTokenToLocalStorage: () => void;
  handleUpdateLocation: () => void;
  mapInitialized: boolean;
  tokenError?: string | null;
}

const HomeMapControls = ({
  mapboxToken,
  setMapboxToken,
  handleTokenSubmit,
  saveTokenToLocalStorage,
  handleUpdateLocation,
  mapInitialized,
  tokenError
}: HomeMapControlsProps) => {
  const navigate = useNavigate();

  return (
    <>
      {!mapInitialized ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full p-6">
          <div className="max-w-md w-full">
            {tokenError ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <h3 className="text-red-400 font-semibold">Erreur de configuration</h3>
                </div>
                <p className="text-red-300 text-sm">{tokenError}</p>
                <p className="text-gray-400 text-xs mt-2">
                  La carte ne peut pas être chargée. Veuillez contacter l'administrateur.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Carte interactive en cours de chargement...
                </h3>
                <p className="text-gray-300 mb-4">
                  Récupération sécurisée de la configuration de la carte depuis le serveur.
                </p>
              </>
            )}
            
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
