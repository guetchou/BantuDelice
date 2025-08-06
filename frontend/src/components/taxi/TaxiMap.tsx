
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, LocateFixed, Loader2 } from "lucide-react";
import { toast } from '@/hooks/use-toast';

// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA';

interface TaxiMapProps {
  pickupCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  onPickupSelect: (coordinates: [number, number], address: string) => void;
  onDestinationSelect: (coordinates: [number, number], address: string) => void;
  isSelectingPickup?: boolean;
  isSelectingDestination?: boolean;
  drivers?: Array<{
    id: string;
    coordinates: [number, number];
    vehicleType: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

const TaxiMap: React.FC<TaxiMapProps> = ({
  pickupCoordinates,
  destinationCoordinates,
  onPickupSelect,
  onDestinationSelect,
  isSelectingPickup = false,
  isSelectingDestination = false,
  drivers = [],
  className = '',
  style = {},
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const driverMarkers = useRef<mapboxgl.Marker[]>([]);
  const routeLine = useRef<mapboxgl.Source | null>(null);
  
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
                onPickupSelect([longitude, latitude], 'Current Location');
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
            title: "Location Error",
            description: "Unable to access your location. Please enable location services.",
            variant: "destructive",
          });
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
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
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  // Forward geocode address to coordinates
  const forwardGeocode = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat];
      }
      return null;
    } catch (error) {
      console.error('Forward geocoding error:', error);
      return null;
    }
  };

  // Handle map click
  const handleMapClick = async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
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
      map.current!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: Record<string, unknown>,
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });
      
      map.current!.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      
      routeLine.current = map.current!.getSource('route');
    });
    
    // Try to get user's location on first load
    getCurrentLocation();
    
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
    if (!map.current || !routeLine.current) return;
    
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
            (routeLine.current as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: Record<string, unknown>,
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            });
            
            // Fit map to show entire route
            const bounds = new mapboxgl.LngLatBounds();
            route.forEach((coord: [number, number]) => {
              bounds.extend(coord);
            });
            
            map.current!.fitBounds(bounds, {
              padding: 60,
              maxZoom: 15
            });
          }
        } catch (error) {
          console.error('Directions API error:', error);
        }
      };
      
      getDirections();
    } else {
      // Clear route if pickup or destination is missing
      (routeLine.current as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: Record<string, unknown>,
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }
  }, [pickupCoordinates, destinationCoordinates]);

  // Update driver markers
  useEffect(() => {
    if (!map.current) return;
    
    // Remove old markers
    driverMarkers.current.forEach(marker => marker.remove());
    driverMarkers.current = [];
    
    // Add new markers
    drivers.forEach(driver => {
      const el = document.createElement('div');
      el.className = 'driver-marker';
      
      // Different icons for different vehicle types
      const color = 
        driver.vehicleType === 'premium' ? 'bg-purple-500' :
        driver.vehicleType === 'comfort' ? 'bg-blue-500' :
        driver.vehicleType === 'van' ? 'bg-yellow-500' :
        'bg-gray-500';
      
      el.innerHTML = `<div class="w-7 h-7 ${color} rounded-full flex items-center justify-center shadow-lg"><span class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.8 2 11 2 11.3V15c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></span></div>`;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(driver.coordinates)
        .addTo(map.current!);
      
      driverMarkers.current.push(marker);
    });
  }, [drivers]);

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
            Tap the map to set your pickup location
          </div>
        )}
        {isSelectingDestination && (
          <div className="bg-white p-2 rounded-lg shadow-lg text-sm text-center">
            Tap the map to set your destination
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxiMap;
