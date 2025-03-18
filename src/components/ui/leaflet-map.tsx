
import React from 'react';
import { 
  MapContainer as LeafletMapContainer, 
  TileLayer as LeafletTileLayer, 
  Marker as LeafletMarker, 
  Popup as LeafletPopup,
  Polyline as LeafletPolyline
} from 'react-leaflet';
import { 
  MapContainerProps, 
  TileLayerProps, 
  MarkerProps, 
  PopupProps, 
  PolylineProps 
} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

// Wrapper components to ensure compatibility with the latest react-leaflet

export const MapContainer: React.FC<MapContainerProps & { 
  center?: [number, number];
  zoom?: number;
  children: React.ReactNode;
}> = ({ center, zoom, children, ...props }) => {
  return (
    <LeafletMapContainer 
      {...props}
      center={center}
      zoom={zoom}
    >
      {children}
    </LeafletMapContainer>
  );
};

export const TileLayer: React.FC<TileLayerProps & {
  attribution?: string;
}> = ({ attribution, ...props }) => {
  return (
    <LeafletTileLayer 
      {...props}
      attribution={attribution}
    />
  );
};

export const Marker: React.FC<MarkerProps & {
  icon?: any;
  position: [number, number];
  eventHandlers?: {
    click?: (e: LeafletMouseEvent) => void;
  };
}> = ({ icon, position, eventHandlers, children, ...props }) => {
  return (
    <LeafletMarker 
      {...props}
      position={position}
      icon={icon}
      eventHandlers={eventHandlers}
    >
      {children}
    </LeafletMarker>
  );
};

export const Popup: React.FC<PopupProps & {
  children: React.ReactNode;
}> = ({ children, ...props }) => {
  return (
    <LeafletPopup {...props}>
      {children}
    </LeafletPopup>
  );
};

export const Polyline: React.FC<PolylineProps & {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}> = ({ positions, color, weight, opacity, dashArray, ...props }) => {
  const pathOptions = {
    color,
    weight,
    opacity,
    dashArray
  };
  
  return (
    <LeafletPolyline 
      {...props}
      positions={positions}
      pathOptions={pathOptions}
    />
  );
};
