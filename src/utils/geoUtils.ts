
/**
 * Utilitaires pour les calculs géographiques
 */

/**
 * Calcule la distance entre deux points en kilomètres (formule de Haversine)
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(2));
}

/**
 * Convertit des degrés en radians
 */
export function toRad(value: number): number {
  return value * Math.PI / 180;
}

/**
 * Décode un polyline encodé en série de points [lat, lon]
 * Algorithme basé sur l'encodage polyline de Google Maps
 */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat * 1e-5, lng * 1e-5]);
  }
  
  return points;
}

/**
 * Encode une série de points [lat, lon] en polyline
 */
export function encodePolyline(points: [number, number][]): string {
  let output = '';
  let factor = 1e5;
  
  let prevLat = 0;
  let prevLng = 0;

  for (const point of points) {
    const lat = Math.round(point[0] * factor);
    const lng = Math.round(point[1] * factor);

    output += encodeNumber(lat - prevLat);
    output += encodeNumber(lng - prevLng);

    prevLat = lat;
    prevLng = lng;
  }

  return output;
}

/**
 * Encode un nombre pour le polyline
 */
function encodeNumber(num: number): string {
  let output = '';
  
  num = num < 0 ? ~(num << 1) : (num << 1);
  
  while (num >= 0x20) {
    output += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  
  output += String.fromCharCode(num + 63);
  
  return output;
}

/**
 * Calcule le centre géographique d'une liste de points
 */
export function calculateCenter(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0];
  
  let totalLat = 0;
  let totalLng = 0;
  
  for (const point of points) {
    totalLat += point[0];
    totalLng += point[1];
  }
  
  return [totalLat / points.length, totalLng / points.length];
}

/**
 * Calcule les limites (bounds) d'une liste de points
 */
export function calculateBounds(points: [number, number][]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (points.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 };
  }
  
  let north = points[0][0];
  let south = points[0][0];
  let east = points[0][1];
  let west = points[0][1];
  
  for (let i = 1; i < points.length; i++) {
    const [lat, lng] = points[i];
    
    if (lat > north) north = lat;
    if (lat < south) south = lat;
    if (lng > east) east = lng;
    if (lng < west) west = lng;
  }
  
  return { north, south, east, west };
}

/**
 * Vérifie si un point est à l'intérieur d'un polygone (ray casting algorithm)
 */
export function isPointInPolygon(
  point: [number, number], 
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1];
    const yi = polygon[i][0];
    const xj = polygon[j][1];
    const yj = polygon[j][0];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Génère un point aléatoire dans un rayon donné autour d'un centre
 */
export function generateRandomPoint(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): [number, number] {
  // Convertir le rayon de km en degrés (approximatif)
  const radiusLat = radiusKm / 111.32; // 1 degré de latitude = ~111.32 km
  const radiusLng = radiusKm / (111.32 * Math.cos(toRad(centerLat))); // Ajuster pour la longitude
  
  // Générer un angle aléatoire en radians
  const angle = Math.random() * Math.PI * 2;
  
  // Générer une distance aléatoire dans le rayon (racine carrée pour distribution uniforme)
  const distance = Math.sqrt(Math.random()) * radiusKm;
  
  // Convertir la distance en degrés
  const distanceLat = (distance / 111.32) * Math.cos(angle);
  const distanceLng = (distance / (111.32 * Math.cos(toRad(centerLat)))) * Math.sin(angle);
  
  // Calculer les nouvelles coordonnées
  const newLat = centerLat + distanceLat;
  const newLng = centerLng + distanceLng;
  
  return [newLat, newLng];
}
