
/**
 * Calculate distance between two coordinates
 * @param coord1 - First coordinate [latitude, longitude]
 * @param coord2 - Second coordinate [latitude, longitude]
 * @param unit - Unit of measurement ('km' or 'mi')
 * @param rounded - Whether to round the result
 * @returns Distance in the specified unit
 */
export const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number],
  unit: 'km' | 'mi' = 'km',
  rounded: boolean = false
): number => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = unit === 'km' ? 6371 : 3958.8; // Radius of the Earth in km or miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return rounded ? Math.round(distance * 10) / 10 : distance;
};
