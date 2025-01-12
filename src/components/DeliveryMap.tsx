import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
}

const DeliveryMap = ({ latitude, longitude }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox token...');
        const { data, error } = await supabase.rpc('get_secret', {
          secret_name: 'MAPBOX_PUBLIC_TOKEN'
        });

        if (error) {
          console.error('Error fetching Mapbox token:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No Mapbox token returned');
        }

        console.log('Successfully retrieved Mapbox token');
        setMapboxToken(data);
      } catch (err) {
        console.error('Error in fetchMapboxToken:', err);
        setError('Unable to load map at this time');
        toast({
          title: "Map Error",
          description: "Unable to initialize the map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchMapboxToken();
  }, [toast]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      console.log('Initializing Mapbox map...');
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

      console.log('Map initialized successfully');

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Unable to initialize map');
      toast({
        title: "Map Error",
        description: "There was a problem displaying the map.",
        variant: "destructive",
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, latitude, longitude, toast]);

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