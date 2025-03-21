
export function useFormValidation() {
  const validateStep = (currentStep: number, formState: any) => {
    switch (currentStep) {
      case 1: // Location
        return formState.pickupAddress && 
               formState.destinationAddress && 
               formState.pickupLatitude !== null && 
               formState.pickupLongitude !== null &&
               formState.destinationLatitude !== null && 
               formState.destinationLongitude !== null;
      case 2: // Vehicle
        return formState.vehicleType;
      case 3: // Time and Payment
        if (formState.pickupTime === 'scheduled') {
          return formState.scheduledTime && formState.paymentMethod;
        }
        return formState.paymentMethod;
      case 4: // Driver selection
        return true; // Optional step
      default:
        return true;
    }
  };

  return {
    validateStep
  };
}
