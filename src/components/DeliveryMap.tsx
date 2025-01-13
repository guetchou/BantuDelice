import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  orderId?: string;
}

type DeliveryTracking = Database['public']['Tables']['delivery_tracking']['Row'];

const DeliveryMap = ({ latitude, longitude, orderId }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
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

        marker.current = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Erreur lors de l\'initialisation de la carte');
      }
    };

    initializeMap();

    // Souscrire aux mises à jour en temps réel si un orderId est fourni
    if (orderId) {
      const channel = supabase
        .channel('delivery-tracking')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'delivery_tracking',
            filter: `order_id=eq.${orderId}`
          },
          (payload) => {
            console.log('Delivery tracking update:', payload);
            const newLocation = payload.new as DeliveryTracking;
            if (newLocation && marker.current && map.current) {
              const { latitude: newLat, longitude: newLng } = newLocation;
              if (newLat && newLng) {
                marker.current.setLngLat([newLng, newLat]);
                map.current.easeTo({
                  center: [newLng, newLat],
                  duration: 1000
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        if (map.current) {
          map.current.remove();
        }
      };
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, orderId]);

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