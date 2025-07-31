
import { useState } from 'react';
import { TaxiVehicleType, PriceRange, PricingFactors } from '@/types/taxi';
import { estimatePrice, getPriceRange } from '@/hooks/pricingModules/quickEstimates';

export const useTaxiPricing = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
  const [loading, setLoading] = useState(false);
  
  // Calculer le prix estimé basé sur la distance et le type de véhicule
  const calculatePrice = (distance: number, vehicleType: TaxiVehicleType): number => {
    const price = estimatePrice(distance, vehicleType);
    setEstimatedPrice(price);
    return price;
  };
  
  // Obtenir une fourchette de prix
  const getEstimatedPriceRange = (distance: number, vehicleType: TaxiVehicleType): PriceRange => {
    const range = getPriceRange(distance, vehicleType);
    setPriceRange(range);
    return range;
  };
  
  // Calculer le prix avec d'autres facteurs (moments de la journée, etc.)
  const calculatePriceWithFactors = async (factors: PricingFactors): Promise<number> => {
    setLoading(true);
    
    try {
      // Simuler un traitement côté serveur
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const baseFare = factors.distance 
        ? estimatePrice(factors.distance, factors.vehicle_type || 'standard') 
        : 2000;
      
      let multiplier = 1.0;
      
      // Facteur heure de pointe
      if (factors.time_of_day === 'peak') {
        multiplier *= 1.2; // +20% pendant les heures de pointe
      } else if (factors.time_of_day === 'night') {
        multiplier *= 1.3; // +30% pendant la nuit
      }
      
      // Facteur premium
      if (factors.is_premium) {
        multiplier *= 1.15; // +15% pour service premium
      }
      
      const finalPrice = Math.round(baseFare * multiplier / 100) * 100;
      setEstimatedPrice(finalPrice);
      
      // Calculer une fourchette de prix
      const minPrice = Math.floor(finalPrice * 0.85 / 100) * 100;
      const maxPrice = Math.ceil(finalPrice * 1.15 / 100) * 100;
      
      setPriceRange({ min: minPrice, max: maxPrice, currency: 'FCFA' });
      
      return finalPrice;
    } catch (error) {
      console.error('Erreur lors du calcul du prix', error);
      return 0;
    } finally {
      setLoading(false);
    }
  };
  
  // Formater le prix
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Obtenir une estimation rapide pour l'affichage
  const getQuickEstimate = (distance: number, vehicleType: TaxiVehicleType): string => {
    const price = estimatePrice(distance, vehicleType);
    return formatPrice(price);
  };
  
  return {
    estimatedPrice,
    priceRange,
    loading,
    calculatePrice,
    getEstimatedPriceRange,
    calculatePriceWithFactors,
    formatPrice,
    getQuickEstimate
  };
};
