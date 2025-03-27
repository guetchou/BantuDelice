
import { BookingFormState } from './types';

export const initialBookingFormState: BookingFormState = {
  pickupAddress: '',
  pickupLatitude: null,
  pickupLongitude: null,
  destinationAddress: '',
  destinationLatitude: null,
  destinationLongitude: null,
  vehicleType: 'standard',
  paymentMethod: 'cash',
  pickupTime: 'now',
  scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16), // 30 min from now
  specialInstructions: '',
  isSharedRide: false,
  maxPassengers: 0,
  promoCode: ''
};

/**
 * Calcule une distance approximative entre les points de départ et d'arrivée
 */
export function getDistanceEstimate(formState: BookingFormState): number | null {
  if (!formState.pickupLatitude || !formState.pickupLongitude || 
      !formState.destinationLatitude || !formState.destinationLongitude) {
    return null;
  }
  
  // Formule de Haversine pour calculer la distance sur une sphère
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(formState.destinationLatitude - formState.pickupLatitude);
  const dLon = toRad(formState.destinationLongitude - formState.pickupLongitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(formState.pickupLatitude)) * Math.cos(toRad(formState.destinationLatitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Arrondir à 1 décimale
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formate un prix en FCFA
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' FCFA';
}

/**
 * Formate une date d'arrivée estimée
 */
export function formatEstimatedArrival(minutes: number): string {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + minutes * 60 * 1000);
  
  const hours = arrivalTime.getHours().toString().padStart(2, '0');
  const mins = arrivalTime.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${mins}`;
}
