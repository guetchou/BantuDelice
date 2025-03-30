
import React, { ReactNode, useRef, CSSProperties } from 'react';
import { MapContainer as LeafletMapContainer } from 'react-leaflet/MapContainer';
import { TileLayer as LeafletTileLayer } from 'react-leaflet/TileLayer';
import { Marker as LeafletMarker } from 'react-leaflet/Marker';
import { Popup as LeafletPopup } from 'react-leaflet/Popup';
import { Circle as LeafletCircle } from 'react-leaflet/Circle';
import { Polyline as LeafletPolyline } from 'react-leaflet/Polyline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create custom icons
export const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/562/562678.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3128/3128826.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const customerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const taxiIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1186/1186424.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface MapContainerProps {
  children: ReactNode;
  center: [number, number];
  zoom: number;
  scrollWheelZoom?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  center,
  zoom,
  scrollWheelZoom = true,
  className = '',
  style = {}
}) => {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
      style={style}
    >
      <LeafletTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafletMapContainer>
  );
};

interface MarkerProps {
  children?: ReactNode;
  position: [number, number];
  icon?: any;
  eventHandlers?: any;
}

export const Marker: React.FC<MarkerProps> = ({ 
  children, 
  position, 
  icon = DefaultIcon,
  eventHandlers = {}
}) => {
  return (
    <LeafletMarker 
      position={position} 
      icon={icon}
      eventHandlers={eventHandlers}
    >
      {children}
    </LeafletMarker>
  );
};

export const Popup: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <LeafletPopup>{children}</LeafletPopup>;
};

interface CircleProps {
  children?: ReactNode;
  center: [number, number];
  radius: number;
  pathOptions?: {
    color: string;
    fillColor: string;
    fillOpacity: number;
  };
}

export const Circle: React.FC<CircleProps> = ({ 
  children, 
  center, 
  radius,
  pathOptions = { color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }
}) => {
  return (
    <LeafletCircle 
      center={center} 
      radius={radius} 
      pathOptions={pathOptions}
    >
      {children}
    </LeafletCircle>
  );
};

interface PolylineProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export const Polyline: React.FC<PolylineProps> = ({ 
  positions,
  color = "blue",
  weight = 3,
  opacity = 0.7,
  dashArray = ""
}) => {
  return (
    <LeafletPolyline 
      positions={positions} 
      pathOptions={{ color, weight, opacity, dashArray }}
    />
  );
};

export default {
  MapContainer,
  TileLayer: LeafletTileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  icons: {
    default: DefaultIcon,
    restaurant: restaurantIcon,
    delivery: deliveryIcon,
    customer: customerIcon,
    taxi: taxiIcon
  }
};
