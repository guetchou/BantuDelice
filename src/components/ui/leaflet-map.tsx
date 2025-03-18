
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
import { LeafletMouseEvent, Icon } from 'leaflet';

// Wrapper components to ensure compatibility with the latest react-leaflet
export interface ExtendedMapContainerProps extends MapContainerProps {
  center?: [number, number];
  zoom?: number;
  children: React.ReactNode;
  scrollWheelZoom?: boolean;
}

export interface ExtendedTileLayerProps extends TileLayerProps {
  attribution?: string;
  url: string;
}

export interface ExtendedMarkerProps extends Omit<MarkerProps, 'position'> {
  position: [number, number];
  icon?: Icon;
  eventHandlers?: {
    click?: (e: LeafletMouseEvent) => void;
    [key: string]: any;
  };
  children?: React.ReactNode;
}

export interface ExtendedPolylineProps extends PolylineProps {
  positions: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
}

export const MapContainer: React.FC<ExtendedMapContainerProps> = ({ 
  center, 
  zoom, 
  children,
  scrollWheelZoom,
  ...props 
}) => {
  return (
    <LeafletMapContainer 
      {...props}
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
    >
      {children}
    </LeafletMapContainer>
  );
};

export const TileLayer: React.FC<ExtendedTileLayerProps> = ({ 
  attribution, 
  url,
  ...props 
}) => {
  return (
    <LeafletTileLayer 
      {...props}
      attribution={attribution}
      url={url}
    />
  );
};

export const Marker: React.FC<ExtendedMarkerProps> = ({ 
  icon, 
  position, 
  eventHandlers, 
  children,
  ...props 
}) => {
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

export const Polyline: React.FC<ExtendedPolylineProps> = ({ 
  positions, 
  color, 
  weight, 
  opacity, 
  dashArray,
  ...props 
}) => {
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
