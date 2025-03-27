
import { useState, useEffect } from 'react';
import { BookingFormState } from './types';
import { useTaxiPricing } from '@/hooks/useTaxiPricing';

export const usePriceCalculation = (formState: BookingFormState) => {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [priceBreakdown, setPriceBreakdown] = useState<string[]>([]);
  const { calculatePrice, getPriceRange } = useTaxiPricing();

  useEffect(() => {
    const calculateEstimatedPrice = () => {
      // Vérifier que les coordonnées sont disponibles
      if (!formState.pickupLatitude || !formState.destinationLatitude) {
        return;
      }

      // Calculer la distance approximative (formule de Haversine)
      const distance = calculateDistance(
        formState.pickupLatitude,
        formState.pickupLongitude!,
        formState.destinationLatitude,
        formState.destinationLongitude!
      );

      // Calculer une durée approximative (en minutes)
      const duration = Math.ceil(distance * 3); // Approximation: 3 minutes par kilomètre

      // Facteurs pour le calcul du prix
      const pricingFactors = {
        distance,
        duration,
        vehicleType: formState.vehicleType as 'standard' | 'comfort' | 'premium' | 'van',
        time: new Date(),
        isSharedRide: formState.isSharedRide,
        numberOfPassengers: formState.maxPassengers
      };

      // Calculer le prix estimé
      const priceEstimate = calculatePrice(pricingFactors);
      setEstimatedPrice(priceEstimate.totalPrice);
      setPriceBreakdown(priceEstimate.breakdown);

      // Calculer la fourchette de prix
      const range = getPriceRange(pricingFactors);
      setPriceRange({ min: range.min, max: range.max });
    };

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

  return {
    estimatedPrice,
    priceRange,
    priceBreakdown
  };
};

// Calculer la distance entre deux points (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
