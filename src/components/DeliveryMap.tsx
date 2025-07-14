
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGeolocationEnhanced } from '@/hooks/useGeolocationEnhanced';

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  orderId?: string;
}

const DeliveryMap = ({ latitude, longitude, orderId }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { location, loading, getLocation } = useGeolocationEnhanced();
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });

  // Use user location if available, otherwise use provided coordinates
  useEffect(() => {
    if (location) {
      setMapCenter({ lat: location.latitude, lng: location.longitude });
    } else {
      setMapCenter({ lat: latitude, lng: longitude });
    }
  }, [location, latitude, longitude]);
  
  useEffect(() => {
    if (mapContainer.current) {
      console.log(`Initializing map at coordinates: ${mapCenter.lat}, ${mapCenter.lng}`);
      console.log(`Order ID: ${orderId || 'No order ID provided'}`);
      
      // Simulate map loading with current location
      const loadMap = () => {
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <style>
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
              }
              .pulse-animation {
                animation: pulse 2s infinite;
              }
            </style>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; position: relative;">
              <div style="text-align: center; z-index: 10;">
                <div style="font-size: 18px; margin-bottom: 10px;">📍 Position actuelle</div>
                <div style="font-size: 14px; opacity: 0.9;">Latitude: ${mapCenter.lat.toFixed(4)}</div>
                <div style="font-size: 14px; opacity: 0.9;">Longitude: ${mapCenter.lng.toFixed(4)}</div>
                ${orderId ? `<div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Commande: ${orderId}</div>` : ''}
                ${location ? '<div style="font-size: 12px; margin-top: 8px; color: #4ade80;">✓ Géolocalisation active</div>' : '<div style="font-size: 12px; margin-top: 8px; color: #fbbf24;">⚠ Position par défaut</div>'}
              </div>
              <div class="pulse-animation" style="position: absolute; top: 20px; right: 20px; width: 12px; height: 12px; background: #4ade80; border-radius: 50%;"></div>
            </div>
          `;
        }
      };
      
      loadMap();
    }
  }, [mapCenter, orderId, location]);

  const handleGetLocation = async () => {
    await getLocation();
  };

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg overflow-hidden"
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleGetLocation}
          disabled={loading}
          className="bg-white/90 hover:bg-white text-gray-800"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {loading ? 'Localisation...' : 'Ma position'}
        </Button>
      </div>
    </div>
  );
};

export default DeliveryMap;
