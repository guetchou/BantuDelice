
import { TaxiVehicleType } from '@/types/taxi';

const BASE_RATES = {
  standard: 500, // 500 FCFA per km
  comfort: 650,  // 650 FCFA per km
  premium: 800,  // 800 FCFA per km
  van: 900       // 900 FCFA per km
};

const MIN_FARE = {
  standard: 1000,
  comfort: 1500,
  premium: 2500,
  van: 3000
};

const BOOKING_FEE = 500; // 500 FCFA booking fee

/**
 * Provides a quick fare estimate based on distance and vehicle type
 * @param distance Distance in kilometers
 * @param vehicleType Type of vehicle
 * @returns Estimated fare in FCFA
 */
export const estimatePrice = (distance: number, vehicleType: TaxiVehicleType): number => {
  // Apply the rate based on vehicle type
  const rate = BASE_RATES[vehicleType] || BASE_RATES.standard;
  const minFare = MIN_FARE[vehicleType] || MIN_FARE.standard;
  
  // Calculate the base fare
  let fare = Math.round(distance * rate);
  
  // Apply minimum fare if applicable
  fare = Math.max(fare, minFare);
  
  // Add booking fee
  fare += BOOKING_FEE;
  
  // Round to nearest 100 FCFA
  return Math.ceil(fare / 100) * 100;
};

/**
 * Get a quick price estimate formatted as a string
 */
export const getQuickEstimate = (distance: number, vehicleType: TaxiVehicleType): string => {
  const price = estimatePrice(distance, vehicleType);
  return `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
};

/**
 * Generate a price range for display purposes
 */
export const getPriceRange = (distance: number, vehicleType: TaxiVehicleType): {min: number, max: number} => {
  const basePrice = estimatePrice(distance, vehicleType);
  
  // Create range of +/- 15%
  const min = Math.floor((basePrice * 0.85) / 100) * 100;
  const max = Math.ceil((basePrice * 1.15) / 100) * 100;
  
  return { min, max };
};
