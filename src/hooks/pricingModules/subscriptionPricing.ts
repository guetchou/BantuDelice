
import { TaxiVehicleType } from '@/types/taxi';
import { formatCurrency } from '@/utils/formatters';
import { BusinessRateEstimate, SubscriptionDiscount } from './types';

/**
 * Calcule la remise basée sur l'abonnement
 * @param subscriptionId Identifiant de l'abonnement
 * @param vehicleType Type de véhicule
 * @param distance Distance en kilomètres
 * @param currentMonth Mois actuel (optionnel)
 * @returns Informations sur la remise
 */
export function calculateSubscriptionDiscount(
  subscriptionId: string | null,
  vehicleType: TaxiVehicleType,
  distance: number,
  currentMonth?: Date
): SubscriptionDiscount {
  // Valeurs par défaut
  const defaultDiscount: SubscriptionDiscount = {
    discountPercentage: 0,
    monthlyLimit: 0,
    remainingRides: 0,
    applicableVehicleTypes: ['standard', 'comfort', 'premium', 'van']
  };
  
  // Si pas d'abonnement, aucune remise
  if (!subscriptionId) {
    return defaultDiscount;
  }
  
  // Exemple de logique pour différents abonnements
  switch (subscriptionId) {
    case 'sub_basic':
      return {
        discountPercentage: 5,
        monthlyLimit: 10,
        remainingRides: 6, // Exemple
        applicableVehicleTypes: ['standard', 'comfort']
      };
    case 'sub_premium':
      return {
        discountPercentage: 10,
        monthlyLimit: 20,
        remainingRides: 15, // Exemple
        applicableVehicleTypes: ['standard', 'comfort', 'premium']
      };
    case 'sub_business':
      return {
        discountPercentage: 15,
        monthlyLimit: 50,
        remainingRides: 42, // Exemple
        applicableVehicleTypes: ['standard', 'comfort', 'premium', 'van']
      };
    default:
      return defaultDiscount;
  }
}

/**
 * Calcule une estimation de tarif entreprise
 * @param averageDistance Distance moyenne par course
 * @param vehicleType Type de véhicule préféré
 * @param employeeCount Nombre d'employés
 * @param monthlyRides Nombre de courses mensuelles estimées
 * @returns Estimation de tarif entreprise
 */
export function calculateBusinessRateEstimate(
  averageDistance: number,
  vehicleType: TaxiVehicleType,
  employeeCount: number,
  monthlyRides: number
): BusinessRateEstimate {
  // Prix moyen par kilomètre selon le type de véhicule
  const pricePerKm: Record<TaxiVehicleType, number> = {
    standard: 300,
    comfort: 400,
    premium: 600,
    van: 500
  };
  
  // Tarif de base par course selon le type de véhicule
  const baseFare: Record<TaxiVehicleType, number> = {
    standard: 1000,
    comfort: 1500,
    premium: 2500,
    van: 2000
  };
  
  // Calcul du prix moyen par course
  const averagePrice = baseFare[vehicleType] + (pricePerKm[vehicleType] * averageDistance);
  
  // Calcul de la remise en fonction du volume
  let volumeDiscount = 0;
  
  if (monthlyRides >= 100) {
    volumeDiscount = 25; // 25% de remise pour 100+ courses
  } else if (monthlyRides >= 50) {
    volumeDiscount = 20; // 20% de remise pour 50-99 courses
  } else if (monthlyRides >= 30) {
    volumeDiscount = 15; // 15% de remise pour 30-49 courses
  } else if (monthlyRides >= 20) {
    volumeDiscount = 10; // 10% de remise pour 20-29 courses
  } else if (monthlyRides >= 10) {
    volumeDiscount = 5; // 5% de remise pour 10-19 courses
  }
  
  // Remise supplémentaire basée sur le nombre d'employés
  let staffDiscount = 0;
  
  if (employeeCount >= 200) {
    staffDiscount = 8; // 8% de remise pour 200+ employés
  } else if (employeeCount >= 100) {
    staffDiscount = 5; // 5% de remise pour 100-199 employés
  } else if (employeeCount >= 50) {
    staffDiscount = 3; // 3% de remise pour 50-99 employés
  } else if (employeeCount >= 20) {
    staffDiscount = 2; // 2% de remise pour 20-49 employés
  }
  
  // Remise totale (maximum 30%)
  const totalDiscount = Math.min(volumeDiscount + staffDiscount, 30);
  
  // Calcul du prix mensuel total après remise
  const priceWithoutDiscount = averagePrice * monthlyRides;
  const discountAmount = priceWithoutDiscount * (totalDiscount / 100);
  const discountedPrice = priceWithoutDiscount - discountAmount;
  
  // Calcul des économies estimées
  const estimatedSavings = discountAmount;
  
  return {
    monthlyTotal: discountedPrice,
    perRideDiscount: totalDiscount,
    estimatedSavings: estimatedSavings,
    formattedTotal: formatCurrency(discountedPrice),
    formattedSavings: formatCurrency(estimatedSavings),
    minimumRidesForDiscount: 10
  };
}
