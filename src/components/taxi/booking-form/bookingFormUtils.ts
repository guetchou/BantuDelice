
import { TaxiVehicleType } from '@/types/taxi';

export const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
};

export const vehicleTypeToFrench = (type: TaxiVehicleType): string => {
  const translations = {
    standard: 'Standard',
    comfort: 'Confort',
    premium: 'Premium',
    van: 'Van'
  };
  
  return translations[type] || type;
};

export const getEstimatedArrivalTime = (minutes: number): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  
  return now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatAddress = (address: string): string => {
  // Limit address length for UI display
  if (address && address.length > 40) {
    return address.substring(0, 37) + '...';
  }
  return address || '';
};

export const getVehicleDescription = (vehicleType: TaxiVehicleType): string => {
  const descriptions = {
    standard: 'Berline confortable pour 1-4 personnes',
    comfort: 'Plus d\'espace et de confort pour 1-4 personnes',
    premium: 'Véhicule haut de gamme pour 1-3 personnes',
    van: 'Minivan pour 4-7 personnes avec bagages'
  };
  
  return descriptions[vehicleType] || '';
};

export const getVehicleCapacity = (vehicleType: TaxiVehicleType): number => {
  const capacities = {
    standard: 4,
    comfort: 4,
    premium: 3,
    van: 7
  };
  
  return capacities[vehicleType] || 4;
};

export const getPaymentMethodLabel = (method: string): string => {
  const labels = {
    cash: 'Espèces',
    card: 'Carte bancaire',
    mobile_money: 'Mobile Money',
    wallet: 'Portefeuille'
  };
  
  return labels[method] || method;
};
