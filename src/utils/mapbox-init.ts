// Mapbox Initialization Utility
// This file handles Mapbox initialization and configuration

// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibGF1cmVudGRldm1vIiwiYSI6ImNsdTF2NnN6djJrbHkya24wZWJreTBhcGEifQ.3tdP2ZwJRrdGVouUYnHxFA',
  defaultStyle: 'mapbox://styles/mapbox/streets-v12',
  defaultCenter: [15.2429, -4.2634] as [number, number], // Brazzaville
  defaultZoom: 13,
  maxZoom: 18,
  minZoom: 8
};

// Initialize Mapbox with the access token
export const initializeMapbox = () => {
  if (typeof window !== 'undefined' && (window as any).mapboxgl) {
    (window as any).mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    console.log('Mapbox initialized with token:', MAPBOX_CONFIG.accessToken ? '✅ Configured' : '⚠️ Using fallback token');
  }
};

// Check if Mapbox is available
export const isMapboxAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).mapboxgl;
};

// Get Mapbox instance
export const getMapbox = () => {
  if (isMapboxAvailable()) {
    return (window as any).mapboxgl;
  }
  throw new Error('Mapbox is not available');
};

// Create a Mapbox map instance
export const createMapboxMap = (container: HTMLElement, options: any = {}) => {
  const mapbox = getMapbox();
  
  return new mapbox.Map({
    container,
    style: MAPBOX_CONFIG.defaultStyle,
    center: MAPBOX_CONFIG.defaultCenter,
    zoom: MAPBOX_CONFIG.defaultZoom,
    ...options
  });
};

// Geocoding utility
export const geocodeAddress = async (address: string): Promise<any> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=CG&language=fr`
  );
  
  if (!response.ok) {
    throw new Error('Geocoding failed');
  }
  
  const data = await response.json();
  return data;
};

// Reverse geocoding utility
export const reverseGeocode = async (coordinates: [number, number]): Promise<any> => {
  const [lng, lat] = coordinates;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_CONFIG.accessToken}&language=fr`
  );
  
  if (!response.ok) {
    throw new Error('Reverse geocoding failed');
  }
  
  const data = await response.json();
  return data;
};

// Calculate route between two points
export const calculateRoute = async (
  from: [number, number], 
  to: [number, number], 
  profile: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<any> => {
  const [fromLng, fromLat] = from;
  const [toLng, toLat] = to;
  
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&access_token=${MAPBOX_CONFIG.accessToken}`
  );
  
  if (!response.ok) {
    throw new Error('Route calculation failed');
  }
  
  const data = await response.json();
  return data;
};

// Calculate distance between two points
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance for display
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Format duration for display
export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

// Initialize Mapbox when this module is imported
if (typeof window !== 'undefined') {
  initializeMapbox();
} 