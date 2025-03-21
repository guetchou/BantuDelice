
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapUpdaterProps {
  center: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.length === 2) {
      const currentZoom = zoom || map.getZoom();
      map.setView(center, currentZoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

export default MapUpdater;
