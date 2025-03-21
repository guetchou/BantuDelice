
import React, { ReactNode, CSSProperties } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define props types
interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface MarkerProps {
  position: [number, number];
  icon?: any;
  children?: ReactNode;
  onClick?: (e: L.LeafletMouseEvent) => void;
}

interface CircleMarkerProps {
  center: [number, number];
  radius: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  children?: ReactNode;
}

interface PolylineProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

// Default icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map component
export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  scrollWheelZoom = true,
  className = '',
  style = {},
  children
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={`h-[50vh] w-full rounded-md ${className}`}
      style={style}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

// Marker component
export const LeafletMarker: React.FC<MarkerProps> = ({
  position,
  icon = defaultIcon,
  children,
  onClick
}) => {
  return (
    <Marker 
      position={position} 
      icon={icon} 
      eventHandlers={{ click: onClick }}
    >
      {children && <Popup>{children}</Popup>}
    </Marker>
  );
};

// Circle component
export const LeafletCircle: React.FC<CircleMarkerProps> = ({
  center,
  radius,
  color = 'blue',
  fillColor = 'blue',
  fillOpacity = 0.2,
  children
}) => {
  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{ color, fillColor, fillOpacity }}
    >
      {children && <Popup>{children}</Popup>}
    </Circle>
  );
};

// Polyline component
export const LeafletPolyline: React.FC<PolylineProps> = ({
  positions,
  color = 'blue',
  weight = 3,
  opacity = 0.7,
  dashArray = ''
}) => {
  return (
    <Polyline
      positions={positions}
      pathOptions={{ color, weight, opacity, dashArray }}
    />
  );
};

// MapController for updating view
export const MapController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  
  return null;
};

export default LeafletMap;
