import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface DeliveryMapProps {
  restaurantLocation?: [number, number];
  deliveryLocation?: [number, number];
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  restaurantLocation = [2.3522, 48.8566], // Default to Paris coordinates
  deliveryLocation 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const deliveryMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'MAPBOX_PUBLIC_TOKEN')
          .single();
        
        if (secretError) throw secretError;
        if (!secretData?.value) throw new Error('No Mapbox token found');

        mapboxgl.accessToken = secretData.value;

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: restaurantLocation,
          zoom: 13
        });

        // Add restaurant marker
        marker.current = new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat(restaurantLocation)
          .addTo(map.current);

        // Add delivery location marker if available
        if (deliveryLocation) {
          deliveryMarker.current = new mapboxgl.Marker({ color: '#0000FF' })
            .setLngLat(deliveryLocation)
            .addTo(map.current);

          // Fit bounds to include both markers
          const bounds = new mapboxgl.LngLatBounds()
            .extend(restaurantLocation)
            .extend(deliveryLocation);

          map.current.fitBounds(bounds, {
            padding: 50
          });
        }

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl());
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [restaurantLocation, deliveryLocation]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default DeliveryMap;