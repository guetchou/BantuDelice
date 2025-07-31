
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { LocateFixed, Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { 
  createPickupMarker, 
  createDestinationMarker, 
  createPassengerMarker 
} from './RidesharingMapMarkers';
import { 
  getRouteDirections,
  initializeRouteLayer 
} from './RidesharingMapDirections';
import { reverseGeocode } from './RidesharingMapGeocoding';

// Initialize Mapbox (replace with your actual token or use environment variable)
mapboxgl.accessToken = 'pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA';

interface RidesharingMapProps {
  pickupCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  onPickupSelect: (coordinates: [number, number], address: string) => void;
  onDestinationSelect: (coordinates: [number, number], address: string) => void;
  isSelectingPickup?: boolean;
  isSelectingDestination?: boolean;
  passengers?: Array<{
    id: string;
    coordinates: [number, number];
    name?: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
  routeVisible?: boolean;
  showCurrentLocation?: boolean;
}

const RidesharingMap: React.FC<RidesharingMapProps> = ({
  pickupCoordinates,
  destinationCoordinates,
  onPickupSelect,
  onDestinationSelect,
  isSelectingPickup = false,
  isSelectingDestination = false,
  passengers = [],
  className = '',
  style = {},
  routeVisible = true,
  showCurrentLocation = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const passengerMarkers = useRef<mapboxgl.Marker[]>([]);
  const routeLine = useRef<mapboxgl.GeoJSONSource | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          // If we're selecting pickup, automatically use current location
          if (isSelectingPickup) {
            reverseGeocode([longitude, latitude])
              .then(address => {
                onPickupSelect([longitude, latitude], address);
              })
              .catch(error => {
                console.error('Reverse geocoding error:', error);
                onPickupSelect([longitude, latitude], 'Votre position actuelle');
              });
          }
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14
            });
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'accéder à votre position. Veuillez activer les services de localisation.",
            variant: "destructive",
          });
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      toast({
        title: "Localisation non supportée",
        description: "Votre navigateur ne prend pas en charge la géolocalisation.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle map click
  const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    
    if (isSelectingPickup) {
      const address = await reverseGeocode([lng, lat]);
      onPickupSelect([lng, lat], address);
    } else if (isSelectingDestination) {
      const address = await reverseGeocode([lng, lat]);
      onDestinationSelect([lng, lat], address);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    // Default coordinates (Brazzaville center)
    const defaultCoordinates: [number, number] = [15.2429, -4.2634];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCoordinates,
      zoom: 13
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.current.on('click', handleMapClick);
    
    map.current.on('load', () => {
      if (map.current) {
        routeLine.current = initializeRouteLayer(map.current);
      }
    });
    
    // Try to get user's location on first load
    if (showCurrentLocation) {
      getCurrentLocation();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update pickup marker
  useEffect(() => {
    if (!map.current) return;
    
    if (pickupCoordinates) {
      if (pickupMarker.current) {
        pickupMarker.current.setLngLat(pickupCoordinates);
      } else {
        pickupMarker.current = createPickupMarker({
          map: map.current,
          pickupCoordinates
        });
      }
      
      // Center map on pickup if it's newly selected
      if (isSelectingPickup) {
        map.current.flyTo({
          center: pickupCoordinates,
          zoom: 14
        });
      }
    } else if (pickupMarker.current) {
      pickupMarker.current.remove();
      pickupMarker.current = null;
    }
  }, [pickupCoordinates, isSelectingPickup]);

  // Update destination marker
  useEffect(() => {
    if (!map.current) return;
    
    if (destinationCoordinates) {
      if (destinationMarker.current) {
        destinationMarker.current.setLngLat(destinationCoordinates);
      } else {
        destinationMarker.current = createDestinationMarker({
          map: map.current,
          destinationCoordinates
        });
      }
      
      // Center map on destination if it's newly selected
      if (isSelectingDestination) {
        map.current.flyTo({
          center: destinationCoordinates,
          zoom: 14
        });
      }
    } else if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
  }, [destinationCoordinates, isSelectingDestination]);

  // Update route between pickup and destination
  useEffect(() => {
    if (pickupCoordinates && destinationCoordinates) {
      getRouteDirections({
        map: map.current,
        routeLine: routeLine.current,
        pickupCoordinates,
        destinationCoordinates,
        routeVisible
      });
    }
  }, [pickupCoordinates, destinationCoordinates, routeVisible]);

  // Update passenger markers
  useEffect(() => {
    if (!map.current) return;
    
    // Remove old markers
    passengerMarkers.current.forEach(marker => marker.remove());
    passengerMarkers.current = [];
    
    // Add new markers
    passengers.forEach(passenger => {
      const marker = createPassengerMarker({
        map: map.current,
        passenger
      });
      
      if (marker) {
        passengerMarkers.current.push(marker);
      }
    });
  }, [passengers]);

  return (
    <div className={`relative ${className}`} style={{ height: '100%', width: '100%', ...style }}>
      <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />
      
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={getCurrentLocation}
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          ) : (
            <LocateFixed className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
        {isSelectingPickup && (
          <div className="bg-white p-2 rounded-lg shadow-lg text-sm text-center">
            Touchez la carte pour définir votre point de départ
          </div>
        )}
        {isSelectingDestination && (
          <div className="bg-white p-2 rounded-lg shadow-lg text-sm text-center">
            Touchez la carte pour définir votre destination
          </div>
        )}
      </div>
    </div>
  );
};

export default RidesharingMap;
