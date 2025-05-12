
import React, { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { configService } from '@/utils/config';

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
  size?: number;
}

interface HomeMapMarkersProps {
  markers: Marker[];
  map: mapboxgl.Map | null;
  onMarkerClick?: (markerId: string) => void;
}

const HomeMapMarkers: React.FC<HomeMapMarkersProps> = ({ 
  markers, 
  map, 
  onMarkerClick 
}) => {
  const markerRefs = useRef<{[key: string]: mapboxgl.Marker}>({});

  React.useEffect(() => {
    if (!map) return;

    // Clear existing markers
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};

    // Add new markers
    markers.forEach(marker => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = marker.color || '#FF5733';
      el.style.width = `${marker.size || 20}px`;
      el.style.height = `${marker.size || 20}px`;
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      
      // Create mapbox marker
      const mapboxMarker = new mapboxgl.Marker({
        element: el,
      })
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map);
      
      // Add click event if needed
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(marker.id);
        });
      }
      
      // Store reference to marker for cleanup
      markerRefs.current[marker.id] = mapboxMarker;
    });

    return () => {
      // Cleanup on unmount
      Object.values(markerRefs.current).forEach(marker => marker.remove());
    };
  }, [map, markers, onMarkerClick]);

  return null; // This component does not render anything itself
};

export default HomeMapMarkers;
