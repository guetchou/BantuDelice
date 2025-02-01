import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  orderId?: string;
}

const DeliveryMap = ({ latitude, longitude, orderId }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Get Mapbox token from edge function
        const { data: { token }, error } = await supabase.functions.invoke('get_mapbox_token');

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          return;
        }

        if (!token) {
          console.error('No Mapbox token received');
          return;
        }

        // Set access token
        mapboxgl.accessToken = token;

        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 12
          });

          // Add marker
          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default DeliveryMap;