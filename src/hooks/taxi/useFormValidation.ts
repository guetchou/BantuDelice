
import { BookingFormState } from '@/components/taxi/booking-form/BookingFormContext';

export function useFormValidation() {
  /**
   * Valide l'étape actuelle du formulaire
   * @param step Le numéro de l'étape à valider
   * @param formState L'état actuel du formulaire
   * @returns true si l'étape est valide, sinon false
   */
  const validateStep = (step: number, formState: any): boolean => {
    switch (step) {
      case 1: // Étape des adresses
        return validateAddressStep(formState);
      case 2: // Étape du véhicule/partage
        return validateVehicleStep(formState);
      case 3: // Étape de l'heure et paiement
        return validateTimeAndPaymentStep(formState);
      case 4: // Étape de confirmation
        return validateConfirmationStep(formState);
      default:
        return false;
    }
  };
  
  // Valide l'étape des adresses
  const validateAddressStep = (formState: any): boolean => {
    const { 
      pickupAddress, 
      pickupLatitude, 
      pickupLongitude, 
      destinationAddress, 
      destinationLatitude, 
      destinationLongitude 
    } = formState;
    
    // Vérifier si toutes les informations d'adresse sont remplies
    return !!(
      pickupAddress && 
      pickupLatitude && 
      pickupLongitude && 
      destinationAddress && 
      destinationLatitude && 
      destinationLongitude
    );
  };
  
  // Valide l'étape du véhicule et du partage
  const validateVehicleStep = (formState: any): boolean => {
    const { vehicleType } = formState;
    
    // Vérifier si le type de véhicule est sélectionné
    return !!vehicleType;
  };
  
  // Valide l'étape de l'heure et du paiement
  const validateTimeAndPaymentStep = (formState: any): boolean => {
    const { pickupTime, scheduledTime, paymentMethod } = formState;
    
    // Si le pickup est programmé, vérifier qu'une heure est définie
    if (pickupTime === 'scheduled' && !scheduledTime) {
      return false;
    }
    
    // Vérifier que la méthode de paiement est sélectionnée
    return !!paymentMethod;
  };
  
  // Valide l'étape de confirmation finale
  const validateConfirmationStep = (formState: any): boolean => {
    // Cette étape n'a généralement pas de validation supplémentaire
    // mais pourrait vérifier par exemple si les CGU sont acceptées
    return true;
  };
  
  // Valide le formulaire complet
  const validateFullForm = (formState: any): boolean => {
    return (
      validateAddressStep(formState) &&
      validateVehicleStep(formState) &&
      validateTimeAndPaymentStep(formState) &&
      validateConfirmationStep(formState)
    );
  };
  
  return {
    validateStep,
    validateFullForm
  };
}
