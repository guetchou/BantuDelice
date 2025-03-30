
import { TaxiVehicleType } from '@/types/taxi';

/**
 * Estimates the price for a ride based on distance and vehicle type
 * 
 * @param distance_km Distance in kilometers
 * @param vehicleType Type of vehicle requested
 * @returns Estimated price in FCFA
 */
export const estimatePrice = (distance_km: number, vehicleType: TaxiVehicleType): number => {
  // Base prices for different vehicle types (in FCFA)
  const basePrices = {
    standard: 1000,
    premium: 1500,
    suv: 1800,
    van: 2000,
    motorcycle: 800,
    bicycle: 500,
    scooter: 700,
    car: 1000
  };
  
  // Per kilometer rates for different vehicle types (in FCFA)
  const perKmRates = {
    standard: 300,
    premium: 400,
    suv: 450,
    van: 500,
    motorcycle: 200,
    bicycle: 150,
    scooter: 180,
    car: 300
  };
  
  // Calculate the price based on base price and distance
  const basePrice = basePrices[vehicleType];
  const distanceCharge = perKmRates[vehicleType] * distance_km;
  
  // Total price calculation with rounding to nearest 100 FCFA
  const totalPrice = Math.round((basePrice + distanceCharge) / 100) * 100;
  
  // Ensure minimum price
  return Math.max(totalPrice, basePrices[vehicleType]);
};

/**
 * Get a detailed estimate with breakdown of costs
 */
export const getDetailedEstimate = (distance_km: number, duration_min: number, vehicleType: TaxiVehicleType) => {
  // Base prices for different vehicle types (in FCFA)
  const basePrices = {
    standard: 1000,
    premium: 1500,
    suv: 1800,
    van: 2000,
    motorcycle: 800,
    bicycle: 500,
    scooter: 700,
    car: 1000
  };
  
  // Per kilometer rates for different vehicle types (in FCFA)
  const perKmRates = {
    standard: 300,
    premium: 400,
    suv: 450,
    van: 500,
    motorcycle: 200,
    bicycle: 150,
    scooter: 180,
    car: 300
  };
  
  // Per minute waiting rates (in FCFA)
  const perMinuteRates = {
    standard: 20,
    premium: 30,
    suv: 35,
    van: 40,
    motorcycle: 15,
    bicycle: 10,
    scooter: 12,
    car: 20
  };
  
  // Calculate the components of the price
  const basePrice = basePrices[vehicleType];
  const distanceCharge = perKmRates[vehicleType] * distance_km;
  const timeCharge = perMinuteRates[vehicleType] * duration_min;
  const serviceFee = Math.round((basePrice + distanceCharge + timeCharge) * 0.05); // 5% service fee
  
  // Total price calculation with rounding to nearest 100 FCFA
  const subtotal = basePrice + distanceCharge + timeCharge;
  const totalPrice = Math.round((subtotal + serviceFee) / 100) * 100;
  
  return {
    basePrice,
    distanceCharge,
    timeCharge,
    serviceFee,
    subtotal,
    totalPrice,
    currency: 'FCFA'
  };
};
