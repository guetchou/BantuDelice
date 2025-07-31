
import { TaxiVehicleType } from '@/types/taxi';

export const useTaxiPricing = () => {
  const baseRates = {
    standard: 500,
    comfort: 750,
    premium: 1000,
    van: 800
  };

  const pricePerKm = {
    standard: 150,
    comfort: 200,
    premium: 300,
    van: 180
  };

  const getQuickEstimate = (distance: number, vehicleType: TaxiVehicleType) => {
    const baseRate = baseRates[vehicleType] || baseRates.standard;
    const kmRate = pricePerKm[vehicleType] || pricePerKm.standard;
    const totalPrice = baseRate + (distance * kmRate);
    
    return `${totalPrice.toLocaleString()} FCFA`;
  };

  const calculateDetailedPrice = (distance: number, vehicleType: TaxiVehicleType, isScheduled = false) => {
    const baseRate = baseRates[vehicleType] || baseRates.standard;
    const kmRate = pricePerKm[vehicleType] || pricePerKm.standard;
    const scheduledFee = isScheduled ? 200 : 0;
    
    const subtotal = baseRate + (distance * kmRate);
    const total = subtotal + scheduledFee;
    
    return {
      baseRate,
      distanceRate: distance * kmRate,
      scheduledFee,
      subtotal,
      total,
      formattedTotal: `${total.toLocaleString()} FCFA`
    };
  };

  return {
    getQuickEstimate,
    calculateDetailedPrice,
    baseRates,
    pricePerKm
  };
};
