
import mapboxgl from 'mapbox-gl';

// Reverse geocode coordinates to address
export const reverseGeocode = async (coordinates: [number, number]): Promise<string> => {
  const [lng, lat] = coordinates;
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    return 'Adresse inconnue';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Adresse inconnue';
  }
};

// Forward geocode address to coordinates
export const forwardGeocode = async (address: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}&limit=1`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return [lng, lat];
    }
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};
