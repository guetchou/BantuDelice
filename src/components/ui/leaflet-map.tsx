
import React, { ReactNode } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet's default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Define custom Leaflet icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: [number, number];
  zoom: number;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  scrollWheelZoom?: boolean;
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  className = '',
  style = {},
  children,
  scrollWheelZoom = true
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

interface MarkerProps {
  position: [number, number];
  children?: ReactNode;
  icon?: L.Icon;
  eventHandlers?: any;
}

export const CustomMarker: React.FC<MarkerProps> = ({
  position,
  children,
  icon = DefaultIcon,
  eventHandlers = {}
}) => {
  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={eventHandlers}
    >
      {children && <Popup>{children}</Popup>}
    </Marker>
  );
};

interface CircleProps {
  center: [number, number];
  radius: number;
  pathOptions?: {
    color: string;
    fillColor: string;
    fillOpacity: number;
  };
  children?: ReactNode;
}

export const CustomCircle: React.FC<CircleProps> = ({
  center,
  radius,
  pathOptions = { color: 'blue', fillColor: 'blue', fillOpacity: 0.2 },
  children
}) => {
  return (
    <Circle
      center={center}
      pathOptions={pathOptions}
      radius={radius}
    >
      {children && <Popup>{children}</Popup>}
    </Circle>
  );
};

interface PolylineProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export const CustomPolyline: React.FC<PolylineProps> = ({
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

export default MapContainer;
