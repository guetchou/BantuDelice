
import React, { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  children: ReactNode | ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

export function LeafletMap({ children, className, style }: LeafletMapProps) {
  // This is just a container, the actual map initialization happens in useEffect
  return (
    <div id="map" className={className} style={{ height: '400px', width: '100%', ...style }}>
      {children}
    </div>
  );
}
