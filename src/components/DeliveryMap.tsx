import React, { useEffect, useRef, useState } from 'react';
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
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.rpc('get_secret', {
          secret_name: 'MAPBOX_PUBLIC_TOKEN'
        });

        if (error) throw error;
        setMapboxToken(data);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Unable to load map at this time');
      }
    };

    fetchMapboxToken();
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 14
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for restaurant location
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Unable to initialize map');
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, latitude, longitude]);

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default DeliveryMap;