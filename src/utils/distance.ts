
/**
 * Calculate distance between two geographic coordinates in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance in a user-friendly way
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    // Less than 1 km, show in meters
    return `${Math.round(distance * 1000)} m`;
  }
  // 1 km or more, show in km with 1 decimal point
  return `${distance.toFixed(1)} km`;
}

/**
 * Estimate travel time based on distance (rough approximation)
 * @param distance Distance in kilometers
 * @param speedKmh Speed in kilometers per hour
 * @returns Estimated time in minutes
 */
export function estimateTravelTime(distance: number, speedKmh = 30): number {
  // Time = distance / speed (in hours), then convert to minutes
  return Math.round((distance / speedKmh) * 60);
}

/**
 * Format duration in minutes to a user-friendly string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
}
