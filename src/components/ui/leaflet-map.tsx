
import React, { useEffect, useRef, ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  children: ReactNode | ReactNode[];
  className?: string;
  style?: React.CSSProperties;
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
}

export function LeafletMap({ 
  children, 
  className, 
  style, 
  center = [48.8566, 2.3522], // Default to Paris
  zoom = 13,
  scrollWheelZoom = true
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        scrollWheelZoom: scrollWheelZoom
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
      // Update center and zoom if they change
      mapRef.current.setView(center, zoom);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, scrollWheelZoom]);

  // Provide the map context to children
  return (
    <div 
      ref={mapContainerRef} 
      className={className} 
      style={{ height: '400px', width: '100%', ...style }}
    >
      {/* Children will be rendered by the parent component */}
      {mapRef.current && React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { map: mapRef.current });
        }
        return child;
      })}
    </div>
  );
}

export const MapContainer = LeafletMap;

export const TileLayer = ({ 
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; OpenStreetMap contributors'
}: { 
  url?: string, 
  attribution?: string,
  map?: L.Map 
}) => {
  return null; // This is just a placeholder for compatibility
};

export const Marker = ({ 
  position, 
  icon,
  children,
  map
}: { 
  position: [number, number],
  icon?: any,
  children?: ReactNode,
  map?: L.Map
}) => {
  const markerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create marker
    const markerOptions: L.MarkerOptions = {};
    if (icon) {
      markerOptions.icon = icon;
    }

    markerRef.current = L.marker(position, markerOptions).addTo(map);

    // Add popup if children provided
    if (children && React.isValidElement(children)) {
      const popupContent = document.createElement('div');
      popupRef.current = L.popup().setContent(popupContent);
      markerRef.current.bindPopup(popupRef.current);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, position, icon]);

  return null;
};

export const Popup = ({ children }: { children: ReactNode }) => {
  return null; // This is just a placeholder for compatibility
};

export const Polyline = ({
  positions,
  color = 'blue',
  weight = 3,
  opacity = 0.7,
  dashArray = '',
  map
}: {
  positions: [number, number][],
  color?: string,
  weight?: number,
  opacity?: number,
  dashArray?: string,
  map?: L.Map
}) => {
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!map || !positions.length) return;

    polylineRef.current = L.polyline(positions, {
      color,
      weight,
      opacity,
      dashArray
    }).addTo(map);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.remove();
      }
    };
  }, [map, positions, color, weight, opacity, dashArray]);

  return null;
};
