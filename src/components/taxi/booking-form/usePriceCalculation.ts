
import { useEffect, useState } from 'react';
import { BookingFormState } from './types';
import { calculateDistance } from '@/utils/deliveryOptimization';

export function usePriceCalculation(formState: BookingFormState) {
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const calculateEstimatedPrice = () => {
    if (
      formState.pickupLatitude && 
      formState.pickupLongitude && 
      formState.destinationLatitude && 
      formState.destinationLongitude
    ) {
      // Calculate distance
      const distance = calculateDistance(
        formState.pickupLatitude,
        formState.pickupLongitude,
        formState.destinationLatitude,
        formState.destinationLongitude
      );
      
      // Base price calculations
      let basePrice = 1000; // Base fare
      
      // Add distance-based fare
      const farePerKm = {
        standard: 300,
        comfort: 400,
        premium: 600,
        van: 700
      };
      
      const rate = farePerKm[formState.vehicleType as keyof typeof farePerKm] || farePerKm.standard;
      const distanceFare = distance * rate;
      
      // Calculate total
      let totalPrice = basePrice + distanceFare;
      
      // Apply shared ride discount if applicable
      if (formState.isSharedRide) {
        const discountPercentage = 15 + (formState.maxPassengers * 5); // 15% base + 5% per additional passenger
        totalPrice = totalPrice * (1 - (discountPercentage / 100));
      }
      
      // Round to nearest 100
      totalPrice = Math.ceil(totalPrice / 100) * 100;
      
      setEstimatedPrice(totalPrice);
    }
  };

  // Update estimated price when relevant fields change
  useEffect(() => {
    calculateEstimatedPrice();
  }, [
    formState.pickupLatitude, 
    formState.pickupLongitude, 
    formState.destinationLatitude, 
    formState.destinationLongitude,
    formState.vehicleType,
    formState.isSharedRide,
    formState.maxPassengers
  ]);

  return { estimatedPrice };
}
