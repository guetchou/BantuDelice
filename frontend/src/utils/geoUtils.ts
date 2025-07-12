
/**
 * Calculate the distance between two points in kilometers
 * Uses the Haversine formula
 * 
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Convert latitude and longitude from degrees to radians
  const radiansLat1 = (lat1 * Math.PI) / 180;
  const radiansLon1 = (lon1 * Math.PI) / 180;
  const radiansLat2 = (lat2 * Math.PI) / 180;
  const radiansLon2 = (lon2 * Math.PI) / 180;

  // Haversine formula
  const dlon = radiansLon2 - radiansLon1;
  const dlat = radiansLat2 - radiansLat1;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  
  // Radius of earth in kilometers
  const r = 6371;
  
  // Calculate the result
  return c * r;
}

/**
 * Calculate the estimated duration of a journey in minutes based on distance and travel mode
 * 
 * @param distanceKm Distance in kilometers
 * @param mode Travel mode (car, bike, walk)
 * @returns Estimated duration in minutes
 */
export function calculateDuration(
  distanceKm: number, 
  mode: 'car' | 'bike' | 'walk' = 'car'
): number {
  // Average speeds in km/h
  const speeds = {
    car: 40, // Average urban speed for car
    bike: 15, // Average speed for bicycle
    walk: 5   // Average walking speed
  };
  
  // Calculate time in hours
  const timeHours = distanceKm / speeds[mode];
  
  // Convert to minutes
  const timeMinutes = timeHours * 60;
  
  // Round to nearest minute
  return Math.round(timeMinutes);
}

/**
 * Calculate a point at a certain distance from a starting point
 * in a specified direction (bearing)
 * 
 * @param lat Starting latitude
 * @param lon Starting longitude
 * @param distance Distance in kilometers
 * @param bearing Direction in degrees (0 = North, 90 = East, etc.)
 * @returns New coordinates [latitude, longitude]
 */
export function calculatePointFromDistance(
  lat: number,
  lon: number,
  distance: number,
  bearing: number
): [number, number] {
  const R = 6371; // Earth's radius in km
  
  // Convert to radians
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const bearingRad = (bearing * Math.PI) / 180;
  
  // Calculate angular distance
  const angularDistance = distance / R;
  
  // Calculate new latitude
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
    Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );
  
  // Calculate new longitude
  const newLonRad = lonRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
    Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
  );
  
  // Convert back to degrees
  const newLat = (newLatRad * 180) / Math.PI;
  const newLon = (newLonRad * 180) / Math.PI;
  
  return [newLat, newLon];
}

/**
 * Generate a simplified polyline between two points
 * (with a few intermediate points to make it look like a realistic route)
 * 
 * @param point1 Starting point [latitude, longitude]
 * @param point2 Ending point [latitude, longitude]
 * @param numPoints Number of intermediate points
 * @param variabilityFactor How much the route can deviate (higher = more variation)
 * @returns Array of points representing the polyline
 */
export function generateRoutePolyline(
  point1: [number, number],
  point2: [number, number],
  numPoints: number = 5,
  variabilityFactor: number = 0.2
): Array<[number, number]> {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  const points: Array<[number, number]> = [point1];
  
  // Direct distance between the points
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  
  // Maximum deviation in km
  const maxDeviation = distance * variabilityFactor;
  
  // Generate intermediate points
  for (let i = 1; i < numPoints; i++) {
    // Linear interpolation between points
    const ratio = i / numPoints;
    const lat = lat1 + (lat2 - lat1) * ratio;
    const lon = lon1 + (lon2 - lon1) * ratio;
    
    // Add some randomness to make the route look more realistic
    // (perpendicular to the straight line)
    const bearing = (Math.atan2(lon2 - lon1, lat2 - lat1) * 180 / Math.PI + 90) % 360;
    
    // Random distance (negative or positive) to deviate
    const deviationDistance = (Math.random() - 0.5) * 2 * maxDeviation;
    
    // Calculate the new point with deviation
    const [newLat, newLon] = calculatePointFromDistance(lat, lon, deviationDistance, bearing);
    
    points.push([newLat, newLon]);
  }
  
  // Add the final point
  points.push(point2);
  
  return points;
}
