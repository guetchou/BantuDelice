import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
}

const DeliveryMap = ({ latitude, longitude }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error } = await supabase.functions.invoke('get_mapbox_token');
        
        if (error) {
          console.error('Error in fetchMapboxToken:', error);
          throw error;
        }

        if (!data?.token) {
          throw new Error('No token returned from server');
        }

        return data.token;
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Erreur lors du chargement de la carte');
        throw err;
      }
    };

    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        const token = await fetchMapboxToken();
        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: 14
        });

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Erreur lors de l\'initialisation de la carte');
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default DeliveryMap;