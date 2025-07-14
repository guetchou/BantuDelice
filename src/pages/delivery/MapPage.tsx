
import React, { useState, useEffect } from "react";
import DeliveryMap from "@/components/DeliveryMap";
import LocationMap from "@/components/delivery/LocationMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGeolocationEnhanced } from "@/hooks/useGeolocationEnhanced";

const MapPage: React.FC = () => {
  const { location, loading, getLocation, error } = useGeolocationEnhanced();
  const [showLocationMap, setShowLocationMap] = useState(false);
  
  // Coordonnées par défaut : Brazzaville
  const defaultLatitude = -4.2634;
  const defaultLongitude = 15.2429;

  const handleUpdateLocation = async () => {
    await getLocation();
  };

  const currentLocation = location ? {
    latitude: location.latitude,
    longitude: location.longitude
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Carte de livraison avec géolocalisation
          </h1>
          <p className="text-gray-600">
            Testez la géolocalisation et l'affichage des cartes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Carte de livraison principale */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Carte de livraison interactive</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 400 }}>
              <DeliveryMap 
                latitude={currentLocation?.latitude || defaultLatitude} 
                longitude={currentLocation?.longitude || defaultLongitude}
                orderId="demo-order-123"
              />
            </CardContent>
          </Card>

          {/* Informations de géolocalisation */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>État de la géolocalisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Position actuelle:</h3>
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Obtention de la position...</span>
                  </div>
                )}
                {location && (
                  <div className="text-sm space-y-1">
                    <p>✅ Géolocalisation réussie</p>
                    <p>Latitude: {location.latitude.toFixed(6)}</p>
                    <p>Longitude: {location.longitude.toFixed(6)}</p>
                    {location.accuracy && (
                      <p>Précision: {Math.round(location.accuracy)}m</p>
                    )}
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600">
                    <p>❌ Erreur: {error.message}</p>
                  </div>
                )}
                {!location && !loading && !error && (
                  <p className="text-sm text-muted-foreground">
                    Aucune position obtenue
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleUpdateLocation}
                  disabled={loading}
                  className="w-full"
                >
                  Obtenir ma position
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowLocationMap(!showLocationMap)}
                  className="w-full"
                >
                  {showLocationMap ? 'Masquer' : 'Afficher'} la carte de position
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carte de position détaillée */}
        {showLocationMap && (
          <LocationMap
            currentLocation={currentLocation}
            onUpdateLocation={handleUpdateLocation}
            isLoading={loading}
            initialAddress="Position détectée automatiquement"
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;
