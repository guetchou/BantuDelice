
import { useState } from 'react';
import { BusinessRateEstimate } from '../pricingModules/types';
import { calculateBusinessRateEstimate } from '../pricingModules/subscriptionPricing';
import { toast } from 'sonner';

export function useBusinessRate() {
  const [isLoading, setIsLoading] = useState(false);
  const [businessRateEstimate, setBusinessRateEstimate] = useState<BusinessRateEstimate | null>(null);

  const calculateRate = async (
    monthlyRides: number,
    averageRideDistance: number,
    vehicleType: string
  ) => {
    try {
      setIsLoading(true);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const estimate = calculateBusinessRateEstimate(
        monthlyRides,
        averageRideDistance,
        vehicleType as any
      );
      
      setBusinessRateEstimate(estimate);
      return estimate;
    } catch (error) {
      console.error('Error calculating business rate:', error);
      toast.error('Erreur lors du calcul du tarif business');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyForBusinessAccount = async (
    companyName: string,
    contactEmail: string,
    monthlyRides: number
  ) => {
    try {
      setIsLoading(true);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Demande envoyée pour ${companyName}`, {
        description: `Nous vous contacterons à ${contactEmail} dans les plus brefs délais.`
      });
      
      return true;
    } catch (error) {
      console.error('Error applying for business account:', error);
      toast.error('Erreur lors de la demande de compte business');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    businessRateEstimate,
    calculateRate,
    applyForBusinessAccount
  };
}
