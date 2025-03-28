
import { BookingFormState } from '@/components/taxi/booking-form/types';

export function useFormValidation() {
  /**
   * Valide l'étape actuelle du formulaire de réservation
   */
  const validateStep = (currentStep: number, formState: BookingFormState): boolean => {
    switch (currentStep) {
      case 1: // Étape des adresses
        return (
          !!formState.pickupAddress &&
          !!formState.destinationAddress &&
          !!formState.pickupLatitude &&
          !!formState.pickupLongitude &&
          !!formState.destinationLatitude &&
          !!formState.destinationLongitude
        );
        
      case 2: // Étape du véhicule et de l'estimation
        return !!formState.vehicleType;
        
      case 3: // Étape du temps et du paiement
        // Si la course est programmée, vérifier que l'heure est valide
        if (formState.pickupTime === 'scheduled') {
          const scheduledTime = new Date(formState.scheduledTime).getTime();
          const now = Date.now();
          const isValidScheduledTime = scheduledTime > now;
          
          return isValidScheduledTime && !!formState.paymentMethod;
        }
        
        return !!formState.paymentMethod;
        
      case 4: // Étape de la sélection du chauffeur
        // La sélection du chauffeur est optionnelle, donc toujours valide
        return true;
        
      default:
        return false;
    }
  };

  return {
    validateStep
  };
}
