import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

const DeliveryMap = ({ 
  latitude = 48.8566, 
  longitude = 2.3522, 
  zoom = 13 
}: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
          secret_name: 'MAPBOX_PUBLIC_TOKEN'
        });

        if (secretError) {
          console.error('Error fetching Mapbox token:', secretError);
          return;
        }

        if (!secretData) {
          console.error('No Mapbox token found');
          return;
        }

        mapboxgl.accessToken = secretData;

        if (mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: zoom
          });

          new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);
        }
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
  }, [latitude, longitude, zoom]);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-lg" />
  );
};

export default DeliveryMap;