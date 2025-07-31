
import React, { useEffect, useRef, ReactNode, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  style?: React.CSSProperties;
  className?: string;
  whenCreated?: (map: L.Map) => void;
}

interface TileLayerProps {
  url: string;
  attribution: string;
}

interface MarkerProps {
  position: [number, number];
  icon?: L.Icon | L.DivIcon;
  children?: ReactNode;
}

const MapContext = React.createContext<L.Map | null>(null);

export const useMap = () => {
  return React.useContext(MapContext);
};

export const MapContainer = forwardRef<L.Map, MapContainerProps>(({
  children,
  center = [48.8566, 2.3522], // Default to Paris
  zoom = 13,
  scrollWheelZoom = true,
  style,
  className,
  whenCreated
}, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom,
        scrollWheelZoom
      });

      if (whenCreated) {
        whenCreated(mapRef.current);
      }

      setMap(mapRef.current);
    } else {
      // Update center and zoom if they change
      mapRef.current.setView(center, zoom);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
      }
    };
  }, [center, zoom, scrollWheelZoom, whenCreated]);

  // Forward the ref
  React.useImperativeHandle(ref, () => mapRef.current as L.Map);

  return (
    <div 
      ref={mapContainerRef} 
      className={className} 
      style={{ height: '400px', width: '100%', ...style }}
    >
      <MapContext.Provider value={map}>
        {map && children}
      </MapContext.Provider>
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export const TileLayer: React.FC<TileLayerProps> = ({ 
  url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; OpenStreetMap contributors'
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const tileLayer = L.tileLayer(url, { attribution }).addTo(map);
    
    return () => {
      tileLayer.remove();
    };
  }, [map, url, attribution]);
  
  return null;
};

export const Marker: React.FC<MarkerProps> = ({ 
  position,
  icon,
  children
}) => {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const [popup, setPopup] = React.useState<L.Popup | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    const markerOptions: L.MarkerOptions = {};
    if (icon) {
      markerOptions.icon = icon;
    }
    
    markerRef.current = L.marker(position, markerOptions).addTo(map);
    
    if (children) {
      const popupDiv = document.createElement('div');
      const newPopup = L.popup().setContent(popupDiv);
      markerRef.current.bindPopup(newPopup);
      setPopup(newPopup);
    }
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, position, icon]);
  
  if (!popup || !children) return null;
  
  // Use React Portal to render children into the popup content
  return null;
};

export const Popup: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const Polyline: React.FC<{
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}> = ({
  positions,
  color = 'blue',
  weight = 3,
  opacity = 0.7,
  dashArray = '',
}) => {
  const map = useMap();
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
        polylineRef.current = null;
      }
    };
  }, [map, positions, color, weight, opacity, dashArray]);

  return null;
};
