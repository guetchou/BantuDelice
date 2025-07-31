
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, LocateFixed, Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';

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

  // Reverse geocode coordinates to address
  const reverseGeocode = async (coordinates: [number, number]): Promise<string> => {
    const [lng, lat] = coordinates;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return 'Adresse inconnue';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Adresse inconnue';
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
      // Add route source and layer
      if (map.current) {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
        
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3AAB67',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
        
        routeLine.current = map.current.getSource('route') as mapboxgl.GeoJSONSource;
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
        // Create custom pickup marker element
        const el = document.createElement('div');
        el.className = 'pickup-marker';
        el.innerHTML = '<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></span></div>';
        
        pickupMarker.current = new mapboxgl.Marker(el)
          .setLngLat(pickupCoordinates)
          .addTo(map.current);
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
        // Create custom destination marker element
        const el = document.createElement('div');
        el.className = 'destination-marker';
        el.innerHTML = '<div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/></svg></span></div>';
        
        destinationMarker.current = new mapboxgl.Marker(el)
          .setLngLat(destinationCoordinates)
          .addTo(map.current);
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
    if (!map.current || !routeLine.current || !routeVisible) return;
    
    if (pickupCoordinates && destinationCoordinates) {
      // Get directions from Mapbox API
      const getDirections = async () => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;
            
            // Update route line
            routeLine.current.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            });
            
            // Fit map to show entire route
            if (map.current) {
              const bounds = new mapboxgl.LngLatBounds();
              route.forEach((coord: [number, number]) => {
                bounds.extend(coord);
              });
              
              map.current.fitBounds(bounds, {
                padding: 60,
                maxZoom: 15
              });
            }
          }
        } catch (error) {
          console.error('Directions API error:', error);
        }
      };
      
      getDirections();
    } else {
      // Clear route if pickup or destination is missing
      routeLine.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
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
      const el = document.createElement('div');
      el.className = 'passenger-marker';
      
      el.innerHTML = `<div class="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></span></div>`;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(passenger.coordinates)
        .addTo(map.current!);
      
      if (passenger.name) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(passenger.name);
        marker.setPopup(popup);
      }
      
      passengerMarkers.current.push(marker);
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
