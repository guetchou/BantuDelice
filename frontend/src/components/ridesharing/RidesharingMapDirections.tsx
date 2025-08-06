
import mapboxgl from 'mapbox-gl';

interface RouteDirectionsProps {
  map: mapboxgl.Map | null;
  routeLine: mapboxgl.GeoJSONSource | null;
  pickupCoordinates: [number, number];
  destinationCoordinates: [number, number];
  routeVisible: boolean;
  onFitBounds?: (bounds: mapboxgl.LngLatBounds) => void;
}

export const getRouteDirections = async ({
  map,
  routeLine,
  pickupCoordinates,
  destinationCoordinates,
  routeVisible,
  onFitBounds
}: RouteDirectionsProps): Promise<void> => {
  if (!map || !routeLine || !routeVisible) return;
  
  if (pickupCoordinates && destinationCoordinates) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry.coordinates;
        
        // Update route line
        routeLine.setData({
          type: 'Feature',
          properties: Record<string, unknown>,
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        });
        
        // Fit map to show entire route
        if (map) {
          const bounds = new mapboxgl.LngLatBounds();
          route.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
          
          map.fitBounds(bounds, {
            padding: 60,
            maxZoom: 15
          });
          
          if (onFitBounds) {
            onFitBounds(bounds);
          }
        }
      }
    } catch (error) {
      console.error('Directions API error:', error);
    }
  } else {
    // Clear route if pickup or destination is missing
    routeLine.setData({
      type: 'Feature',
      properties: Record<string, unknown>,
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    });
  }
};

export const initializeRouteLayer = (map: mapboxgl.Map | null): mapboxgl.GeoJSONSource | null => {
  if (!map) return null;

  // Add route source and layer
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: Record<string, unknown>,
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    }
  });
  
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3AAB67',
      'line-width': 5,
      'line-opacity': 0.75
    }
  });
  
  return map.getSource('route') as mapboxgl.GeoJSONSource;
};
