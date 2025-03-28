
import { useState, useEffect } from 'react';
import { BookingFormState } from './types';
import { estimatePrice } from '@/hooks/pricingModules/quickEstimates';

export const usePriceCalculation = (formState: BookingFormState) => {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

  useEffect(() => {
    // Calculer le prix estimé seulement si les coordonnées sont définies
    if (
      formState.pickupLatitude &&
      formState.pickupLongitude &&
      formState.destinationLatitude &&
      formState.destinationLongitude
    ) {
      // Calculer la distance
      const distance = getDistance();
      
      // Si une distance valide est disponible, calculer le prix
      if (distance && distance > 0) {
        // Déterminer si c'est une heure de pointe
        const currentHour = new Date().getHours();
        const isPeakHour = (currentHour >= 7 && currentHour <= 9) || 
                           (currentHour >= 17 && currentHour <= 19);
        
        // Calculer le prix
        const priceEstimate = calculatePriceEstimate(
          distance,
          isPeakHour,
          formState.vehicleType,
          formState.isSharedRide
        );
        
        setEstimatedPrice(priceEstimate);
      }
    }
  }, [
    formState.pickupLatitude,
    formState.pickupLongitude,
    formState.destinationLatitude,
    formState.destinationLongitude,
    formState.vehicleType,
    formState.isSharedRide
  ]);

  const getDistance = (): number | null => {
    if (
      !formState.pickupLatitude ||
      !formState.pickupLongitude ||
      !formState.destinationLatitude ||
      !formState.destinationLongitude
    ) {
      return null;
    }

    // Utiliser la distance calculée
    const latDiff = formState.destinationLatitude - formState.pickupLatitude;
    const lngDiff = formState.destinationLongitude - formState.pickupLongitude;
    
    // Distance Euclidienne simplifiée pour démo
    // Dans une app réelle, on utiliserait des API pour distance routière
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // approximation de km
    
    return parseFloat(distance.toFixed(2));
  };

  const calculatePriceEstimate = (
    distance: number,
    isPeakHour: boolean,
    vehicleType: string,
    isSharedRide: boolean
  ): number => {
    // Utiliser le service d'estimation de prix existant
    const { amount } = estimatePrice(distance, vehicleType as any);
    
    // Appliquer une réduction pour les courses partagées
    let finalPrice = amount;
    if (isSharedRide) {
      finalPrice = Math.round(finalPrice * 0.8); // 20% de réduction
    }
    
    // Majoration en heure de pointe
    if (isPeakHour) {
      finalPrice = Math.round(finalPrice * 1.2); // 20% de supplément
    }
    
    return finalPrice;
  };

  return {
    estimatedPrice
  };
};
