
import React, { useRef } from 'react';
import mapboxgl from 'mapbox-gl';

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

// Fonction pour ajouter un marqueur de localisation utilisateur
export const addUserLocationMarker = (map: mapboxgl.Map, userLocation: [number, number]) => {
  const el = document.createElement('div');
  el.className = 'user-location-marker';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = '#4285F4';
  el.style.border = '3px solid white';
  el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

  new mapboxgl.Marker(el)
    .setLngLat([userLocation[1], userLocation[0]])
    .addTo(map);
};

// Fonction pour ajouter des marqueurs de démonstration
export const addDemoMarkers = (map: mapboxgl.Map, userLocation: [number, number] | null) => {
  const baseLocation = userLocation || [-4.2634, 15.2429];
  
  [
    { offset: [0.01, 0.008], color: '#FF5733', title: 'Restaurant Mami Wata' },
    { offset: [-0.008, 0.012], color: '#33FF57', title: 'Le Grill du Congo' },
    { offset: [0.015, -0.01], color: '#3357FF', title: 'Saveurs de Kinshasa' }
  ].forEach(marker => {
    const el = document.createElement('div');
    el.className = 'demo-marker';
    el.style.width = '15px';
    el.style.height = '15px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = marker.color;
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(marker.title);

    new mapboxgl.Marker(el)
      .setLngLat([baseLocation[1] + marker.offset[1], baseLocation[0] + marker.offset[0]])
      .setPopup(popup)
      .addTo(map);
  });
};

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
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = marker.color || '#FF5733';
      el.style.width = `${marker.size || 20}px`;
      el.style.height = `${marker.size || 20}px`;
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      
      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map);
      
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(marker.id);
        });
      }
      
      markerRefs.current[marker.id] = mapboxMarker;
    });

    return () => {
      Object.values(markerRefs.current).forEach(marker => marker.remove());
    };
  }, [map, markers, onMarkerClick]);

  return null;
};

export default HomeMapMarkers;
